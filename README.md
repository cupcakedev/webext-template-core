# Extension Template Core for Manifest 3

> **Note**
> Модуль используется как приватный репозиторий, без паблишинга в `npm`.

## О проекте

Данное приложение является логическим модулем, подключаемым к шаблону расширений для 3 версии манифеста.

Модуль содержит решения типовых задач при создании шаблона расширения:

-   манифест 3
-   message-brige для обмена сообщениями между скриптами расширений
-   chrome.storage в качестве global state
-   hook useChromeStorage для использования chrome.storage в компонентах react
-   shadow dom
-   роутинг для компонентов с использованием React.createPortal

## Скрипты

Сборка модуля<br/>
`yarn build`

Запуск Hot-reload сервера<br/>
`yarn dev`

Запуск unit-тестов<br/>
`yarn test`

Автоматическая сборка при скачивании модуля из репозитория<br/>
`yarn prepate`

<br/>

## Локальное тестирование модуля

В директории модуля<br/>
`yarn link` - достаточно ввести единожды

В директории расширения<br/>
`yarn link webext-template-core`

В обеих директориях<br/>
`yarn dev` или `yarn build`

Чтобы вновь использовать зависимость от репозитория модуля (в директории расширения)<br/>
`yarn unlink webext-template-core`<br/>
`yarn install --force`

<br/>

## Добавление зависимости от модуля в расширении (если нет)

`yarn add git+ssh://git@github.com:cupcakedev/webext-template-core.git#vX.X.X`

_Заменить vX.X.X на номер версии модуля для использования (например v2.9.15)_

<br/>

## Выпуск новой версии для использования в расширении

> **Note** > `<version>` = `vX.X.X` = v + package.json version (например v2.9.15)

1. Изменить версию в package.json, cоздать коммит с именем `vX.X.X`

    _Если версия в package.json уже верная, то оставить без изменений_

2. Создать _git-тэг_ с именем этой версии на последнем коммите

    При помощи `GitGraph`:

    > ПКМ на коммите --> "Add tag..." --> имя тэга `vX.X.X` --> комментарий в отдельном поле --> отметить "Push to remote" --> Add tag

    При помощи `git CLI`:

    > `git tag <version> -a -m <comment> & git push origin <version>`

3. Обновить версию зависимости `webext-template-core` в проектах, где она используется

    "webext-template-core": `"git+ssh://<repo>.git#vX.X.X"` - заменить `vX.X.X` на новую версию
