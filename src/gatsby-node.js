const parser = require('rss-parser')
const crypto = require('crypto')

const createContentDigest = obj =>
   crypto
   .createHash('md5')
   .update(JSON.stringify(obj))
   .digest('hex')

function getJsonFeed(userName) {
   const parser = new RssParser({
      customFields: {
         item: [
            ['content:encoded', 'content']
         ],
      },
   })
   return parser.parseURL('https://medium.com/feed/' + userName).then(feed => {
      const parsedFeeds = feed.items.map(item => {
         const thumbnail = item.content.match(
            /(?<=(<img[^>]+src="))([^"\s]+)(?!"[^>]*\/z)/g
         )[0]
         return {
            title: item.title,
            date: item.isoDate,
            author: item.creator,
            link: item.link,
            content: item.content,
            thumbnail,
         }
      })
      return parsedFeeds
   })
}

function sourceNodes({
   boundActionCreators
}, {
   userName
}) {
   const {
      createNode
   } = boundActionCreators
   getJsonFeed(userName).then(feed => {
      createNode({
         ...feed,
         contentDigest: createContentDigest(feed)
      })
   })
}

exports.sourceNodes = sourceNodes