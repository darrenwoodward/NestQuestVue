<template>
  <div>
    <!-- <Form @form-submitted="updateAddress" /> -->
    <!-- <CoffeeShops :address="address" /> -->
    <Map @coordinate-selected="setCoordinates"
    :coffee-shops="coffeeShops"/>
    <CoffeeShops v-if="coordinates" :coordinates="coordinates" @coffee-shops-updated="updateCoffeeShops" @coffeeShopsLoaded="handleCoffeeShopsLoaded" />

  </div>
</template>

<script>
import CoffeeShops from './components/CoffeeShops.vue';
import Map from './components/Map.Vue';

export default {
  components: {
    CoffeeShops,
    Map
  },
  data() {
    return {
      coordinates: null,
      coffeeShops: []
    };
  },
  methods: {
    setCoordinates(lngLat){
      this.coordinates = lngLat;
    },
    updateCoffeeShops(coffeeShops) {
      this.coffeeShops = coffeeShops;
    }, 
    handleCoffeeShopsLoaded(coffeeShops) {
      // do something with the loaded coffee shops
      console.log(coffeeShops);
      this.updateCoffeeShops(coffeeShops);
    }
  },
};
</script>