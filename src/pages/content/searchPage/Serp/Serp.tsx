import React, { useLayoutEffect, useState } from 'react';
import root from 'react-shadow/styled-components';
import { Injection } from 'src/pages/content/components/Injection';
import { SerpItem } from './SerpItem';

const CONTAINER_CLASSNAME = 'template-serp';
const ITEM_TEXT = "I'm a SERP injection";

interface PortalData {
    href: string;
    container: Element;
    text: string;
}

interface SerpProps {
    serpLinksSelector: string;
}

const Serp: React.FC<SerpProps> = ({ serpLinksSelector }) => {
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
                text: ITEM_TEXT,
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
                    containerClassName={CONTAINER_CLASSNAME}
                >
                    <root.div>
                        <SerpItem text={container.text} />
                    </root.div>
                </Injection>
            ))}
        </>
    );
};

export { Serp };
