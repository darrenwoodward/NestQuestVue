import { createApp } from 'vue';
import App from './App.vue';

import './assets/main.css'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import { setContext } from '@apollo/client/link/context';
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable';


const httpLink = new HttpLink({
  uri: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/graphql',
  method: 'POST',
});

const authLink = setContext((_, { headers }) => {
  const apiKey = 'HujP7idTjSVGfa6EciNaVJmJiCjx3HxaXSubrs2UTX4KTmYkhd4fToNspPD0Z0_x1p7ySsnfh5Z5U4bByCRIK6IT0yIO_xFcm1Q38cntH2Dl42jo9SubzVODlClIZHYx';//process.env.AUTH_TOKEN; // access API key from environment variable
  return {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type" : "application/json",
      "Accept-Language" : "en_US"
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

// Create a provider
const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp(App);
//app.provide(DefaultApolloClient(apolloClient))
app.provide(provideApolloClient(apolloClient))
app.use(apolloProvider);
app.mount('#app');
