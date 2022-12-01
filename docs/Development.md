# Extension Template Core for Manifest 3

> **Note**
> The module is used as a private repository, without publishing in `npm`.

## About the project

This application is a logical module that plugs into the extensions template for version 3 of the manifest.

The module contains solutions to typical tasks when creating an extension template:

- manifest V3
- message-bridge for communication between extension scripts
- `chrome.storage` as global state
- `useChromeStorage` to use `chrome.storage` in react components
- shadow dom
- routing for components using `React.createPortal`

## Scripts

Module build<br/>
`yarn build`

Hot-reload server launch<br/>
`yarn dev`

Running unit tests<br/>
`yarn test`

Automatic build to download module from repository<br/>
`yarn prepare`

<br/>

## Local module testing

In module's build directory<br/>
`yarn link` - it is enough to enter once

In the extension directory<br/>
`yarn link webext-template-core`

In both directories<br/>
`yarn dev` or `yarn build`

To reuse a module repository dependency (in the extension directory)<br/>
`yarn unlink webext-template-core`<br/>
`yarn install --force`

<br/>

## Adding a module dependency in an extension (if not present)

`yarn add git+ssh://git@github.com:cupcakedev/webext-template-core.git#vX.X.X`

_Replace vX.X.X with the version number of the module to use (e.g. v2.9.15)_

<br/>

## Release a new version for use in the extension

> **Note** > `<version>` = `vX.X.X` = v + package.json version (e.g. v2.9.15)

1. Change version in package.json, create a commit named `vX.X.X`

   _If the version in package.json is already correct, then leave it unchanged_

2. Create a _git-tag_ with the name of this version on the last commit

   `GitGraph`:

   > RMB on commit --> "Add tag..." --> tag name `vX.X.X` --> comment in a separate field --> mark "Push to remote" --> Add tag

   `git CLI`:

   > `git tag <version> -a -m <comment> & git push origin <version>`

3. Update the version of the `webext-template-core` dependency in projects that use it

   `"webext-template-core": "git+ssh://<repo>.git#vX.X.X"` - replace `vX.X.X` to the new version
