import React, {useState} from "react";
import {useChromeStorageLocal} from "../../storage";
import {Injection} from "./Injection";
import {EXTENSION_PREFIX} from "../../config";
import {getCurrentTabId} from "../../common/utils";

const Demo: React.FC<{ variant?: string }> = ({variant}) => {

    const [tabID, setTabID] = useState('')
    const key = 'counter';
    const [value, setValue, isPersistent, errorMessage] = useChromeStorageLocal(key, 0);


    const selectTargetEl = () => document.querySelector('#inject');

    const getTabIDHandler = async () => {
        const id = await getCurrentTabId()
        // @ts-ignore
        setTabID(id)
    }

    return (
        <Injection selectTargetElement={selectTargetEl}
                   position="afterbegin"
                   containerClassName={`${EXTENSION_PREFIX}__container`}
        >
            <div style={{...styles.box, top: top}}>
                <p>TabID: {tabID || 'Неизвестно'}</p>
                <p>Счетчик: {value}</p>
                <button onClick={getTabIDHandler}>Запросить tabID</button>
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
        </Injection>
    )
}

export default Demo

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