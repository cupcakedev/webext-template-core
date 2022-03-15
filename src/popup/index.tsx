import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './components/Demo';

const App = () => <Demo />;

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

ReactDOM.render(<App />, injection);
