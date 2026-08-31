import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full`};

    & {
        z-index:99;
        background-color:var(--secondary);
        max-width: 72px;
        height:100%;
        min-height:100vh;
        border-right:1px solid var(--borders);
        position:sticky;
        top:0;
        display: flex;
        flex-direction: column;
    }

    & > div:first-of-type{
        border-bottom: 2px solid var(--borders);
        margin-bottom: 25px;
        padding: 25px 0px;
    }

    & > div {
        ${tw`mx-auto w-full`};

        & > a, & > div {
            ${tw`block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};

            &{
                text-align:center;
                color:var(--color);
                position:relative;
            }

            &:hover {
                ${tw`text-neutral-100`};
            }

            &:active, &.active {
                color:var(--primary);
            }
            &.ignore.active {
                color:var(--color);
            }
            & span{
                display:none;
                padding: 1px 3px;
                border: 1px solid var(--borders);
                background-color: var(--secondary);
                position: absolute;
                top: 6px;
                z-index:99;
                left: 90%;
                border-radius: 3px;
                animation: FadeIn .3s;
            }
            &:hover span{
                display:block;
            }
            @keyframes FadeIn {
                0%{
                    opacity:0;
                    left:70%;
                }
                100%{
                    opacity:1;
                    left:90%;
                }
            }
        }
    }
    
    & > div.subNavBottom{
        border-top: 2px solid var(--borders);
        padding-top:25px;
        padding-bottom:10px;
        margin-top:auto;
    }


    @media (max-width: 694px){
        & {
            overflow:scroll;
            width:100%;
            max-width:100%;
            border-right:0px solid var(--borders);
            padding-bottom:0px;
            min-height:10px;
            height:auto;
            display:flex;
            flex-direction: row;
        }
        & > div {
            display:flex;
            width:auto;
            padding:0 !important;
            margin:0 !important;
            border:none !important;

            & > a:hover > span,
            & > div:hover > span{
                display:none;
            }
        }
    }
`;

export default SubNavigation;
