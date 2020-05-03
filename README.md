# Anyunderhood

Этот репозиторий - _шаблон_. Читайте, как [создать новый сайт](NEW-UNDERHOOD.md) для underhood

Коллективный твиттер-аккаунт с новым автором каждую неделю

## Проект

<details><summary>Файлы</summary>

- `authors.js` — список авторов
- `gulpfile.babel.js` — сборщик gulp сайта
- `webpack.config.babel.js` — конфиг для js
- `package.json`, `.editorconfig`, `.eslintrc`, `.gitignore` — переносимое окружение
- `.travis.yml` — конфиг для тревиса
- `.deploy.sh` — деплой с тревиса
- `README.md`

</details>

<details><summary>Дамп</summary>

- `scripts/update.js` — апдейт дампа
- `dump/index.js` — получение дампа
- `dump/*.json` — дамп информации об авторах ('tweets', 'info', 'followers', 'media')
- `dump/images/` — дамп изображений авторов
- `helpers/` — хелперы

</details>

<details><summary>Сайт</summary>

- `css/` — CSS для сайта
- `layouts/` — Шаблоны для сайта
- `static/` — статические файлы для сайта
- `pages/` — маркдаун страницы на сайте

</details>

## Как помочь

1. `authors.js` - дополнить новыми авторами. username, дата первого твита, id первого твита.
2. Подать пулл-реквест :)
3. После принятия запустится билд, добавит последнего автора на сайте.

### Как обновить локально

1. `npm run update` - соберет новый дамп для последнего юзера, его твитов с `first` до текущего момента...
2. `npm start` - запустит локально копию сайта на `localhost:4000`
3. `npm run build` - создаст статику в `dist/` для деплоя.

#### Авторы

Обращайтесь к [@agapov_one](https://twitter.com/agapov_one) за помощью с этим шаблоном. (anyunderhood)

Спасибо [@iamstarkov](https://twitter.com/iamstarkov) за разработку первой версии, [@suxxes](https://twitter.com/suxxes) за продолжение и курирование [@abroadunderhood](https://twitter.com/abroadunderhood).
