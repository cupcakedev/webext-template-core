import React from 'react';
import ReactDOM from 'react-dom';
import {useChromeStorageLocal} from 'use-chrome-storage';
//
//
//
// try {
//     window.onload = function () {
//         const injection = document.createElement('div');
//         injection.classList.add('smartshop222-injection');
//         document.body.appendChild(injection);
//
//         ReactDOM.render(
//             <>
//                 <App />
//             </>,
//             injection
//         );
//         const button = document.getElementById('button');
//         if(!button) {
//             return false;
//         }
//         button.onclick = function () {
//           alert("Message was send here")
//             chrome.runtime.sendMessage({
//                 type: "color-divs"
//             });
//         }
//     }
// } catch (e) {
//     alert(e)
// }




interface IExample {
    /** Текст внутри кнопки */
    name: string,
    top: string
}

const App = () => {
    return (
        <>
            <Example name={'two'} top={"389px"} />
        </>
    )
}

export default App;

const Example: React.FC<IExample> = ({name, top}) => {
    const key = 'samolet';

    const [value, setValue, isPersistent, error] = useChromeStorageLocal(key, 0);

    if (error) {
        return <p>{`An error has occurred: ${error}`}</p>
    }

    return (
        <div style={{...styles.box, top: top}}>
            <p>Счетчик: {value}</p>
            <button
                onClick={() => {
                    setValue((prev: number) => (prev + 1));
                }}
            >Инкремент</button>
            <button
                onClick={() => {
                    setValue((prev: number) => (0));
                }}
            >Очистить</button>
            <button
                onClick={() => {
                    setValue((prev: number) => (prev - 1));
                }}
            >Декремент</button>
        </div>
    )
}

const styles: any = {
    box: {
        height: "100px",
        position: "absolute",
        width: "250px",
        border: "1px solid black",
        background: "#ddd",
        top: "129px",
        left: "10px",
    }
}

const injection = document.createElement('div');
injection.classList.add('injection');
document.body.appendChild(injection);

ReactDOM.render(
    <App />,
    injection
);