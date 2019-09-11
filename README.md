# Gatsby source medium feed

This plugin returns the content of medium posts.

Available properties are:

- title
- date
- author
- link
- content
- thumbnail
- slug

## Usage

1. Run `npm i -S gatsby-source-medium-feed`
1. Add plugin to your `gatsby-config.js` :

```js
plugins: [
  {
    resolve: 'gatsby-source-medium-feed',
    options: {
      userName: '@...', // Medium user name
      name: 'MediumFeed', // GraphQL query AllMediumFeed
    },
  },
]
```
