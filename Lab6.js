function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function loadLocality(latitude, longitude, localityId) {
    var url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + latitude + '&longitude=' + longitude + '&localityLanguage=en';

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var locality = data.locality;

            if (!locality || locality === '') {
                locality = data.city || data.principalSubdivision || 'Not Available';
            }

            document.getElementById(localityId).innerHTML = 'Locality: ' + locality;
        })
        .catch(function() {
            document.getElementById(localityId).innerHTML = 'Locality: Not Available';
        });
}

window.onload = function() {
    var map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var lat1 = getRandomInRange(30, 35, 3);
    var lng1 = getRandomInRange(-90, -100, 3);
    var lat2 = getRandomInRange(30, 35, 3);
    var lng2 = getRandomInRange(-90, -100, 3);
    var lat3 = getRandomInRange(30, 35, 3);
    var lng3 = getRandomInRange(-90, -100, 3);

    var marker1 = L.marker([lat1, lng1]).addTo(map);
    var marker2 = L.marker([lat2, lng2]).addTo(map);
    var marker3 = L.marker([lat3, lng3]).addTo(map);

    document.getElementById('marker1-coords').innerHTML = 'Marker 1: Latitude: ' + lat1 + ', Longitude: ' + lng1;
    document.getElementById('marker2-coords').innerHTML = 'Marker 2: Latitude: ' + lat2 + ', Longitude: ' + lng2;
    document.getElementById('marker3-coords').innerHTML = 'Marker 3: Latitude: ' + lat3 + ', Longitude: ' + lng3;

    loadLocality(lat1, lng1, 'marker1-locality');
    loadLocality(lat2, lng2, 'marker2-locality');
    loadLocality(lat3, lng3, 'marker3-locality');

    var group = new L.featureGroup([marker1, marker2, marker3]);
    map.fitBounds(group.getBounds().pad(0.5));
};
