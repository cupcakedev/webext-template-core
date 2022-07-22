import React, { useLayoutEffect, useState } from 'react';
import root from 'react-shadow/styled-components';
import { Injection } from 'src/pages/content/components/Injection';

export type SearchConfig = {
    pattern: RegExp;
    linksSelector: string;
    searchInput: string;
};

const CONTAINER_CLASSNAME = 'serp-item';

interface PortalData {
    href: string;
    container: Element;
}

interface SerpProps {
    serpLinksSelector: string;
    itemContainerClassName?: string;
    render: (props: { href: string }) => JSX.Element;
}

const Serp: React.FC<SerpProps> = ({
    serpLinksSelector,
    itemContainerClassName,
    render,
}) => {
    const [containers, setContainers] = useState<PortalData[]>([]);

    const serpContainers = (links: NodeListOf<any>) => {
        const containers: PortalData[] = [];
        links.forEach((link: Element) => {
            const a = link.querySelectorAll('a');
            if (!a) return;
            const { href } = a[0];
            if (!href) return;
            containers.push({
                href,
                container: link,
            });
        });
        return containers;
    };

    useLayoutEffect(() => {
        const links = document.querySelectorAll(serpLinksSelector);
        if (!links) return setContainers([]);
        return setContainers(serpContainers(links));
    }, []);

    if (!containers.length) return null;

    return (
        <>
            {containers.map((container: PortalData) => (
                <Injection
                    key={container.href}
                    selectTargetElement={() => container.container}
                    position="beforebegin"
                    containerClassName={
                        itemContainerClassName || CONTAINER_CLASSNAME
                    }
                >
                    <root.div>{render({ href: container.href })}</root.div>
                </Injection>
            ))}
        </>
    );
};

export { Serp };
