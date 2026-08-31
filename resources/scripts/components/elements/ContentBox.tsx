import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const GreyBox = styled.div`
    &{
        background-color:var(--secondary);
        border-radius:3px;
    }
`;

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && <h2 css={tw`text-neutral-200 mb-4 px-4 text-xl`}>{title}</h2>}
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
        )}
        <GreyBox css={[tw`p-4 shadow-lg relative`, !!borderColor && tw`border-t-4`]}>
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </GreyBox>
    </div>
);

export default ContentBox;
