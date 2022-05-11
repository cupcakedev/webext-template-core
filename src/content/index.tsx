import React from 'react';
import ReactDOM from 'react-dom';

import { ShadowView } from './../shadow';

import App from './App';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

export async function injectEntryPoint() {
    ReactDOM.render(
        <ShadowView styleContent="th, td {border:1px solid black}">
            <App />
        </ShadowView>,
        injection
    );
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
