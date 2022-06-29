import React from 'react';
import ReactDOM from 'react-dom/client';
import Demo from '../content/components/Demo';

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

ReactDOM.createRoot(injection).render(<Demo />);
