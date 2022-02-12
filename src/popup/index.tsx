import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {useChromeStorageLocal} from 'use-chrome-storage';
import {getExtensionID} from "../common/utils";

const App = () => {

    const [extID, setExtID] = useState('')
    const key = 'counter';
    const [value, setValue, isPersistent, errorMessage] = useChromeStorageLocal(key, 0);

    if (errorMessage) {
        return <p>{`An error has occurred: ${errorMessage}`}</p>
    }

    const getTabIDHandler = async () => {
        const id = await getExtensionID()
        // @ts-ignore
        setExtID(id)
    }

    return (
        <div style={{...styles.box, top: top}}>
            <p>Extension ID: {extID || 'Неизвестно'}</p>
            <p>Счетчик: {value}</p>
            <button onClick={getTabIDHandler}>Запросить ExtID</button>
            <button
                onClick={() => {
                    setValue((prev: number) => (prev + 1));
                }}
            >Инкремент
            </button>
            <button
                onClick={() => {
                    setValue((prev: number) => (0));
                }}
            >Очистить
            </button>
            <button
                onClick={() => {
                    setValue((prev: number) => (prev - 1));
                }}
            >Декремент
            </button>
        </div>
    )
}

const styles: any = {
    box: {
        color: "black",
        width: "145px",
        border: "1px solid black",
        background: "rgb(221, 221, 221)",
        fontSize: "22px",
        padding: "24px"
    }
}

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

ReactDOM.render(
    <App />,
    injection
);