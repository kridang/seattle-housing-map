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
mapboxgl.accessToken = ''; // add token later
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-122.3035, 47.6553],
    zoom: 12
});
// for mha

map.on('load', () => {

    map.addSource('mha-zones', {
        type: 'geojson',
        data: 'assets/mha_zones_cleaned.geojson'   
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

});
