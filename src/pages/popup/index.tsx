import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';

import { fontFacesMixin } from '@assets/fonts';
import { defaultFontMixin } from 'src/styles/font';
import { Demo } from 'src/components/Demo';
import '../../logger';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

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

ReactDOM.createRoot(root).render(
    <>
        <GlobalStyles />
        <Demo />
    </>
);
