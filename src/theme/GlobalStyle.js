import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    @font-face {
        font-family: "vhs";
        src: local("HomeVideo-BLG6G"),
            url("/fonts/HomeVideo-BLG6G.ttf") format("truetype");
    }
    @font-face {
        font-family: "vhs-bold";
        src: local("HomeVideoBold-R90Dv"),
            url("/fonts/HomeVideoBold-R90Dv.ttf") format("truetype");
    }

    body {
        margin: 0;
    }

    body, html, #root {
        height: 100%;
    }

    body, html {
        background-color: ${({ theme }) => theme.colors.background.page};
        font-family: ${({ theme }) => theme.typography.fontFamily.body};
        color: ${({ theme }) => theme.colors.text.inverse};
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-text-fill-color: black;
        -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.colors.background.surfaceAlt} inset !important;
        transition: background-color 5000s ease-in-out 0s;
        font-family: ${({ theme }) => theme.typography.fontFamily.body};
    }
`;
