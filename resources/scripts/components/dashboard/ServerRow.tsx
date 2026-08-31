import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && (current / (limit * 1024 * 1024) >= 0.90);

const Icon = memo(styled(FontAwesomeIcon)<{ $alarm: boolean }>`
    ${props => props.$alarm ? tw`text-red-400` : tw`text-neutral-500`};
`, isEqual);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${props => props.$alarm ? tw`text-neutral-100` : tw`text-neutral-400`};
`;

const ServerDetailsDiv = styled.div`
    &{
        display: flex;
        flex-wrap: wrap;
        align-items:center;
    }
    & .detailsItem{
        margin:7px 0px;
        flex: 0 0 auto;
        width: 50%;
        display: inline-block;
    }
    @media (max-width:694px){
        & .detailsItem{
            width: 100%;
        }
    }
`;

const StatusIndicatorBox = styled.div<{ $status: ServerPowerState | undefined }>`
    ${tw`relative`};
    & {
        display:inline-block;
        width:calc(50% - 20px);
        margin:10px;
        background-color:var(--secondary);
        border:1px solid var(--secondary);
        border-radius:3px;
        padding:15px 25px;
    }
    &:hover{
        border:1px solid var(--borders);
    }
    @media (max-width:694px){
        & {
            display:block;
            width:auto;
        }
    }

    & .status-bar {
        ${tw`w-2 bg-red-500 absolute right-0 top-0 z-20 rounded-full m-1 opacity-50 transition-all duration-150`};
        height: calc(100% - 0.5rem);

        ${({ $status }) => (!$status || $status === 'offline') ? tw`bg-red-500` : ($status === 'running' ? tw`bg-green-500` : tw`bg-yellow-500`)};
    }

    &:hover .status-bar {
        ${tw`opacity-75`};
    }
    & .icon{
        padding:10px;
        background-color:var(--primary);
        color:white;
        border-radius:5px;
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            {!!server.description ?
                <div css={tw`flex items-center w-full`}>
                    <div className={'icon'} css={tw`mr-4`}>
                        <FontAwesomeIcon icon={faServer}/>
                    </div>
                    <div>
                        <p css={tw`text-lg break-words`}>{server.name}</p>
                        <p css={tw`text-sm text-neutral-300 break-words`}>{server.description}</p>
                    </div>
                </div>
                :
                <div css={tw`flex items-center mb-1.5 mt-1.5 w-full`}>
                    <div className={'icon'} css={tw`mr-4`}>
                        <FontAwesomeIcon icon={faServer}/>
                    </div>
                    <div>
                        <p css={tw`text-lg break-words`}>{server.name}</p>
                    </div>
                </div>
                }
            <ServerDetailsDiv>
                <div className='detailsItem'>
                    <div css={tw`flex-1`}>
                        <div css={tw`flex`}>
                            <FontAwesomeIcon icon={faEthernet} css={tw`text-neutral-500`}/>
                            <p css={tw`text-sm text-neutral-400 ml-2`}>
                                {server.allocations
                                    .filter((alloc) => alloc.isDefault)
                                    .map((allocation) => (
                                        <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                            {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                        </React.Fragment>
                                    ))}
                            </p>
                        </div>
                    </div>
                </div>
                {(!stats || isSuspended) ?
                    isSuspended ?
                        <div  className='detailsItem'>
                            <div css={tw`flex-1 text-center`}>
                                <span css={tw`bg-red-500 rounded px-2 py-1 text-red-100 text-xs`}>
                                    {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                                </span>
                            </div>
                        </div>
                        :
                        (server.isTransferring || server.status) ?
                            <div  className='detailsItem'>
                                <div css={tw`flex-1 text-center`}>
                                    <span css={tw`bg-neutral-500 rounded px-2 py-1 text-neutral-100 text-xs`}>
                                        {server.isTransferring ?
                                            'Transferring'
                                            :
                                            server.status === 'installing' ? 'Installing' : (
                                                server.status === 'restoring_backup' ?
                                                    'Restoring Backup'
                                                    :
                                                    'Unavailable'
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                            :
                            <Spinner size={'small'}/>
                    :
                    <React.Fragment>
                        <div  className='detailsItem'>
                            <div css={tw`flex-1`}>
                                <div css={tw`flex`}>
                                    <Icon icon={faMicrochip} $alarm={alarms.cpu}/>
                                    <IconDescription $alarm={alarms.cpu}>
                                        {stats.cpuUsagePercent.toFixed(2)} %
                                    </IconDescription>
                                </div>
                                <p css={tw`text-xs text-neutral-500 mt-1`}>of {cpuLimit}</p>
                            </div>
                        </div>
                        <div  className='detailsItem'>
                            <div css={tw`flex-1`}>
                                <div css={tw`flex`}>
                                    <Icon icon={faMemory} $alarm={alarms.memory}/>
                                    <IconDescription $alarm={alarms.memory}>
                                        {bytesToString(stats.memoryUsageInBytes)}
                                    </IconDescription>
                                </div>
                                <p css={tw`text-xs text-neutral-500 mt-1`}>of {memoryLimit}</p>
                            </div>
                        </div>
                        <div  className='detailsItem'>
                            <div css={tw`flex-1`}>
                                <div css={tw`flex`}>
                                    <Icon icon={faHdd} $alarm={alarms.disk}/>
                                    <IconDescription $alarm={alarms.disk}>
                                        {bytesToString(stats.diskUsageInBytes)}
                                    </IconDescription>
                                </div>
                                <p css={tw`text-xs text-neutral-500 mt-1`}>of {diskLimit}</p>
                            </div>
                        </div>
                    </React.Fragment>
                }
                </ServerDetailsDiv>
            <div className={'status-bar'}/>
        </StatusIndicatorBox>
    );
};
