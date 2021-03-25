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
    //center: [stop.lat, stop.lng],
    //zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let nav = document.querySelector("#navigation");
console.log (nav);

//console.log(ROUTE);

ROUTE.sort((stop1, stop2) => {
    return stop1.nr > stop2.nr
});

for(let entry of ROUTE) {
    //console.log(entry);

    nav.innerHTML +=  `
        <option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>
    `;

    let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
    mrk.bindPopup(`
        <h4>Stop ${entry.nr}: ${entry.name} </h4>
        <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}">Read more about stop in Wikipedia</a></p>
    `);

  if(entry.nr==23) {
      map.setView([entry.lat, entry.lng], 13)
      mrk.openPopup ();
  }  
}



//WMTS-Services
//console.log(document.querySelector("#map"));
//<option value="ChristinaL2012">Taupo</option>
