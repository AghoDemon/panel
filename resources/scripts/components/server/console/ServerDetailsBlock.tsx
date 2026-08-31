import React, { useEffect, useMemo, useState } from 'react';
import { faCircle, faEthernet, faHdd, faMemory, faMicrochip, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import StatBlock from '@/components/server/console/StatBlock';
import CopyOnClick from '@/components/elements/CopyOnClick';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import classNames from 'classnames';
import tw, { TwStyle } from 'twin.macro';
import styled from 'styled-components/macro';

const DetailsItems = styled.div`
    & {
        display:flex;
        width:100%;
    }
    & .DetailsItem{
        background-color:var(--secondary);
        border-radius:3px;
        margin:5px;
        width:100%;
        padding:25px 25px;
        display:flex;
        align-items: center;
    }
    & .DetailsItem:first-of-type{
        margin-left:0px;
    }
    & .DetailsItem:last-of-type{
        margin-right:0px;
    }
    & .DetailsItem > p{
        display:flex;
        align-items: center;
    }
    & .DetailsItem > p > .Icon{
        font-size:1.5em;
    }
    & .DetailsItem > p > div > span{
        display:block;
    }
    @media (max-width:694px){
        &{
            display:block;
        }
        &{
            .DetailsItem{
                margin: 5px 0px;
            }
        }
    }
`;

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;


function statusToColor (status: string|null, installing: boolean): TwStyle {
    if (installing) {
        status = '';
    }

    switch (status) {
        case 'offline':
            return tw`text-red-500`;
        case 'running':
            return tw`text-green-500`;
        default:
            return tw`text-yellow-500`;
    }
};

const getBackgroundColor = (value: number, max: number | null): string | undefined => {
    const delta = !max ? 0 : value / max;

    if (delta > 0.8) {
        if (delta > 0.9) {
            return 'bg-red-500';
        }
        return 'bg-yellow-500';
    }

    return undefined;
};

const Limit = ({ limit, children }: { limit: string | null; children: React.ReactNode }) => (
    <>
        {children}
        <span className={'ml-1 text-gray-300 text-[70%] select-none'}>/ {limit || <>&infin;</>}</span>
    </>
);

const ServerDetailsBlock = ({ className }: { className?: string }) => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });

    const name = ServerContext.useStoreState(state => state.server.data!.name);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : null,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : null,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : null,
        }),
        [limits]
    );

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            tx: stats.network.tx_bytes,
            rx: stats.network.rx_bytes,
            uptime: stats.uptime || 0,
        });
    });

    return (
        <div>
            <div css={tw`flex mb-5`}>
                <div>
                    <h1 css={tw`text-xl`}>
                    <FontAwesomeIcon
                        icon={faCircle}
                        fixedWidth
                        css={[
                            tw`mr-1 mt-1`,
                            statusToColor(status, isInstalling || isTransferring),
                        ]}
                    />
                    </h1>
                </div>
                <div>        
                    <h1 css={tw`text-xl`}>
                        Manage, {name}
                    </h1>
                    <CopyOnClick text={allocation}>
                        <p css={tw`mt-2`}>
                            <FontAwesomeIcon icon={faEthernet} fixedWidth css={tw`mr-1`}/>
                            <code css={tw`ml-1`}>{allocation}</code>
                        </p>
                    </CopyOnClick>
                </div>
            </div>
            <DetailsItems css={tw`mb-3`}>
                <div className='DetailsItem'>
                    <p>
                        <FontAwesomeIcon icon={faPowerOff} fixedWidth css={tw`mr-3`} className='Icon'/> 
                        <div>
                            {!status ? 'Connecting...' : (isInstalling ? 'Installing' : (isTransferring) ? 'Transferring' : status)}
                            {stats.uptime > 0 &&
                            <span>
                                (<UptimeDuration uptime={stats.uptime / 1000}/>)
                            </span>
                            }
                        </div>
                    </p>
                </div>

                <div className='DetailsItem'>
                    <p>
                        <FontAwesomeIcon icon={faMicrochip} fixedWidth css={tw`mr-3`} className='Icon'/> 
                        <div>
                            {stats.cpu.toFixed(2)}%
                            <span css={tw`text-neutral-500`}> / {textLimits.cpu || <>&infin;</>}</span>
                        </div>
                    </p>
                </div>

                <div className='DetailsItem'>
                    <p>
                        <FontAwesomeIcon icon={faMemory} fixedWidth css={tw`mr-3`} className='Icon'/> 
                        <div>
                            {bytesToString(stats.memory)}
                            <span css={tw`text-neutral-500`}> / {textLimits.memory || <>&infin;</>}</span>
                        </div>
                    </p>
                </div>

                <div className='DetailsItem'>
                    <p>
                        <FontAwesomeIcon icon={faHdd} fixedWidth css={tw`mr-3`} className='Icon'/>
                        <div>
                            {bytesToString(stats.disk)}
                            <span css={tw`text-neutral-500`}> / {textLimits.disk || <>&infin;</>}</span>
                        </div>
                    </p>
                </div>
            </DetailsItems>
        </div>
    );
};

export default ServerDetailsBlock;
