const name = "mobileunderhood"

const description = "Коллективный твиттер-аккаунт для мобильных разработчиков с новым автором каждую неделю"

const email = "agapov.onede@gmail.com"
const authorName = ["Alex Agapov", "Pavel Trofimov"] // TODO: AUTHORS
const author = email + " (" + authorName.join(', ') + ")"

module.exports = {
  "underhood": name,
  "underhoodDesc": description,
  "underhoodSite": name + ".ru",
  "githubUser": "WantSomeTea",
  "githubRepo": "anyunderhood",
  "curatorEmail": "igrekde@gmail.com",
  "curatorTwitter": "igrekde",
  "creatorTwitter": "igrekde",
  "gauges": "",
  "googleAnalytics": "",
  "yandexMetric": "",
  "creatorCreds": author,
  "underhoodVersion": "0.1.2",
  "site": {
    "title": "Сайт @" + name,
    "description": description,
    "feed_url": "https://" + name + ".ru/rss.xml",
    "site_url": "https://" + name + ".ru/",
    "managingEditor": author,
    "webMaster": author,
    "copyright": "MIT",
    "language": "ru",
    "categories": [
      "twitter"
    ]
  }
}
