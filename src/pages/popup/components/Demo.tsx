import React, { useState } from 'react';
import { useChromeStorage } from '../../../hooks/useChromeStorage';
import { LocalStorageKeys } from 'src/storage/config';
import { createBgMessageSender } from 'src/bridge/bgEvents';

const getExtensionID = createBgMessageSender('getExtensionID');

const Demo = () => {
    const [extID, setExtID] = useState<string | undefined>();

    const [value, setValue, errorMessage] = useChromeStorage(
        LocalStorageKeys.counter,
        0
    );

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
                    setValue((prev) => prev + 1);
                }}
            >
                Increment
            </button>
            <button
                onClick={() => {
                    setValue((prev) => 0);
                }}
            >
                Clear
            </button>
            <button
                onClick={() => {
                    setValue((prev) => prev - 1);
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

export { Demo };
