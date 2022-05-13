// @ts-ignore
import { matchPattern } from 'url-matcher';
// @ts-ignore
import * as _ from 'lodash';
import { parse } from 'query-string';
import { RouteInterface } from '../interfaces';

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
                const Component = route.component();
                const params = _.zipObject(match.paramNames, match.paramValues);
                const searchParams = parse(location.search);
                // omit ref because react throw error
                const props = _.omit({ ...params, ...searchParams }, 'ref');
                return { Component, props };
            }
        }
        if (typeof route.pattern === 'function') {
            const match = route.pattern(pathname);
            if (match) {
                const Component = route.component();
                const params = match;
                const searchParams = parse(location.search);
                // omit ref because react throw error
                const props = _.omit({ ...params, ...searchParams }, 'ref');
                return { Component, props };
            }
        }
    }
    return null;
};
