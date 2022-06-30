import * as _ from 'lodash';
import { RouteInterface } from '../interfaces';

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

export const findRoute = (routes: RouteInterface[], pathname: string) => {
    for (const route of routes) {
        if (typeof route.pattern === 'string') {
            const match = new RegExp(route.pattern).test(pathname);
            if (match) {
                const Component = route.component;
                return { Component };
            }
        }
        if (typeof route.pattern === 'function') {
            const match = route.pattern(pathname);
            if (match) {
                const Component = route.component;
                return { Component, props: match };
            }
        }
    }
    return null;
};
