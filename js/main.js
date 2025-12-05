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
const helpBtn = document.getElementById("help-button");
const popup = document.getElementById("popup");
const tutorialClose = document.getElementById("tutorialClose");

helpBtn.addEventListener("click", () => {
    popup.classList.add("visible");
});

tutorialClose.addEventListener("click", () => {
    popup.classList.remove("visible");
});

// for maps
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpZGFuZyIsImEiOiJjbWhib3YwM3cxYmM0Mmxwdm00MmpubjdnIn0.A_2GT3PB5OEdbL9HLwlubQ'; // add token later
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kridang/cmir3vpns001401r78lo46x97', // custom style
    center: [-122.3035, 47.6553],
    zoom: 12
});

// const uwLon = -122.3080;
// const uwLat = 47.6536;

// const isoUrlBase = "https://api.mapbox.com/isochrone/v1/mapbox/";
// let isoVisible = false;

// async function getIso() {
//   const query = await fetch(
//     `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
//     { method: 'GET' }
//   );
//   const data = await query.json();
//   console.log(data);
// }

map.on('load', async () => {
	// isochrone source
	// map.addSource("uw-isochrones", {
	// 		type: "geojson",
	// 		data: { type: "FeatureCollection", features: [] }
	// });

	// for isochrone
	// map.addLayer(
  //   {
  //     id: 'isoLayer',
  //     type: 'fill',
  //     source: 'iso',
  //     layout: {},
  //     paint: {
  //       'fill-color': '#5a3fc0',
  //       'fill-opacity': 0.3
  //     }
  //   },
  //   'poi-label'
  // );

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
			const current = map.getLayoutProperty("mha-fill", "visibility");
			const newVisibility = current === "none" ? "visible" : "none";
			map.setLayoutProperty("mha-fill", "visibility", newVisibility);
  });

	// getIso();
	// map.getSource('iso').setData(data);

	// isochrone button
	// const isoBtn = document.getElementById("isoBtn");
	// isoBtn.addEventListener("click", async () => {
	// 		isoVisible = !isoVisible;

	// 		if (isoVisible) {
	// 				const isoData = await getIsochrones();
	// 				map.getSource("uw-isochrones").setData(isoData);
	// 				isoBtn.classList.add("active-btn");
	// 		} else {
	// 				map.getSource("uw-isochrones").setData({
	// 						type: "FeatureCollection",
	// 						features: []
	// 				});
	// 				isoBtn.classList.remove("active-btn");
	// 		}
	// });
});


