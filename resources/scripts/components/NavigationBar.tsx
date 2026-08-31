import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import DarkModeToggler from '@/components/elements/DarkModeToggler';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const Navigation = styled.div`
    ${tw`w-full overflow-x-auto`};
    
    & > div {
        ${tw`mx-auto w-full flex items-center`};
    }
    
    & #logo {
        ${tw`flex-1`};
        & > .navigation-link {
            ${tw`flex items-center h-full no-underline px-6 cursor-pointer transition-all duration-150`};
            & > &:active, &:hover {
                ${tw`text-neutral-100`};
            }
        }
    }
`;

const RightNavigation = styled.div`
    ${tw`flex h-full items-center justify-center`};
    
    & > a, & > .navigation-link {
        ${tw`flex items-center h-full no-underline px-6 cursor-pointer transition-all duration-150`};
        
        &:active, &:hover {
            ${tw`text-neutral-100`};
        }
        
        &.active {
            color:var(--primary);
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <>
            <Navigation>
                <SpinnerOverlay visible={isLoggingOut} />
                <div css={tw`mx-auto w-full flex items-center`} style={{ height: '3.5rem' }}>
                    <div id={'logo'}>
                        <SearchContainer/>
                    </div>
                    <RightNavigation>
                        {rootAdmin && (
                            <Tooltip placement={'bottom'} content={'Admin'}>
                                <a href={'/admin'} rel={'noreferrer'}>
                                    <FontAwesomeIcon icon={faCogs} />
                                </a>
                            </Tooltip>
                        )}
                        <Tooltip placement={'bottom'} content={'Account Settings'}>
                            <NavLink to={'/account'}>
                                <span className={'flex items-center w-5 h-5'}>
                                    <Avatar.User />
                                </span>
                            </NavLink>
                        </Tooltip>
                        <Tooltip placement={'bottom'} content={'Sign Out'}>
                            <a onClick={onTriggerLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </a>
                        </Tooltip>
                    </RightNavigation>
                </div>
            </Navigation>
            <DarkModeToggler />
        </>
    );
};
