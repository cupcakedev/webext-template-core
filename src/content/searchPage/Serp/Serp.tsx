import React, { useLayoutEffect, useState } from 'react';
import { Injection } from 'src/content/components/Injection';
import ShadowView from 'src/shadow';
import SerpItem from './SerpItem';

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

export const Serp: React.FC<SerpProps> = ({ serpLinksSelector }) => {
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
                    <ShadowView>
                        <SerpItem text={container.text} />
                    </ShadowView>
                </Injection>
            ))}
        </>
    );
};
