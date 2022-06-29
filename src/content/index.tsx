import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

export async function injectEntryPoint() {
    ReactDOM.createRoot(injection).render(<App />);
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
