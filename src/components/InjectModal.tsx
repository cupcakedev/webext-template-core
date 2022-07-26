import React from 'react';
import { Injection } from './Injection';

export const MODAL_ROOT_ID = 'modal-root';

const selectTargetElement = (id?: string) => {
    let el = document.querySelector(`#${id || MODAL_ROOT_ID}`);
    if (!el) {
        el = document.createElement('div');
        el.id = id || MODAL_ROOT_ID;
        document.body.appendChild(el);
    }
    return el;
};

interface Props {
    id?: string;
    containerClassName?: string;
    children: JSX.Element;
}

const InjectModal: React.FC<Props> = ({ id, children, containerClassName }) => (
    <Injection
        selectTargetElement={() => selectTargetElement(id)}
        position="beforeend"
        containerClassName={containerClassName || 'modal__container'}
    >
        {children}
    </Injection>
);

export { InjectModal };
