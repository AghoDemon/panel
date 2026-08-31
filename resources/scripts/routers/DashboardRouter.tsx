import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import LogoutBtn from '@/components/elements/LogoutBtn';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faTools, faHome, faUserCircle, faKey, faEye } from '@fortawesome/free-solid-svg-icons';

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
    const location = useLocation();

    return (
        <FlexContainer>
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
                {location.pathname.startsWith('/account') &&
                    <div>
                        <NavLink to={'/account'} exact>
                            <FontAwesomeIcon icon={faCogs}/>
                            <span>Settings</span>
                        </NavLink>
                        <NavLink to={'/account/api'}>
                                <FontAwesomeIcon icon={faTools}/>
                            <span>API Credentials</span>
                        </NavLink>
                        <NavLink to={'/account/ssh'}>
                            <FontAwesomeIcon icon={faKey}/>
                            <span>SSH Keys</span>
                        </NavLink>
                        <NavLink to={'/account/activity'}>
                            <FontAwesomeIcon icon={faEye}/>
                            <span>Activity</span>
                        </NavLink>
                    </div>
                }
                <div className='subNavBottom'>
                    <LogoutBtn />
                </div>
            </SubNavigation>
            <ContentBase>
                <TransitionRouter>
                <NavigationBar />
                    <React.Suspense fallback={<Spinner centered />}>
                        <Switch location={location}>
                            <Route path={'/'} exact>
                                <DashboardContainer />
                            </Route>
                            {routes.account.map(({ path, component: Component }) => (
                                <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                    <Component />
                                </Route>
                            ))}
                            <Route path={'*'}>
                                <NotFound />
                            </Route>
                        </Switch>
                    </React.Suspense>
                </TransitionRouter>
            </ContentBase>
        </FlexContainer>
    );
};
