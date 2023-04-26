module.exports = {
    client: {
      service: {
        name: 'yelp-api',
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/graphql',
        headers: {
          Authorization: `Bearer ${process.env.APOLLO_KEY}`,
          "Content-Type": "application/json"
        }
      },
      includes: [
        './src/**/*.vue',
        './src/**/*.js',
      ],
    },
  };