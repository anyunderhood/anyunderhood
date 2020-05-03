
import { outputFile } from 'fs-extra';
import { isEmpty, concat, reverse, last } from 'ramda';
import moment from 'moment';
import dec from 'bignum-dec';
import { sync as rm } from 'rimraf';

import { underhood } from '../../underhood.js';

import tokens from 'twitter-tokens';
import getTweets from '../../helpers/get-tweets';
import getInfo from 'get-twitter-info';
import saveMedia from '../../helpers/save-media';
import getFollowers from '../../helpers/get-followers';

import ensureFilesForFirstUpdate from '../../helpers/ensure-author-files';
import getAuthorArea from '../../helpers/get-author-area';
import saveAuthorArea from '../../helpers/save-author-area';

/// Updates one author
const update = (author, maxId) => {
  const { username, first } = author;

  ensureFilesForFirstUpdate(username);

  const tweets = getAuthorArea(username, 'tweets').tweets || [];

  const tweetsSinceId = isEmpty(tweets) ? dec(first) : last(tweets).id_str;
  const tweetsMaxId = maxId && dec(maxId);
  getTweets(tokens, underhood, tweetsSinceId, tweetsMaxId, (err, newTweetsRaw) => {
    if (err) throw err;
    const concattedTweets = concat(tweets, reverse(newTweetsRaw));
    saveAuthorArea(username, 'tweets', { tweets: concattedTweets });
  });

  getInfo(tokens, underhood).then(info => {
    saveAuthorArea(authorId, 'info', info);
  });

  rm(`./dump/images/${username}*`);
  saveMedia(tokens, underhood, username, (err, media) => {
    if (err) throw err;
    saveAuthorArea(username, 'media', media);
  });

  getFollowers(tokens, underhood, (err, followersIds) => {
    if (err) throw err;
    saveAuthorArea(username, 'followers', { followersIds });
  });

  outputFile('./dump/.timestamp', moment().unix(), err => {
    console.log(`${err ? '✗' : '✓'} timestamp`);
  });
}

export default update;
