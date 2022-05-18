import React from 'react';
import styled from 'styled-components';
import root from 'react-shadow/styled-components';

import Demo from './Demo';
import { Injection } from './Injection';

const selectTargetEl = () => document.querySelector('#injection');
const containerClassName = 'test__container';

export default () => (
    <Injection
        selectTargetElement={selectTargetEl}
        position="afterbegin"
        containerClassName={containerClassName}
    >
        <root.div>
            <Container>
                <Demo />
            </Container>
        </root.div>
    </Injection>
);

const Container = styled.div`
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: 2147483647;
`;
