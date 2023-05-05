<template>
</template>

<script>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch } from 'vue';

export default {
  props: {
    coordinates: {
      type: Array,
      default: null
    }
  },
  setup(props, { emit }) {
    const { result } = useQuery(
      gql`
        query CoffeeShops($latitude: Float!, $longitude: Float!, $limit: Int!) {
          coffeeShops: search(term: "coffee", latitude: $latitude, longitude: $longitude, limit: $limit) {
            business {
              name
              coordinates {
                latitude
                longitude
              }
            }
          }
          
          groceryStores: search(term: "grocery", latitude: $latitude, longitude: $longitude, limit: $limit) {
            business {
              name
              coordinates {
                latitude
                longitude
              }
            }
          }

          restaurant: search(term: "restaurant", latitude: $latitude, longitude: $longitude, limit: $limit) {
            business {
              name
              coordinates {
                latitude
                longitude
              }
            }
          }

          library: search(term: "library", latitude: $latitude, longitude: $longitude, limit: $limit) {
            business {
              name
              coordinates {
                latitude
                longitude
              }
            }
          }
        }
      `,
      { latitude: props.coordinates[1], longitude: props.coordinates[0], limit: 1 }
    );

    const coffeeShops = result.value?.data?.search?.business ?? []

    const emitCoffeeShopsLoaded = (value) => {
      emit('coffeeShopsLoaded', value)
    }

    const watchResult = () => {
      if (result.value) {
        emitCoffeeShopsLoaded(result.value)
      }
    }

    watch(() => result.value, watchResult)

    return {
      coffeeShops
    }
  }
}
</script>
