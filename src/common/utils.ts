import * as _ from 'lodash';

export const getCurrentTab = () =>
    new Promise<chrome.tabs.Tab | undefined>((resolve) =>
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
            resolve(tabs[0])
        )
    );

export const openTab = async (url: string) =>
    new Promise<void>((resolve, reject) => {
        chrome.tabs.create({ url }, () => {
            resolve();
        });
    });

export const MODAL_ROOT_ID = 'modal-root';

export const createModalRoot = (id?: string) => {
    const element = document.createElement('div');
    element.id = id || MODAL_ROOT_ID;
    document.body.appendChild(element);
};
