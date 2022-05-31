mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja21hbng2IiwiYSI6ImNrdTB1YTR6dDNxZzMydm8yaXl0djJkOTEifQ.N8DazWFnrtmRNrO-d2kR2g';

/**
 * Add the map to the page
 */
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rockmanx6/cku14ul752x8x18uhpoedzhzd',
    center: [145.005838, -37.802119],
    zoom: 13,
    /*- scrollZoom: false - */
});


const stores = {
    'type': 'FeatureCollection',
    'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [144.992532, -37.810370]
            },
            'properties': {
                'address': 'East Richmond Railway Station',
                'text': '<a href="https://www.instagram.com/p/CGD7UlOs665/" target="_blank"><strong>4tanutgal</strong> </a>&nbsp; - Be Like A Train <br /><br />',
            },
            'audioname': 'Train_passing_by',
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [145.000950, -37.796226]
            },
            'properties': {
                'address': 'Dights Falls Reserve',
                'text': '<a href="https://www.instagram.com/p/B3gWYU9gUHz/" target="_blank"><strong>hannahsofiaa</strong></a>&nbsp; - Edgy boy vs emo pigeon <br /><br />',
            },
            'audioname': 'Emo_pigeon',
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [145.0149202, -37.8201617]
            },
            'properties': {
                'address': 'Yarra Bend Park',
                'text': '<a href="https://www.instagram.com/p/CNRn-_PLkxv/" target="_blank"><strong>click.saidrose</strong></a>&nbsp; - What happens under the bridge stays under the bridge <br /><br />',
            },
            'audioname': 'Under_the_Bridge',
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [145.0013958, -37.7990895]
            },
            'properties': {
                'address': 'Yarra River Trail',
                'text': '<a href="https://www.instagram.com/p/CPkSn8_HlIY/" target="_blank"><strong>famymojo</strong></a>&nbsp; - hey there can I join you in your journey?? <br /><br />',
            },
            'audioname': 'Journey',
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [145.008735, -37.808766]
            },
            'properties': {
                'address': 'Flockhart Reserve',
                'text': '<a href="https://www.instagram.com/m_scott/" target="_blank"><strong>m_scott</strong></a>&nbsp; - Spring is here!!<br /><br />',
            },
            'audioname': 'Spring',
        },
    ]
};

/**
 * Assign a unique id to each store. You'll use this `id`
 * later to associate each point on the map with a listing
 * in the sidebar.
 */
stores.features.forEach((store, i) => {
    store.properties.id = i;
});

/**
 * Wait until the map loads to make changes to the map.
 */
map.on('load', () => {
    /**
     * This is where your '.addLayer()' used to be, instead
     * add only the source without styling a layer
     */
    map.addSource('places', {
        'type': 'geojson',
        'data': stores
    });

    /**
     * Add all the things to the page:
     * - The location listings on the side of the page
     * - The markers onto the map
     */
    buildLocationList(stores);
    addMarkers();
});

/**
 * Add a marker to the map for every store listing.
 **/
function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    for (const marker of stores.features) {
        /* Create a div element for the marker. */
        const el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${marker.properties.id}`;
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker';

        /**
         * Create a marker using the div element
         * defined above and add it to the map.
         **/
        new mapboxgl.Marker(el, {
                offset: [0, -23]
            })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        /**
         * Listen to the element and when it is clicked, do three things:
         * 1. Fly to the point
         * 2. Close all other popups and display popup for clicked store
         * 3. Highlight listing in sidebar (and remove highlight for all other listings)
         **/
        el.addEventListener('click', (e) => {
            /* Fly to the point */
            flyToStore(marker);
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
                `listing-${marker.properties.id}`
            );
            listing.classList.add('active');
        });
    }
}

/**
 * Add a listing for each store to the sidebar.
 **/
function buildLocationList({
    features
}) {
    for (const {
            properties
        }
        of features) {
        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = `listing-${properties.id}`;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${properties.id}`;
        link.innerHTML = `${properties.address}`;


        /**
         * Listen to the element and when it is clicked, do four things:
         * 1. Update the `currentFeature` to the store associated with the clicked link
         * 2. Fly to the point
         * 3. Close all other popups and display popup for clicked store
         * 4. Highlight listing in sidebar (and remove highlight for all other listings)
         **/
        link.addEventListener('click', function () {
            for (const feature of features) {
                if (this.id === `link-${feature.properties.id}`) {
                    flyToStore(feature);
                    createPopUp(feature);
                }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
        });
    }
}

/**
 * Use Mapbox GL JS's `flyTo` to move the camera smoothly
 * a given center point.
 **/
function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
    });
}

/**
 * Create a Mapbox GL JS `Popup`.
 **/
function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({
            closeOnClick: false
        })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
            `<h3>${currentFeature.properties.address}</h3><h4>${currentFeature.properties.text}</h4><audio controls>
    <source src="audio/${currentFeature.audioname}.mp3" type="audio/mpeg"></audio>`
        )
        .addTo(map);
}

function toggle() {
    var popup = document.getElementById('popup');
    popup.classList.toggle('active');
}