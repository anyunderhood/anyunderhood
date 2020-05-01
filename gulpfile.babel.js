import buildbranch from 'buildbranch';
import rimraf from 'rimraf';
import each from 'each-done';
import debug from 'gulp-debug';
import express from 'express';
import fs, { outputFile as output } from 'fs-extra';
import { html } from 'commonmark-helpers';
import numbers from 'typographic-numbers';
import numd from 'numd';
import { pipe, prop, head, splitEvery } from 'ramda';
import renderTweet from 'tweet.md';
import autoprefixer from 'autoprefixer';
import pcssImport from 'postcss-import';
import pcssInitial from 'postcss-initial';
import webpack from 'webpack';

import gulp, { dest, src, start, task, series, parallel } from 'gulp';
import gulpJade from 'gulp-jade';
import rename from 'gulp-rename';
import watch from 'gulp-watch';
import { log, PluginError } from 'gulp-util';
import jimp from 'gulp-jimp';
import postcss from 'gulp-postcss';

import articleData from 'article-data';
import getStats from './stats.js';
import webpackConfig from './webpack.config.babel.js';

import authorRender from './helpers/author-render';
import bust from './helpers/bust';
import lastUpdated from './helpers/last-updated';
import { site, underhood } from './underhood'

import authors from './dump';
const latestInfo = head(authors).info;

const jadeDefaults = {
  pretty: true,
  locals: {
    site,
    latestInfo,
    underhoodName: underhood,
    numbers: input => numbers(input, { locale: 'ru' }),
    people: numd('человек', 'человека', 'человек'),
  },
};

const getOptions = (opts = {}) =>
  Object.assign({}, jadeDefaults, opts, {
    locals: Object.assign({}, jadeDefaults.locals, opts.locals),
  });

const jade = opts => gulpJade(getOptions(opts));
const firstTweet = pipe(prop('tweets'), head);
const render = pipe(renderTweet, html);

/**
 * MAIN TASKS
 */

task('css', () =>
  src('css/styles.css')
    .pipe(postcss([
      pcssImport,
      pcssInitial,
      autoprefixer,
    ]))
    .pipe(dest('dist/css')));

task('index', series('css', () => {
  const authorsToPost = authors.filter(author => author.post !== false);
  return src('layouts/index.jade')
    .pipe(jade({
      locals: {
        title: `Сайт @${site.title}`,
        desc: site.description,
        currentAuthor: head(authors),
        authors: authorsToPost,
        helpers: { authorRender, bust },
      },
    }))
    .pipe(rename({ basename: 'index' }))
    .pipe(dest('dist'));
}));

task('stats', series('css', () => {
  const currentAuthor = head(authors.filter(author => author.post === false));
  return src('layouts/stats.jade')
    .pipe(jade({
      locals: {
        title: `Статистика @${site.title}`,
        url: 'stats/',
        desc: site.description,
        lastUpdated,
        stats: getStats(authors),
        currentAuthor: currentAuthor,
        helpers: { bust },
      },
    }))
    .pipe(rename({ dirname: 'stats' }))
    .pipe(rename({ basename: 'index' }))
    .pipe(dest('dist'));
}));

task('about', series('css', () => {
  const readme = fs.readFileSync('./pages/about.md', { encoding: 'utf8' });
  const article = articleData(readme, 'D MMMM YYYY', 'en'); // TODO change to 'ru' after moment/moment#2634 will be published
  return src('layouts/article.jade')
    .pipe(jade({
      locals: Object.assign({}, article, {
        title: 'О проекте',
        url: 'about/',
        helpers: { bust },
      }),
    }))
    .pipe(rename({ dirname: 'about' }))
    .pipe(rename({ basename: 'index' }))
    .pipe(dest('dist'));
}));

