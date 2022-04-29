import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';
import { QueryClient } from 'react-query';
import { createChromeStoragePersistor } from '../storage/createChromeStoragePersistor';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';

import { ShadowView } from './../shadow';

import App from './App';
import { factory } from '../rpc';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

const localStoragePersistor = createChromeStoragePersistor({
    key: `REACT_QUERY_CHROME_STORAGE_LOCAL`,
});

persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
    maxAge: 24 * 60 * 60,
});

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

export async function injectEntryPoint() {
    const getTabID = factory('getTabID');
    const tabId = await getTabID();

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
