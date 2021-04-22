//https://leafletjs.com/reference-1.7.1.html#tilelayer
let basemapGray = L.tileLayer.provider('BasemapAT.grau');

//https://leafletjs.com/reference-1.7.1.html#map
let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

let overlays = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    snowheight: L.featureGroup(),
    windspeed: L.featureGroup(),
    winddirection: L.featureGroup()
};


//https://leafletjs.com/reference-1.7.1.html#control-layers
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    //https://leafletjs.com/reference-1.7.1.html#layergroup
    "BasemapAT.overlay+ortho": L.layerGroup([
        //https://leafletjs.com/reference-1.7.1.html#tilelayer
        L.tileLayer.provider('BasemapAT.orthofoto'),
        //https://leafletjs.com/reference-1.7.1.html#tilelayer
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}, {
    "Wetterstationen Tirol": overlays.stations,
    "Temperatur (°C)": overlays.temperature,
    "Schneehöhe (cm)": overlays.snowheight,
    "Windgeschwindigkeit (km/h)": overlays.windspeed,
    "Windrichtung": overlays.winddirection
},{
    collapsed:false
}).addTo(map);
overlays.temperature.addTo(map);

//Maßstab einbauen 

L.control.scale({
    imperial:false
}).addTo(map);

let newLabel = (coords, options) => {
    let label = L.divIcon({
        html: `<div>${options.value}</div>`
        className: "text-label"
    });

    let marker = L.marker([coords[1], coords[0]]);
    console.log("Marker:", marker);
    return marker;
    //Label erstellen
    //den Label zurückgeben
};
//

/*layerControl.addOverlay(overlays.stations, "Wetterstationen Tirol");
// awsLayer.addTo(map);
//https://leafletjs.com/reference-1.7.1.html#featuregroup
let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhen (cm)");
// snowLayer.addTo(map);
//https://leafletjs.com/reference-1.7.1.html#featuregroup
let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeit (km/h)");
windLayer.addTo(map);
//https://leafletjs.com/reference-1.7.1.html#featuregroup
let temperatureLayer = L.featureGroup();
layerControl.addOverlay(temperatureLayer, "Lufttemperatur (°C)");
temperatureLayer.addTo(map);*/

let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';
fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten konvertiert: ', json);
        for (station of json.features) {
            // console.log('Station: ', station);
            //https://leafletjs.com/reference-1.7.1.html#marker
            let marker = L.marker([
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
              <li>Datum: ${formattedDate.toLocaleString("de")}</li>
              <li>Seehöhe: ${station.geometry.coordinates[2]} m</li>
              <li>Temperatur: ${station.properties.LT} C</li>
              <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
              <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>
              <li>Windrichtung: ${station.properties.WR || '?'}</li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
            marker.addTo(overlays.stations);
            if (typeof station.properties.HS == "number") {
                let highlightClass = '';
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
                //https://leafletjs.com/reference-1.7.1.html#divicon
                let snowIcon = L.divIcon({
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
                //https://leafletjs.com/reference-1.7.1.html#marker
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(overlays.snowheight);
            }
            if (typeof station.properties.WG == "number") {
                let windHighlightClass = '';
                if (station.properties.WG > 10) {
                    windHighlightClass = 'wind-10';
                }
                if (station.properties.WG > 20) {
                    windHighlightClass = 'wind-20';
                }
                //https://leafletjs.com/reference-1.7.1.html#divicon
                let windIcon = L.divIcon({
                    html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`,
                });
                //https://leafletjs.com/reference-1.7.1.html#marker
                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(overlays.winddirection);
            }
            /* switch Versuch 
            let temperatureHighlightClass = '';
            switch (station.properties.LT) {
                case (station.properties.LT < 0):
                    temperatureHighlightClass = 'temperature-0';
                    break;
                case (station.properties.LT >= 0): 
                    temperatureHighlightClass = 'temperature+=0';
                    break;
                }
                let temperatureIcon = L.divIcon({
                    html: `<div class="temperature-label ${temperatureHighligtClass}">${station.properties.LT}</div>`,
                })
                let temperatureMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ],  {
                    icon:temperatureIcon
                });
                temperatureMarker.addTo(temperatureLayer);
                }
            }

            if (typeof station.properties.LT == "number") {
                let tempatureHighlightClass = '';

                if (station.properties.LT > 0) {
                    tempatureHighlightClass = 'temp-pos';
                }
                if (station.properties.LT < 0) {
                    temperatureHighlightClass = 'temp-neg';
                }

                //https://leafletjs.com/reference-1.7.1.html#divicon
                let temperatureIcon = L.divIcon({
                    html: `<div class="temp-label ${temperatureHighlightClass}">${station.properties.LT}</div>`,
                });

                //https://leafletjs.com/reference-1.7.1.html#marker
                let temperatureMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: temperatureIcon
                });

                temperatureMarker.addTo(temperatureLayer);
            } else if (station.properties.LT == 0) {
                //https://leafletjs.com/reference-1.7.1.html#divicon
                let temperatureIcon = L.divIcon({
                    html: `<div class="temp-label ${temperatureHighlightClass}">${station.properties.LT}</div>`,
                });

                //https://leafletjs.com/reference-1.7.1.html#marker
                let temperatureMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: temperatureIcon
                });

                temperatureMarker.addTo(overlays.temperature);
            };*/

            
            //if Abfrage Temperatur in Kurs
            if (typeof station.properties.LT == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.LT
                });
                marker.addTo(overlays.temperature);
            }

        }
        // set map view to all stations
        map.fitBounds(overlays.stations.getBounds());
    });

   
    //newLabel(.....).addTo(overlays.)