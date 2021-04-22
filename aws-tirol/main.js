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

let getColor = (value, colorRamp) => {
    //console.log("Wert:", value, "Palette:", colorRamp);
    for (let rule of colorRamp) {
        if (value >= rule.min && value < rule.max) {
            return rule.col;
        }
    }
    return "black";
};

let newLabel = (coords, options) => {
    let color = getColor(options.value, options.colors);
    //console.log("Wert", options.value, "bekommt Farbe", color);
    let label = L.divIcon({
        html: `<div style="background-color:${color}">${options.value}</div>`,
        className: "text-label"
    })
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]}m)`
    });
    return marker;
};
    //Label erstellen
    //den Label zurückgeben


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
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.HS.toFixed(0),
                    colors: COLORS.snowheight,
                    station: station.properties.name
                });
                marker.addTo(overlays.snowheight);
            } 
            
            if (typeof station.properties.WG == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.WG.toFixed(0),
                    colors: COLORS.windspeed,
                    station: station.properties.name
                });
                marker.addTo(overlays.windspeed);
            }

            if (typeof station.properties.LT == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.LT.toFixed(1),
                    colors: COLORS.temperature,
                    station: station.properties.name
                });
                marker.addTo(overlays.temperature);
            }

        }
        // set map view to all stations
        map.fitBounds(overlays.stations.getBounds());
    });



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
   
    //newLabel(.....).addTo(overlays.)