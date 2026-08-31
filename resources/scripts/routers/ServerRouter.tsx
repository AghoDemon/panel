import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import { CSSTransition } from 'react-transition-group';
import Can from '@/components/elements/Can';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import SubNavigation from '@/components/elements/SubNavigation';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faHome, faUserCircle, faTerminal, faFolder, faDatabase, faCalendar, faUsers, faArchive, faNetworkWired, faPlayCircle, faExternalLinkAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import LogoutBtn from '@/components/elements/LogoutBtn';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';
import styled from 'styled-components/macro';
import { Navigation, ComponentLoader } from '@/routers/RouterElements';

const FlexContainer = styled.div`
    & {
        display:flex;
        width:100%;
    }
    @media (max-width:694px){
        display:block;
    }
`;
const ContentBase = styled.div`
    & {
        width:100%;
    }
`;

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <React.Fragment key={'server-router'}>
            <FlexContainer>
                {!uuid || !id ? (
                    error ? (
                        <ServerError message={error} />
                    ) : (
                        <Spinner size={'large'} centered />
                    )
                ) : (
                    <>
                        <CSSTransition timeout={150} classNames={'fade'} appear in>
                        <SubNavigation>
                                <div>
                                    <NavLink to={'/'} exact>
                                        <FontAwesomeIcon icon={faHome}/>
                                        <span>Home</span>
                                    </NavLink>
                                    <NavLink to={'/account'} className='ignore'>
                                        <FontAwesomeIcon icon={faUserCircle}/>
                                            <span>Account</span>
                                    </NavLink>
                                </div>
                                <div>
                                    <Navigation />
                                    {rootAdmin && (
                                        // eslint-disable-next-line react/jsx-no-target-blank
                                        <a href={`/admin/servers/view/${serverId}`} target={'_blank'}>
                                            <FontAwesomeIcon icon={faExternalLinkAlt} /> <span>Admin view</span>
                                        </a>
                                    )}
                                </div>
                                <div className='subNavBottom'>
                                    <LogoutBtn/>
                                </div>
                        </SubNavigation>
                        </CSSTransition>
                        <ContentBase> 
                            <NavigationBar />
                            <InstallListener />
                            <TransferListener />
                            <WebsocketHandler />
                            {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                                <ConflictStateRenderer />
                            ) : (
                                <ErrorBoundary>
                                    <TransitionRouter>
                                        <Switch location={location}>
                                            <ComponentLoader />
                                            <Route path={'*'} component={NotFound} />
                                        </Switch>
                                    </TransitionRouter>
                                </ErrorBoundary>
                            )}
                        </ContentBase>
                    </>
                )}
            </FlexContainer>
        </React.Fragment>
    );
};
