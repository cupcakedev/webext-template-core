/* eslint-disable no-console */

const EMPTY_FN = () => {};

if (process.env.NODE_ENV !== 'development') {
    for (const i in console) {
        if (i && i !== 'Console') {
            console[i as keyof Omit<typeof console, 'Console'>] = EMPTY_FN;
        }
    }
}
