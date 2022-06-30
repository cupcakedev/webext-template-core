import React from 'react';
import styled from 'styled-components';

import logo from 'src/assets/icon/32.png';

const SerpItem = ({ text }: { text: string }) => (
    <Root>
        <img alt="serp-logo" src={logo} />
        <span>{text}</span>
    </Root>
);

const Root = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #777;

    img {
        margin-right: 2px;
    }
`;

export default SerpItem;
