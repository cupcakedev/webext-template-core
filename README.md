# Extension Template Core for Manifest 3


This application is a logical module that plugs into the extensions template for version 3 of the manifest.

The module contains solutions to typical tasks when creating an extension template:

- manifest V3
- message-bridge for communication between extension scripts
- `chrome.storage` as global state
- `useChromeStorage` to use `chrome.storage` in react components
- shadow dom
- routing for components using `React.createPortal`

## Install

```bash
npm install webext-template-core
```

```bash
yarn add webext-template-core
```

[Documentation for development](docs/Development.md)
