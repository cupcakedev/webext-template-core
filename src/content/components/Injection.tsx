import * as React from 'react';
import {ReactNode, useLayoutEffect, useState} from "react";
import ReactDOM from 'react-dom';

export interface InjectionProps {
    selectTargetElement: () => Element | HTMLElement | null | undefined
    containerTagName?: keyof HTMLElementTagNameMap;
    containerClassName?: string;
    children: ReactNode;
    position?: InsertPosition;
}

export const Injection: React.FC<InjectionProps> =
    ({
         selectTargetElement,
         containerTagName = 'div',
         children,
         containerClassName,
         position = 'afterend'
     }) => {
        const [containerEl, setContainerEl] = useState<null | HTMLElement>(null)
        useLayoutEffect(() => {
            const targetEl = selectTargetElement()
            let _containerEl: HTMLElement | null = null
            if (targetEl) {
                _containerEl = document.createElement(containerTagName);
                containerClassName && _containerEl.classList.add(containerClassName)
                targetEl.insertAdjacentElement(position, _containerEl);
                setContainerEl(_containerEl)
            }
            return () => {
                if (_containerEl) {
                    _containerEl.remove()
                }
            }
        }, [])

        if (containerEl === null) return null;
        return ReactDOM.createPortal(children, containerEl);
    }

