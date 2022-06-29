import React from 'react';
import styled, { css } from 'styled-components';
import root from 'react-shadow/styled-components';
import { Injection } from './Injection';
import { defaultFontMixin } from '@common/styles';

const selectTargetElement = () => document.querySelector('#injection');

const Modal = (props: any) => (
    <Injection
        selectTargetElement={selectTargetElement}
        position="beforeend"
        containerClassName="modal_test__container"
    >
        <root.div>
            <Root padding={props.padding}>
                <Content>
                    <Title>Hello, world of modals!</Title>
                    <Text>React is cool</Text>
                    <ButtonsContainer>
                        <OkButton onClick={props.onAccept}>OK</OkButton>
                        <CloseButton onClick={props.onClose}>Close</CloseButton>
                    </ButtonsContainer>
                </Content>
            </Root>
        </root.div>
    </Injection>
);

const Root = styled.div<{ padding: string }>`
    z-index: 2147483647;
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    ${defaultFontMixin};

    ${(props) =>
        props.padding &&
        css`
            padding: ${props.padding};
        `};
    background: rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    width: fit-content;
    height: fit-content;
    padding: 60px;
    background: white;
    box-shadow: 0 0 30px 0px #5c5c5c;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    font-weight: 700;
`;

const Text = styled.p`
    font-size: 24px;
    font-weight: 500;
`;

const ButtonsContainer = styled.div`
    display: flex;
    * {
        margin: 0 10px;
    }
`;

const Button = styled.button`
    border: none;
    outline: none;
    border-radius: 4px;
    padding: 9px;
    min-width: 80px;
    background: #ddd;
`;

const OkButton = styled(Button)`
    color: green;
`;

const CloseButton = styled(Button)`
    color: red;
`;

export default Modal;
