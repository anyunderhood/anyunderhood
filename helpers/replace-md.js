import { underhood, curatorTwitter } from '../underhood'

export default function (str) {
  return str
    .replace(/{{underhoodName}}/g, underhood)
    .replace(/{{curatorTwitter}}/g, curatorTwitter)
}
