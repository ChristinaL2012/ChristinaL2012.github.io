let stop = {
    nr: 23,
    name: "Taupo",
    lat: -38.684444,
    lng: 176.070833,
    user: "Christinal2012",
    wikipedia: "https://en.wikipedia.org/wiki/Taup%C5%8D",
};

console.log(stop);

const map = L.map("map", {
    center: [stop.lat, stop.lng],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([stop.lat, stop.lng]).addTo(map);
mrk.bindPopup("Taupo").openPopup();


//WMTS-Services
//console.log(document.querySelector("#map"));
