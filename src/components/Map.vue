<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'


export default {
  props: {
    coffeeShops: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      coordinates: [],
      markers: [],
      directions: {}
    }
  },
  watch: {
    coffeeShops: {
      handler(newCoffeeShops) {
        this.addMarkers(newCoffeeShops)
      },
      immediate: true
    }
  },
  mounted() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZGFycmVudzk5IiwiYSI6ImNsZ3dlcGZ1MDAwcjUzZ3B3eGRpeG9zcnQifQ.YdhpgauH0-KGFS7B0Kw-0w'
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-96, 37.8], // default center
      zoom: 9 // default zoom
    })
    this.map = map;
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
    map.addControl(geolocate)
    geolocate.on('geolocate', (event) => {
      const lngLat = []
      this.coordinates.push(event.coords.longitude, event.coords.latitude)
      this.$emit('coordinate-selected', this.coordinates)
    })

    const directions = new MapboxDirections({
  accessToken: 'pk.eyJ1IjoiZGFycmVudzk5IiwiYSI6ImNsZ3dlcGZ1MDAwcjUzZ3B3eGRpeG9zcnQifQ.YdhpgauH0-KGFS7B0Kw-0w',
  unit: 'imperial'
})
this.directions = directions;

this.map.addControl(directions, 'top-left')
    
  },
  methods: {
    setCoordinates(lngLat) {
      this.coordinates = lngLat
    },

    addMarkers(coffeeShops) {
      // Remove existing markers
      this.markers.forEach((marker) => marker.remove())
      this.markers = []

      // Add markers for each coffee shop
      coffeeShops.forEach((shop) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([shop.coordinates.longitude, shop.coordinates.latitude])
          .addTo(this.map)
        this.markers.push(marker)
        this.addDirections(shop.coordinates.longitude, shop.coordinates.latitude);
      })
    },
    addDirections(shopLng, shopLat){
      this.directions.setOrigin(this.coordinates);
      this.directions.setDestination([shopLng, shopLat]);
      

    }
  }
}
</script>

<style>
#map {
  height: 100vh;
  max-width: 530px;

  
}
</style>
