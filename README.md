# Getting Started with Extension Template Core Manifest 3

Данное приложение является обновляемым логическим модулем для шаблона расширений с использованием 3 версии манифеста

## Скрипты

В директории проекта:

`yarn build`

Собирает npm модуль в директорию /build.

## О проекте

Данный модуль содержит решения типовых задач при создании шаблона расширения:
- манифест 3
- json-rpc-brige для отправки запросов на background скрипт
- chrome.storage в качестве global state
- hook useChromeStorage для использования chrome.storage в компонентах react
- shadow dom
- роутинг для компонентов с использованием React.createPortal

