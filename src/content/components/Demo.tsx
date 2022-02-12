import React from "react";
import {useChromeStorageLocal} from "../../storage";
import {Injection} from "./Injection";
import {EXTENSION_PREFIX} from "../../config";

const Demo: React.FC<{ variant?: string }> = ({variant}) => {

    const key = 'counter';
    const [value, setValue, isPersistent, errorMessage] = useChromeStorageLocal(key, 0);

    const selectTargetEl = () => document.querySelector('#inject');

    return (
        <Injection selectTargetElement={selectTargetEl}
                   position="afterbegin"
                   containerClassName={`${EXTENSION_PREFIX}__container`}
        >
            <div style={{...styles.box, top: top}}>
                <p>Счетчик: {value}</p>
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
        height: "150px",
        width: "100px",
        border: "1px solid black",
        background: "#ddd",
        overflow: 'hidden'
    }
}