import { map, merge } from 'ramda'
import authors from './rendered-authors'
import getAuthorArea from './get-author-area'

const saturate = (author) =>
  merge(author, {
    info: getAuthorArea(author.username, 'info') || {},
    tweets: getAuthorArea(author.username, 'tweets').tweets || [],
    media: merge(
      { image: '', banner: '' },
      getAuthorArea(author.username, 'media')
    ),
  })

export default map(saturate, authors)
