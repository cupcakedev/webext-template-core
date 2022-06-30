import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';

import { fontFacesMixin } from '@assets/fonts';
import Router from './router';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

const GlobalStyles = createGlobalStyle`
    ${fontFacesMixin};
`;

async function injectEntryPoint() {
    ReactDOM.createRoot(injection).render(
        <>
            <GlobalStyles />
            <Router />
        </>
    );
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
