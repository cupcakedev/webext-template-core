import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import Demo from '../content/components/Demo';

import { fontFacesMixin } from '@assets/fonts';
import { defaultFontMixin } from '@common/styles';

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;

    ${fontFacesMixin}
    ${defaultFontMixin}
  }
  body * {
    font-family: inherit;
    font-feature-settings: "ss02";
  }
`;

ReactDOM.createRoot(injection).render(
    <>
        <GlobalStyles />
        <Demo />
    </>
);
