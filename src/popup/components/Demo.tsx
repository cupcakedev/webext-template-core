import React, { useState } from 'react';
import { getBgCaller } from '../../rpc/bg';
import useChromeStorage from '../../hooks/useChromeStorage';

const getExtensionID = getBgCaller('getExtensionID');

const Demo = () => {
    const [extID, setExtID] = useState<string | undefined>();

    const [value, setValue, _, errorMessage] = useChromeStorage('counter', 0);

    if (errorMessage) {
        return <p>{`An error has occurred: ${errorMessage}`}</p>;
    }

    const getTabIDHandler = async () => {
        const id = await getExtensionID();
        setExtID(id);
    };

    return (
        <div style={{ ...styles.box }}>
            <p>Extension ID: {extID || 'Undefined'}</p>
            <p>Counter: {value}</p>
            <button onClick={getTabIDHandler}>Запросить ExtID</button>
            <button
                onClick={() => {
                    setValue((prev: number) => prev + 1);
                }}
            >
                Increment
            </button>
            <button
                onClick={() => {
                    setValue((prev: number) => 0);
                }}
            >
                Clear
            </button>
            <button
                onClick={() => {
                    setValue((prev: number) => prev - 1);
                }}
            >
                Decrement
            </button>
        </div>
    );
};

const styles: any = {
    box: {
        color: 'black',
        width: '145px',
        border: '1px solid black',
        background: 'rgb(221, 221, 221)',
        fontSize: '22px',
        padding: '24px',
    },
};

export default Demo;
