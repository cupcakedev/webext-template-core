import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';

import { ShadowView } from './../shadow';

import queryClient from '../common/react-query/queryClient';
import App from './App';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

export async function injectEntryPoint() {
    ReactDOM.render(
        <QueryClientProvider client={queryClient}>
            <ShadowView styleContent="th, td {border:1px solid black}">
                <App />
            </ShadowView>
        </QueryClientProvider>,
        injection
    );
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
