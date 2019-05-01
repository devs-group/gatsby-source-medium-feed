const rssParser = require('rss-parser')

function getJsonFeed(userName) {
   const parser = new rssParser({
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
   actions,
   createNodeId,
   createContentDigest,
   reporter
}, {
   userName,
   name
}) {
   const {
      createNode
   } = actions
   if (!userName || !name) {
      const missingOption = !userName && !name ? 'userName and name' : !userName ? 'userName' : 'name'
      reporter.panic(`${missingOption} has to defined in plugin configuration.`)
   }
   return getJsonFeed(userName).then(feed => {
      feed.forEach(item => {
         const id = createNodeId(item.link)
         createNode({
            ...item,
            id,
            parent: null,
            children: [],
            internal: {
               contentDigest: createContentDigest(feed),
               type: name,
               mediaType: 'application/json',
               content: JSON.stringify(item),
            }
         })
      })
   })
}

exports.sourceNodes = sourceNodes