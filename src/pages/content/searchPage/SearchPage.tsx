import React from 'react';
import { Serp } from './Serp/Serp';
import { SearchConfig } from './utils';

export const SearchPage = (props: SearchConfig) => (
    <>
        <Serp serpLinksSelector={props.linksSelector} />
        {/* <Products trans={trans} searchInput={props.searchInput} /> */}
    </>
);
