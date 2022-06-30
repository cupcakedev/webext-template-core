export type SearchConfig = {
    pattern: RegExp;
    linksSelector: string;
    searchInput: string;
};

const searchConfigs: SearchConfig[] = [
    {
        pattern: /^https?:\/\/(www\.)?google\..+/,
        linksSelector: '.tF2Cxc',
        searchInput: 'input.gLFyf',
    },
    {
        pattern: /^https?:\/\/(www\.)?bing\..+/,
        linksSelector: '.b_algo',
        searchInput: '#sb_form_q',
    },
    {
        pattern: /^https?:\/\/.*search\.yahoo\.com/,
        linksSelector: '.algo',
        searchInput: '#yschsp',
    },
];

export const isSearchPage = (pathname: string) =>
    searchConfigs.find((config) => config.pattern.test(pathname));
