import React from 'react';
import ReactDOM from 'react-dom';
import Demo from '../content/components/Demo';

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

ReactDOM.render(<Demo />, injection);