task('authoring', series('css', () => {
  const readme = fs.readFileSync('./pages/authoring.md', { encoding: 'utf8' });
  const article = articleData(readme, 'D MMMM YYYY', 'en'); // TODO change to 'ru' after moment/moment#2634 will be published
  return src('layouts/article.jade')
    .pipe(jade({
      locals: Object.assign({}, article, {
        title: 'Авторам',
        url: 'authoring/',
        helpers: { bust },
      }),
    }))
    .pipe(rename({ dirname: 'authoring' }))
    .pipe(rename({ basename: 'index' }))
    .pipe(dest('dist'));
}));

task('instruction', series('css', () => {
  const readme = fs.readFileSync('./pages/instruction.md', { encoding: 'utf8' });
  const article = articleData(readme, 'D MMMM YYYY', 'en'); // TODO change to 'ru' after moment/moment#2634 will be published
  return src('layouts/article.jade')
    .pipe(jade({
      locals: Object.assign({}, article, {
        title: 'Инструкция',
        url: 'instruction/',
        helpers: { bust },
      }),
    }))
    .pipe(rename({ dirname: 'instruction' }))
    .pipe(rename({ basename: 'index' }))
    .pipe(dest('dist'));
}));

task('map', series('css', () => {
  const currentAuthor = head(authors.filter(author => author.post === false));
  const authorsToPost = authors.filter(author => author.post !== false);
  return src('layouts/map.jade')
    .pipe(jade({
      locals: {
        title: `Карта @${site.title}`,
        url: 'map/',
        desc: site.description,
        currentAuthor: currentAuthor,
        authors: authorsToPost,
        helpers: { bust },
      },
    }))
    .pipe(rename({ dirname: 'map' }))
    .pipe(rename({ basename: 'index' }))
    .pipe(dest('dist'));
}));

task('authors', series('css', done => {
  const authorsToPost = authors.filter(author => author.post !== false);
  each(authorsToPost, author => {
    return src('./layouts/author.jade')
      .pipe(jade({
        pretty: true,
        locals: {
          title: `Неделя @${author.username} в @${site.title}`,
          author,
          helpers: { authorRender, bust },
        },
      }))
      .pipe(rename({ dirname: author.username }))
      .pipe(rename({ basename: 'index' }))
      .pipe(dest('dist'));
  }, done);
}));

task('userpics', () =>
  src('dump/images/*-image*')
    .pipe(jimp({ resize: { width: 192, height: 192 }}))
    .pipe(dest('dist/images')));

task('banners', () =>
  src('dump/images/*-banner*')
    .pipe(dest('dist/images')));

task('current-userpic', () =>
  src(`dump/images/${head(authors).username}-image*`)
    .pipe(jimp({ resize: { width: 192, height: 192 }}))
    .pipe(rename('current-image'))
    .pipe(dest('dist/images')));

task('current-banner', () =>
  src(`dump/images/${head(authors).username}-banner*`)
    .pipe(rename('current-banner'))
    .pipe(dest('dist/images')));

task('current-media', series('current-userpic', 'current-banner'));

task('js', done => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new PluginError('webpack', err);
    done();
  });
});

task('static', () =>
  src([
    'static/**',
    'static/.**',
    'node_modules/bootstrap/dist/**',
  ]).pipe(dest('dist')));

task('server', () => {
  const app = express();
  app.use(express.static('dist'));
  app.listen(4000);
  log('Server is running on http://localhost:4000');
});

/**
 * FLOW
 */
task('clean', done => rimraf('dist', done));

task('html', series('stats', 'authors', 'index', 'map', 'about', 'authoring', 'instruction'));
task('build', series( 'css', 'js', 'static', 'stats', 'html', 'userpics', 'banners', 'current-media'));

task('watch', parallel('server', 'build', () => {
  watch(['**/*.jade'], series('html'));
  watch(['css/**/*.css'], series('css'));
  watch('js/**/*.js', series('js'));
  watch('static/**', series('static'));
}));

task('default', series('clean', 'watch'));

task('deploy', gulp.series('build'), done =>
  buildbranch({ branch: 'gh-pages', folder: 'dist' }, done));
