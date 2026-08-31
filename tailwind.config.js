const colors = require('tailwindcss/colors');

const gray = {
    50: 'var(--highlight-color)', // white text
    100: 'var(--light-color)',
    200: 'var(--color)', // normal text
    300: 'var(--sub-color)',
    400: 'var(--color-4)',
    500: 'var(--color-5)',
    600: 'var(--secondary-hover)',
    700: 'var(--secondary)',
    800: 'var(--dark)',
    900: 'var(--dark)',
};

const neutral = {
    50: 'var(--highlight-color)', // white text
    100: 'var(--light-color)',
    200: 'var(--color)', // normal text
    300: 'var(--sub-color)',
    400: 'var(--color-4)',
    500: 'var(--color-5)',
    600: 'var(--secondary-hover)',
    700: 'var(--secondary)',
    800: 'var(--dark)',
    900: 'var(--dark)',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#131a20',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: colors.blue,
                gray: gray,
                neutral: neutral,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
