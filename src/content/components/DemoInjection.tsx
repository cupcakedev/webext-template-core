import React from 'react';
import Demo from './Demo';
import { Injection } from './Injection';

const selectTargetEl = () => document.querySelector('#injection > shadow-view');
const containerClassName = 'test__container';

const style: any = {
    position: 'absolute',
    top: '25px',
    left: '25px',
    zIndex: '2147483647',
};

const DemoInjection = () => (
    <Injection
        selectTargetElement={selectTargetEl}
        position="afterbegin"
        containerClassName={containerClassName}
    >
        <div style={style}>
            <Demo />
        </div>
    </Injection>
);

export default DemoInjection;
