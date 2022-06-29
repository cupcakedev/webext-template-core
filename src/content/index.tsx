import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';

import { fontFacesMixin } from '@assets/fonts';
import App from './App';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

const GlobalStyles = createGlobalStyle`
    ${fontFacesMixin};
`;

export async function injectEntryPoint() {
    ReactDOM.createRoot(injection).render(
        <>
            <GlobalStyles />
            <App />
        </>
    );
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
