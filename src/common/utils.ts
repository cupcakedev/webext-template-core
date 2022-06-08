// @ts-ignore
import { matchPattern } from 'url-matcher';
// @ts-ignore
import * as _ from 'lodash';
import { parse } from 'query-string';
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
            const match = matchPattern(route.pattern, pathname);
            if (match) {
                const Component = route.component;
                const params = _.zipObject(match.paramNames, match.paramValues);
                const searchParams = parse(window.location.search);
                // omit ref because react throw error
                const props = _.omit({ ...params, ...searchParams }, 'ref');
                return { Component, props };
            }
        }
        if (typeof route.pattern === 'function') {
            const match = route.pattern(pathname);
            if (match) {
                const Component = route.component;
                const params = match;
                const searchParams = parse(window.location.search);
                // omit ref because react throw error
                const props = _.omit({ ...params, ...searchParams }, 'ref');
                return { Component, props };
            }
        }
    }
    return null;
};
