<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  
  export default {
    props: {
      coffeeShops: {
        type: Array,
        required: true
      }
    },
    mounted() {
      // Set up Mapbox map
      mapboxgl.accessToken = '<pk.eyJ1IjoiZGFycmVudzk5IiwiYSI6ImNrNWg5NndwZDAxZTkzZG1ybjVqbG1oemkifQ.lIBaoWsUtklWZcn9zRlYMg>';
      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-73.97, 40.78], // default to New York City
        zoom: 12
      });
  
      // Add markers for each coffee shop
      this.coffeeShops.forEach(shop => {
        new mapboxgl.Marker()
          .setLngLat([shop.longitude, shop.latitude])
          .addTo(this.map);
      });
    },
    beforeDestroy() {
      // Clean up Mapbox map to prevent memory leaks
      this.map.remove();
    }
  };
  </script>
  
  <style>
  .map-container {
    height: 400px;
  }
  </style>
  