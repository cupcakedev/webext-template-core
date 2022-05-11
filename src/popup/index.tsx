import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';

import queryClient from '../common/react-query/queryClient';
import Demo from '../content/components/Demo';

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <Demo />
    </QueryClientProvider>,
    injection
);
