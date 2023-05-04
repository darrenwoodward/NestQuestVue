<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
  <div>
    <table>
      <tr v-for="(row, index) in matrix" :key="index">
        <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import axios from 'axios';



export default {
  props: {
    coffeeShops: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mapboxAccessToken: '',
      coordinates: [],
      markers: [],
      directions: {},
      matrix: []
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
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-96, 37.8], // default center
      zoom: 9 // default zoom
    })
    this.map = map;
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      }
    })
    map.addControl(geolocate)
    geolocate.on('geolocate', (event) => {
      const lngLat = []
      this.coordinates.push(event.coords.longitude, event.coords.latitude)
      this.$emit('coordinate-selected', this.coordinates)
      this.getRoute(this.coordinates);

      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: this.coordinates
                }
              }
            ]
          }
        },

      });
    })
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
    async addDirections(shopLng, shopLat) {
      this.getDirectionsMatrix(shopLng, shopLat);

      const coords = [shopLng, shopLat];
      this.end = {
        type: 'FeatureCollection',
        features: [
          {

          }
        ]
      };

      this.map.addLayer({
        id: 'end' + shopLng,
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: coords
                }
              }
            ]
          }
        },

      });

      this.getRoute(coords);



    },

    async getRoute(endCoordinates) {
      const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.mapbox.com/directions/v5/mapbox/walking/${endCoordinates + ";" + this.coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      try {
        const response = await axios.get(apiUrl);

        // Add the route to the map
        const data = response.data.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };

        this.map.addLayer({
          id: 'route' + endCoordinates[0],
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });

        //TODO - Refactor so that the bounds do not get set to the starting point LatLng Value so that the map does not zoom in and then out. 
        // Get the bounds of the route
        const bounds = new mapboxgl.LngLatBounds();
        route.forEach(function (point) {
          bounds.extend(point);
        });
        // Fit the map to the bounds
        this.map.fitBounds(bounds, {
          padding: 20
        });
      } catch (error) {
        console.log(error)
      }
    },
    //TODO - Refactor so that there is only 1 matrix drawn.
    //      We have a 1 to many relationship between the address and the surrounding businesses
    //      Create a soluition that waits until we have all of the LatLng values for the businesses/locations
    async getDirectionsMatrix(shopLng, shopLat) {
      const profile = 'mapbox/walking'; // or 'walking' or 'cycling'
      const coordinates = [shopLng, shopLat];
      //TODO - FIX hardcoded join

      const apiUrl = `https://api.mapbox.com/directions-matrix/v1/${profile}/${coordinates + ";" + this.coordinates}?destinations=1?sources=0&annotations=distance,duration&access_token=${mapboxgl.accessToken}`;
      try {
        const response = await axios.get(apiUrl);
        console.log(response.data); // or update your component state with the response data
        //
        this.updateTravelInfo(response.data.distances, response.data.durations);
      } catch (error) {
        console.error(error);
      }
    },
    //TODO - This method should update the UI as shown in the FIGMA spec
    updateTravelInfo(distances, durations) {
      for (let i = 0; i < distances.length; i++) {
        //Convert meters to miles
        if (distances[i][0] !== 0) {
          var miles = (distances[i][0] * 0.00062137).toFixed(2);

          console.log(miles + " miles away")
        }
        //Convert Seconds to minutes
        if (durations[i][0] !== 0) {
          var minutes = (durations[i][0] / 60).toFixed();
          console.log(minutes + " minutes")
        }

      }
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
          