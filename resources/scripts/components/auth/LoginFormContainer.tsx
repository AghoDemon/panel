import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

const BackgroundImage = styled.div`
    height:100%;
    width:100%;
    position:absolute;
    background-color:var(--login-background);
    z-index:-1;
    top:0;
    left:0;
`;

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
    {title &&
    <h2 css={tw`text-3xl text-center text-neutral-100 font-medium py-4`}>
        {title}
    </h2>
    }
    <FlashMessageRender css={tw`mb-2 px-1`}/>
    <Form {...props} ref={ref}>
        <div css={tw`w-full p-6 mx-1`}>
            <div css={tw`flex-1`}>
                {props.children}
            </div>
        </div>
    </Form>
    <p css={tw`text-center text-neutral-500 text-xs mt-4`}>
        &copy; 2015 - {(new Date()).getFullYear()}&nbsp;
        <a
            rel={'noopener nofollow noreferrer'}
            href={'https://pterodactyl.io'}
            target={'_blank'}
            css={tw`no-underline text-neutral-500 hover:text-neutral-300`}
        >
            Pterodactyl Software
        </a><br />
        Made by&nbsp;
        <a
            rel={'noopener nofollow noreferrer'}
            href={'https://weijers.one/theme.php'}
            target={'_blank'}
            css={tw`no-underline text-neutral-500 hover:text-neutral-300`}
        >Techno1Monkey
        </a> 
    </p>
    <BackgroundImage />
    </Container>
));
