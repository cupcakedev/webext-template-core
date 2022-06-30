import React from 'react';
import styled from 'styled-components';
import root from 'react-shadow/styled-components';

import { defaultFontMixin } from '@common/styles';
import Demo from 'src/components/Demo';
import { Injection } from './Injection';

const selectTargetEl = () => document.querySelector('#injection');
const containerClassName = 'test__container';

const DemoInjection = () => (
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
    * {
        ${defaultFontMixin};
    }
`;

export default DemoInjection;
