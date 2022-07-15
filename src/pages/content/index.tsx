import React from 'react';
import ReactDOM from 'react-dom/client';

import { Router } from './router';
import { routes } from './router/routes';
import '../../logger';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

async function injectEntryPoint() {
    ReactDOM.createRoot(injection).render(<Router routes={routes} />);
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
