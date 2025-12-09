// nav toggle
function toggleNav() {
    const nav = document.getElementById("navbar");
    if (nav.className === "topnav") {
        nav.className += " responsive";
    } else {
        nav.className = "topnav";
    }
}

//for maps
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpZGFuZyIsImEiOiJjbWhib3YwM3cxYmM0Mmxwdm00MmpubjdnIn0.A_2GT3PB5OEdbL9HLwlubQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kridang/cmir3vpns001401r78lo46x97',
    center: [-122.31, 47.669],
    zoom: 12
});

map.on('load', async () => {
    //for rent
    map.addSource('housing', {
        type: 'geojson',
        data: 'data/2024_merged.geojson'
    });

    map.addLayer({
        id: 'housing-fill',
        type: 'fill',
        source: 'housing',
        paint: {
            'fill-color': [
                'match',
                ['get', 'Cost Category'],
                'Low', '#6BCB77',
                'Medium', '#FFD93D',
                'High', '#FF6B6B',
                '#cccccc'
            ],
            'fill-opacity': 0.65
        }
    });

    map.addLayer({
        id: 'housing-outline',
        type: 'line',
        source: 'housing',
        paint: {
            'line-color': '#000',
            'line-width': 1
        }
    });

    //hover
    const rentPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', 'housing-fill', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        const props = e.features[0].properties;

        const name = props['Community Reporting Area Name'] || 'Area';
        const medianRent = props['Median Rent'] || 'N/A';
        const rentChange = props['Rent Change'] || 'N/A';

        rentPopup
            .setLngLat(e.lngLat)
            .setHTML(`
                <strong>${name}</strong><br>
                <strong>Median Rent:</strong> $${medianRent}<br>
                <strong>Rent Change:</strong> ${rentChange}
            `)
            .addTo(map);
    });

    map.on('mouseleave', 'housing-fill', () => {
        map.getCanvas().style.cursor = '';
        rentPopup.remove();
    });

    document.getElementById("priceBtn").addEventListener("click", () => {
    const layers = ['housing-fill', 'housing-outline'];

    // determine if button will be ON
    const current = map.getLayoutProperty("housing-fill", "visibility");
    const willBeVisible = current === "none"; // if currently hidden ⇒ we're turning ON

    layers.forEach(layer => {
        map.setLayoutProperty(layer, "visibility", willBeVisible ? "visible" : "none");
    });

    // update button styling
    setButtonColor("priceBtn", willBeVisible);
});

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
	});

	document.getElementById("mhaBtn").addEventListener("click", () => {
		const layers = ['mha-fill'];

		const current = map.getLayoutProperty("mha-fill", "visibility");
		const willBeVisible = current === "none";

		layers.forEach(layer => {
			map.setLayoutProperty(layer, "visibility", willBeVisible ? "visible" : "none");
		});

		setButtonColor("mhaBtn", willBeVisible);
});

  // for bus
  const transitResp = await fetch('data/transit.geojson');
	const transit = await transitResp.json();

	map.addSource('transit', { type: 'geojson', data: transit });

	map.addLayer({
		id: 'transit-layer',
		type: 'circle',
		source: 'transit',
		paint: {
			'circle-radius': 4,
			'circle-color': '#919090',
			'circle-stroke-width': 1,
			'circle-stroke-color': 'white'
		}
	});

	map.on("click", "transit-layer", async (e) => {
    const busStop = e.features[0];
    const busCoords = busStop.geometry.coordinates;
    const busPt = turf.point(busCoords);

    const nearest = turf.nearestPoint(busPt, lightrail);

    if (!nearest) return;

    const stationCoords = nearest.geometry.coordinates;

    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/` +
        `${busCoords[0]},${busCoords[1]};${stationCoords[0]},${stationCoords[1]}` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) return;

        const route = data.routes[0].geometry;
        const distanceKm = (data.routes[0].distance / 1000).toFixed(2);

        map.getSource("lines-source").setData({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: route
                }
            ]
        });
		map.setLayoutProperty("lines-layer", "visibility", "visible");


        new mapboxgl.Popup()
            .setLngLat(busCoords)
            .setHTML(`
                <strong>Bus Stop ID:</strong> ${busStop.properties.STOP_ID}<br>
                <strong>Nearest Lightrail:</strong> ${nearest.properties.NAME || "Station"}<br>
                <strong>Walking Distance:</strong> ${distanceKm} km
            `)
            .addTo(map);

        map.easeTo({ center: busCoords, zoom: 14 });

    } catch (error) {
        console.error("Walking route error:", error);
    }
	});

	document.getElementById("busBtn").addEventListener("click", () => {
		const layers = ['transit-layer'];

		const current = map.getLayoutProperty("transit-layer", "visibility");
		const willBeVisible = current === "none";

		layers.forEach(layer => {
			map.setLayoutProperty(layer, "visibility", willBeVisible ? "visible" : "none");
		});

		if (!willBeVisible) hideRouteLine();

		setButtonColor("busBtn", willBeVisible);
	});

	function hideRouteLine() {
    	map.setLayoutProperty("lines-layer", "visibility", "none");
	}	

	// Crime data cluster 
	map.addSource('crime', {
    	type: 'geojson',
    	data: 'data/spd_2025.geojson',
    	cluster: true,
    	clusterMaxZoom: 14,
    	clusterRadius: 40
	});

	map.addLayer({
    	id: 'crime-clusters-blue',
    	type: 'circle',
    	source: 'crime',
    	filter: ['has', 'point_count'],
		layout: {
        	'visibility': 'none'
    	},
    	paint: {
        	'circle-color': [
            	'step',
            	['get', 'point_count'],
        			'#D6EAF8', 
       				 50, '#5DADE2', 
       				 200, '#1B4F72' 
        	],
        	'circle-radius': [
            	'step',
            	['get', 'point_count'],
        			15,
        			50, 22,
        			200, 30
        	]
    	}
	});

	map.addLayer({
    	id: 'crime-cluster-count-blue',
    	type: 'symbol',
    	source: 'crime',
    	filter: ['has', 'point_count'],
    	layout: {
			'visibility': 'none',
     		'text-field': '{point_count_abbreviated}',
        	'text-size': 12
    	}
	});

	map.addLayer({
    	id: 'crime-unclustered-blue',
    	type: 'circle',
    	source: 'crime',
    	filter: ['!', ['has', 'point_count']],
		layout: {
        	'visibility': 'none'
    	},
    	paint: {
        	'circle-color': 'black',
        	'circle-radius': 5,
        	'circle-stroke-width': 1,
        	'circle-stroke-color': 'white'
    	}
	});

	map.on('click', 'crime-clusters-blue', (e) => {
    	const features = map.queryRenderedFeatures(e.point, {
        	layers: ['crime-clusters-blue']
    	});

    	const clusterId = features[0].properties.cluster_id;

    	map.getSource('crime').getClusterExpansionZoom(clusterId, (err, zoom) => {
        	if (err) return;
        	map.easeTo({
            	center: features[0].geometry.coordinates,
            	zoom: zoom
        	});
    	});
	});

	document.getElementById("crimeBtn").addEventListener("click", () => {
		const layers = ['crime-clusters-blue','crime-cluster-count-blue','crime-unclustered-blue'];

		const current = map.getLayoutProperty("crime-clusters-blue", "visibility");
		const willBeVisible = current === "none";

		layers.forEach(layer => {
			map.setLayoutProperty(layer, "visibility", willBeVisible ? "visible" : "none");
		});

		setButtonColor("crimeBtn", willBeVisible);
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
				'circle-radius': 7,
				'circle-color': 'yellow',
				'circle-stroke-width': 1,
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
			'circle-radius': 8,
			'circle-color': 'purple',
			'circle-stroke-width': 1,
			'circle-stroke-color': 'white'
    }
	});

	map.addSource('lines-source', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
	map.addLayer({
    id: 'lines-layer',
    type: 'line',
    source: 'lines-source',
    layout: { visibility: 'none' },
    paint: { 'line-width': 3, 'line-color': 'black' }
	});

	map.on('click', 'lightrail-layer', async (e) => {
    const station = e.features[0];

    const start = station.geometry.coordinates;
    const end = [-122.303, 47.655]; // UW Campus PT!
		
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
		const layers = ['lightrail-layer', 'uw-campus-layer'];

		const current = map.getLayoutProperty("lightrail-layer", "visibility");
		const willBeVisible = current === "none";

		layers.forEach(layer => {
			map.setLayoutProperty(layer, "visibility", willBeVisible ? "visible" : "none");
		});

		if (!willBeVisible) hideRouteLine();

		setButtonColor("transitBtn", willBeVisible);
	});

	// for active legend buttons
	function setButtonColor(buttonId, isVisible) {
    const btn = document.getElementById(buttonId);
    
    if (!btn) return;

    if (isVisible) {
        btn.classList.add("active-btn");
    } else {
        btn.classList.remove("active-btn");
    }
	}
});
