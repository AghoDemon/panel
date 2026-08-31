import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { useState } from 'react';

export default () => {
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };

    return (
        <a onClick={onTriggerLogout}>
            <FontAwesomeIcon icon={faSignOutAlt}/>
            <span>Logout</span>
            <SpinnerOverlay visible={isLoggingOut} />
        </a>
    );
};