import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import styled, { createGlobalStyle } from 'styled-components';

import { storage } from 'src/storage/storage';
import { fontFacesMixin } from '@assets/fonts';
import { defaultFontMixin } from 'src/styles/font';
import { SyncStorageKeys } from 'src/storage/config';

const Options = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const effect = async () => {
            const list = await storage.sync.get(SyncStorageKeys.excludeDomains);
            if (list) {
                textareaRef.current!.value = list;
            }
        };
        effect();
    }, []);

    const onSave = () =>
        storage.sync.set(
            SyncStorageKeys.excludeDomains,
            textareaRef.current?.value
        );

    return (
        <Root>
            <GlobalStyle />
            <Panel>
                <PageTitle>Exclusion list</PageTitle>
                <TextareaTitle>
                    Do not display extension content on these sites:
                </TextareaTitle>
                <Comment>
                    Please copy and paste the URLs of the websites you would
                    like to exclude. One line per site.
                </Comment>
                <Textarea cols={60} rows={10} ref={textareaRef} />
                <p>
                    <SaveButton onClick={onSave}>Save</SaveButton>
                </p>
            </Panel>
        </Root>
    );
};

const Root = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Panel = styled.div`
    width: 680px;
    background: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2);
`;

const PageTitle = styled.h1`
    font-size: 20px;
    font-weight: 600;
    margin-top: 0;
`;

const TextareaTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
`;

const Textarea = styled.textarea`
    width: 100%;
`;

const SaveButton = styled.button`
    padding: 10px 60px;
    border-radius: 4px;
    background-color: rgb(254, 93, 38);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    &:active {
        background-color: rgb(190, 70, 38);
    }
`;

const Comment = styled.p`
    font-size: 14px;
`;

const GlobalStyle = createGlobalStyle`
  
  body {
    background: #efefef;
    height: 100vh;
    margin: 0;
    
    ${fontFacesMixin}
    ${defaultFontMixin}
  }

  body * {
    font-family: inherit;
    font-feature-settings: "ss02";
  }
  
  #root {
    height: 100%;
    width: 100%;
  }
`;

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(<Options />);
