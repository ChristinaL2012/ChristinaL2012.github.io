const map = L.map("map", {
    center: [-38.684444, 176.070833],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([-38.684444, 176.070833]).addTo(map);
mrk.bindPopup("Taupo").openPopup();


//WMTS-Services
console.log(document.querySelector("#map"));
