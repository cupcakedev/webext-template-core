# Getting Started with Extension Template  Manifest 3

Данное приложение является шаблоном для chrome.extension с использованием 3 версии манифеста

## Зависимости

Для запуска демонстрационного приложения требуется выполнить: 

### `json-server --watch db.json --port 3004`

Файл db.json содержит список пользователей. background обращается к json-server по адресу localhost:3004/users.

## Скрипты

В директории проекта:

### `yarn build`

Собирает расширение в директорию /dist.

На текущий момент webpack-hot-reloading не поддерживаниется, ввиду ограничений 3 манифеста на подключение сторонних скриптов.

## О проекте

Данный шаблон содержит решения типовых задач при создании расширения
- манифест 3
- json-rpc-brige для отправки запросов на background скрипт
- chrome.storage persistor для кэширования данных при использовании react-query
- hook useChromeStorage для использования chrome.storage в компонентах react
- shadow dom
- роутинг для компонентов с использованием React.createPortal

