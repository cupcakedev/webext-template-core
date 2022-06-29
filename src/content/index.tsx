import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const injection = document.createElement('div');
injection.classList.add('injection');
injection.id = 'injection';
document.body.appendChild(injection);

export async function injectEntryPoint() {
    ReactDOM.render(<App />, injection);
}

injectEntryPoint()
    .then()
    .catch((e) => console.log(e));
