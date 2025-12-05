// nav toggle
function toggleNav() {
    const nav = document.getElementById("navbar");
    if (nav.className === "topnav") {
        nav.className += " responsive";
    } else {
        nav.className = "topnav";
    }
}

// query popup
// const helpBtn = document.getElementById("help-button");
const popup = document.getElementById("popup");
const tutorialClose = document.getElementById("tutorialClose");

// helpBtn.addEventListener("click", () => {
//     popup.classList.add("visible");
// });

tutorialClose.addEventListener("click", () => {
    popup.classList.remove("visible");
});

// for maps
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpZGFuZyIsImEiOiJjbWhib3YwM3cxYmM0Mmxwdm00MmpubjdnIn0.A_2GT3PB5OEdbL9HLwlubQ'; // add token later
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kridang/cmir3vpns001401r78lo46x97', // custom style
    center: [-122.31, 47.669],
    zoom: 12	
});

map.on('load', async () => {
	// for mha
	map.addSource('mha-zones', {
		type: 'geojson',
		data: 'data/mha_clean.geojson'   
	});

	map.addLayer({
		id: 'mha-fill',
		type: 'fill',
		source: 'mha-zones',
		paint: {
			'fill-color': '#f7c6d9',   
			'fill-opacity': 0.40,
			'fill-outline-color': '#d48aa3'  
		}
		layout: { visibility: 'visible' }
	});
    document.getElementById("mhaBtn").addEventListener("click", () => {
    	const current = map.getLayoutProperty("mha-fill", "visibility");
    	const newVis = current === "none" ? "visible" : "none";
    	map.setLayoutProperty("mha-fill", "visibility", newVis);
	});

	document.getElementById("mhaBtn").addEventListener("click", () => {
			const current = map.getLayoutProperty("mha-fill", "visibility");
			const newVisibility = current === "none" ? "visible" : "none";
			map.setLayoutProperty("mha-fill", "visibility", newVisibility);
  });

	// for lightrail
	const lightrailResp = await fetch('data/clean_lightrail.geojson');
	const lightrail = await lightrailResp.json();

	map.addSource('lightrail', { type: 'geojson', data: lightrail });
	map.addLayer({
		id: 'lightrail-layer',
		type: 'circle',
		source: 'lightrail',
		paint: {
				'circle-radius': 8,
				'circle-color': 'blue',
				'circle-stroke-width': 2,
				'circle-stroke-color': 'white'
		}
	});

	const uwCampus = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [-122.303, 47.655] },
    properties: { name: "University of Washington" }
	};

	map.addSource('uw-campus', { type: 'geojson', data: uwCampus });
	map.addLayer({
    id: 'uw-campus-layer',
    type: 'circle',
    source: 'uw-campus',
    paint: {
			'circle-radius': 12,
			'circle-color': 'purple',
			'circle-stroke-width': 2,
			'circle-stroke-color': 'white'
    }
	});

	map.addSource('lines-source', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
	map.addLayer({
    id: 'lines-layer',
    type: 'line',
    source: 'lines-source',
    paint: { 'line-width': 3, 'line-color': 'black' }
	});

	map.on('click', 'lightrail-layer', async (e) => {
    const station = e.features[0];

    const start = station.geometry.coordinates;
    const end = [-122.303, 47.655]; // UW Campus PT!
		
		// From Turf
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
			const response = await fetch(url);
			const data = await response.json();
			if (!data.routes || data.routes.length === 0) return;

			const route = data.routes[0].geometry;

			map.getSource('lines-source').setData({
				type: "FeatureCollection",
				features: [{ type: "Feature", geometry: route }]
			});

			const distanceKm = (data.routes[0].distance / 1000).toFixed(2); // meters to km

			new mapboxgl.Popup()
				.setLngLat(start)
				.setHTML(`<strong>${station.properties.NAME}</strong><br>Distance to UW: ${distanceKm} km`)
				.addTo(map);

			map.easeTo({ center: start, zoom: 13 });

		} catch (err) {
			console.error("Error fetching walking route:", err);
		}
	});

	document.getElementById("transitBtn").addEventListener("click", () => {
				const uw = map.getLayoutProperty("uw-campus-layer", "visibility");	
        const lightrail = map.getLayoutProperty("lightrail-layer", "visibility");
        const newVisibility = lightrail === "none" ? "visible" : "none";
				const newUWVisibility = uw === "none" ? "visible" : "none";
        map.setLayoutProperty("lightrail-layer", "visibility", newVisibility);
				map.setLayoutProperty("uw-campus-layer", "visibility", newUWVisibility);	
    });
});


