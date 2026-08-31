import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';

const Toggler = styled.button`
    cursor: pointer;
    position: fixed;
    z-index:999;
    right: 15px;
    bottom: 15px;
    padding: 10px;
    background-color: var(--secondary-hover);
    border-radius: 3px;
    display: block;

    .toggler-inside{
        transform:rotate(0deg);
        transition:transform .4s;
    }
    .darkmode button & .toggler-inside{
        transform:rotate(-180deg);
    }

    .sun{
        display:none;
    }
    .darkmode &{
        .toggler-inside{
            transform:rotate(-180deg);
            .moon{
                display:none;
            }
            .sun{
                display:block;
            }
        }
    }
`;

export default () => {
    if (localStorage.getItem('modes') == 'darkMode'){
        document.body.classList.add('darkmode');
    } else {
        document.body.classList.remove('darkmode');
    }

    const toggleDarkMode = () => {
        if (localStorage.getItem('modes') == 'darkMode'){
            localStorage.setItem('modes', 'null');
            document.body.classList.remove('darkmode');
        }   else {
            localStorage.setItem('modes', 'darkMode');
            document.body.classList.add('darkmode');
        }
    }

    return (
        <Toggler onClick={toggleDarkMode}>
            <div className="toggler-inside">
                <FontAwesomeIcon icon={faMoon} className='moon'/>
                <FontAwesomeIcon icon={faSun} className='sun'/>
            </div>
        </Toggler>
    );
};
