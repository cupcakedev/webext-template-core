import React, { useState } from 'react';
import { Modal } from './Modal';

const ModalDemo = () => {
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [showThirdModal, setShowThirdModal] = useState(false);

    return (
        <div
            style={{
                display: 'flex',
                gap: '11px',
                height: '25px',
                alignItems: 'center',
            }}
        >
            <button onClick={() => setShowModal((prev) => !prev)}>
                Открыть модальное окно
            </button>
            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    onAccept={() => setShowSecondModal(true)}
                />
            )}
            {showSecondModal && (
                <Modal
                    padding="20px 20px 0 0"
                    onClose={() => setShowSecondModal(false)}
                    onAccept={() => setShowThirdModal(true)}
                />
            )}
            {showThirdModal && (
                <Modal
                    padding="40px 40px 0 0"
                    onClose={() => setShowThirdModal(false)}
                    onAccept={() => {
                        setShowModal(false);
                        setShowSecondModal(false);
                        setShowThirdModal(false);
                    }}
                />
            )}
        </div>
    );
};

export { ModalDemo };
