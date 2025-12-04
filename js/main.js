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
    zoom: 10
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
