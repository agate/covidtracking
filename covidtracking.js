// init map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWdhdGUiLCJhIjoiZVFVZmRaUSJ9.yXeeYlyDdo7Klf8DEEM5FA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
});

// zoom to US
const sw = new mapboxgl.LngLat(-124.82, 25.25);
const ne = new mapboxgl.LngLat(-66.60, 49.00);
const bounds = new mapboxgl.LngLatBounds(sw, ne);
map.fitBounds(bounds, { padding: 20 });

fetch('https://covidtracking.com/api/states').then(res => res.json()).then((data) => {
  const geojson = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  }
  data.forEach((state) => {
    if (STATES_META[state.state]) {
      state.positive = state.positive || 0;
      state.death = state.death || 0;
      state.pending = state.pending || 0;

      geojson.data.features.push({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            STATES_META[state.state].lng,
            STATES_META[state.state].lat,
          ]
        },
        'properties': state
      })
    }
  })
  map.on('load', () => {
    map.addSource('points', geojson);
    map.addLayer({
      'id': 'circles',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-color': [
          'step',
          ['get', 'positive'],
          '#696b6b',
          100,
          '#ff9500',
          750,
          '#ba0010'
        ],
        'circle-radius': [
          'step',
          ['get', 'positive'],
          15,
          100,
          20,
          750,
          30
        ]
      }
    });
    map.addLayer({
      id: 'circle-counts',
      type: 'symbol',
      source: 'points',
      layout: {
        'text-field': "{positive}",
        'text-size': 12
      },
      paint: {
       'text-color': '#FFFFFF'
      }
    });
  });
});

const STATES_META = {
  AL: { name: "Alabama", lat: 32.318230, lng: -86.902298 },
  AK: { name: "Alaska", lat: 66.160507, lng: -153.369141 },
  AZ: { name: "Arizona", lat: 34.048927, lng: -111.093735 },
  AR: { name: "Arkansas", lat: 34.799999, lng: -92.199997 },
  CA: { name: "California", lat: 36.778259, lng: -119.417931 },
  CO: { name: "Colorado", lat: 39.113014, lng: -105.358887 },
  CT: { name: "Connecticut", lat: 41.599998, lng: -72.699997 },
  DE: { name: "Delaware", lat: 39.000000, lng: -75.500000 },
  FL: { name: "Florida", lat: 27.994402, lng: -81.760254 },
  GA: { name: "Georgia", lat: 33.247875, lng: -83.441162 },
  HI: { name: "Hawaii", lat: 19.741755, lng: -155.844437 },
  ID: { name: "Idaho", lat: 44.068203, lng: -114.742043 },
  IL: { name: "Illinois", lat: 40.000000, lng: -89.000000 },
  IN: { name: "Indiana", lat: 40.273502, lng: -86.126976 },
  IA: { name: "Iowa", lat: 42.032974, lng: -93.581543 },
  KS: { name: "Kansas", lat: 38.500000, lng: -98.000000 },
  KY: { name: "Kentucky", lat: 37.839333, lng: -84.270020 },
  LA: { name: "Louisiana", lat: 30.391830, lng: -92.329102 },
  ME: { name: "Maine", lat: 45.367584, lng: -68.972168 },
  MD: { name: "Maryland", lat: 39.045753, lng: -76.641273 },
  MA: { name: "Massachusetts", lat: 42.407211, lng: -71.382439 },
  MI: { name: "Michigan", lat: 44.182205, lng: -84.506836 },
  MN: { name: "Minnesota", lat: 46.392410, lng: -94.636230 },
  MS: { name: "Mississippi", lat: 33.000000, lng: -90.000000 },
  MO: { name: "Missouri State", lat: 38.573936, lng: -92.603760 },
  MT: { name: "Montana", lat: 46.965260, lng: -109.533691 },
  NE: { name: "Nebraska", lat: 41.500000, lng: -100.000000 },
  NV: { name: "Nevada", lat: 39.876019, lng: -117.224121 },
  NH: { name: "New Hampshire", lat: 44.000000, lng: -71.500000 },
  NJ: { name: "New Jersey", lat: 39.833851, lng: -74.871826 },
  NM: { name: "New Mexico", lat: 34.307144, lng: -106.018066 },
  NY: { name: "New York", lat: 43.000000, lng: -75.000000 },
  NC: { name: "North Carolina", lat: 35.782169, lng: -80.793457 },
  ND: { name: "North Dakota", lat: 47.650589, lng: -100.437012 },
  OH: { name: "Ohio", lat: 40.367474, lng: -82.996216 },
  OK: { name: "Oklahoma", lat: 36.084621, lng: -96.921387 },
  OR: { name: "Oregon", lat: 44.000000, lng: -120.500000 },
  PA: { name: "Pennsylvania", lat: 41.203323, lng: -77.194527 },
  RI: { name: "Rhode Island", lat: 41.700001, lng: -71.500000 },
  SC: { name: "South Carolina", lat: 33.836082, lng: -81.163727 },
  SD: { name: "South Dakota", lat: 44.500000, lng: -100.000000 },
  TN: { name: "Tennessee", lat: 35.860119, lng: -86.660156 },
  TX: { name: "Texas", lat: 31.000000, lng: -100.000000 },
  UT: { name: "Utah", lat: 39.419220, lng: -111.950684 },
  VT: { name: "Vermont", lat: 44.000000, lng: -72.699997 },
  VA: { name: "Virginia", lat: 37.926868, lng: -78.024902 },
  WA: { name: "Washington", lat: 47.751076, lng: -120.740135 },
  WV: { name: "West Virginia", lat: 39.000000, lng: -80.500000 },
  WI: { name: "Wisconsin", lat: 44.500000, lng: -89.500000 },
  WY: { name: "Wyoming", lat: 43.075970, lng: -107.290283 },
}
