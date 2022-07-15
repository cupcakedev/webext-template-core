import React from 'react';
import ReactDOM from 'react-dom/client';

import { Router } from './router';
import '../../logger';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

async function injectEntryPoint() {
    ReactDOM.createRoot(injection).render(<Router />);
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
