import React from 'react';

import logo from '../../../assets/icon/32.png';

const styles: any = {
    serpItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
    },
    img: {
        marginRight: '2px',
    },
};

const SerpItem = ({ text }: { text: string }) => (
    <div style={styles.serpItem}>
        <img style={styles.img} alt="serp-logo" src={logo} />
        <span>{text}</span>
    </div>
);

export default SerpItem;
