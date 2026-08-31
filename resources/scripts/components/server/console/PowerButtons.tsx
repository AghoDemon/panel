import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const PowerControlsDiv = styled.div`
    & {
        background-color:var(--secondary);
    }
`;

interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <PowerControlsDiv css={tw`shadow-md rounded p-3 flex text-xs mt-4 justify-center`} className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>
            <Can action={'control.start'}>
                <Button
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    Start
                </Button>
            </Can>
            <Can action={'control.restart'}>
                <Button.Text disabled={!status} onClick={onButtonClick.bind(this, 'restart')}>
                    Restart
                </Button.Text>
            </Can>
            <Can action={'control.stop'}>
                <Button.Danger
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, 'stop')}
                >
                    Stop
                </Button.Danger>
            </Can>
            <Can action={'control.stop'}>
                <Button.Danger
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, 'kill')}
                >
                    <FontAwesomeIcon icon={faSkull}/>
                </Button.Danger>
            </Can>
        </PowerControlsDiv>
    );
};
