import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import styled from 'styled-components/macro';

const GreyBox = styled.div`
    &{
        background-color:var(--secondary);
        border-radius:3px;
    }
    & > .titleBox{
        border-bottom:1px solid var(--borders);
    }
`;

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div className={className}>
        <GreyBox>
            <div css={tw`p-3`} className='titleBox'>
                {typeof title === 'string' ? (
                    <p css={tw`text-sm uppercase`}>
                        {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-neutral-300`} />}
                        {title}
                    </p>
                ) : (
                    title
                )}
            </div>
            <div css={tw`p-3`}>{children}</div>
        </GreyBox>
    </div>
);

export default memo(TitledGreyBox, isEqual);
