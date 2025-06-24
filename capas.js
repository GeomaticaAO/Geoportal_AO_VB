document.addEventListener("DOMContentLoaded", function () {
    if (typeof L === "undefined" || typeof map === "undefined") {
        console.error("Leaflet o el mapa no están definidos.");
        return;
    }

    if (!map.getPane('capasPuntosPane')) {
        map.createPane('capasPuntosPane');
        map.getPane('capasPuntosPane').style.zIndex = 650;
    }

    const capasPuntos = {};
    const controlCapasContainer = document.getElementById("controlCapasContainer");
    if (!controlCapasContainer) {
        console.error("No se encontró el contenedor #controlCapasContainer.");
        return;
    }

    const listaCapas = document.createElement("ul");
    listaCapas.className = "lista-capas";
    controlCapasContainer.appendChild(listaCapas);

    // Íconos: Centros de Desarrollo Comunitario
    const iconosCapas = {
        "Centros de Desarrollo Comunitario": L.icon({
            iconUrl: "img/icono/CDC.png",
            iconSize: [40, 40],
            iconAnchor: [30, 30],
            popupAnchor: [0, -32]
        })
    };

    const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHAUUwIZdDhl16SZRrr1B7ecSWWCoYFYEXorSWP12U_0FEwoefgkVzaslXDCn4ww/pub?output=csv";

    fetch(urlCSV)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: false,
                skipEmptyLines: true,
                complete: function (results) {
                    const data = results.data.slice(1);
                    const capa = L.layerGroup([], { pane: 'capasPuntosPane' });

                    data.forEach(columnas => {
                        const name = columnas[1]?.trim();
                        const tipo = columnas[2]?.trim();
                        const direc = columnas[3]?.trim();
                        const lat = parseFloat(columnas[4]);
                        const lng = parseFloat(columnas[5]);
                        let linkGoogle = columnas[6]?.trim();
                        const contacto = columnas[7]?.trim();
                        const actGratis = columnas[8]?.trim();
                        const actCosto = columnas[9]?.trim();
                        const observaciones = columnas[10]?.trim();
                        const linkFoto = columnas[11]?.trim();

                        if (!isNaN(lat) && !isNaN(lng)) {
                            let popup = `<b>${name}</b><br>`;
                            if (tipo) popup += `<b>Tipo:</b> ${tipo}<br>`;
                            if (direc) popup += `<b>Dirección:</b> ${direc}<br>`;

                            if (linkGoogle) {
                                const limpio = linkGoogle.replace(/^"+|"+$/g, "").trim();
                                const urlSegura = encodeURI(limpio);
                                popup += `<b>Ubicación:</b> <a href="${urlSegura}" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a><br>`;
                            }

                            if (contacto) popup += `<b>Contacto:</b> ${contacto}<br>`;
                            if (actGratis) popup += `<b>Actividades Gratuitas:</b> ${actGratis}<br>`;
                            if (actCosto) popup += `<b>Actividades con Costo:</b> ${actCosto}<br>`;
                            if (observaciones) popup += `<b>Observaciones:</b> ${observaciones}<br>`;
                            if (linkFoto) popup += `<b>Foto:</b> <a href="${linkFoto}" target="_blank">Ver imagen</a><br>`;

                            const marker = L.marker([lat, lng], {
                                icon: iconosCapas["Centros de Desarrollo Comunitario"],
                                pane: 'capasPuntosPane'
                            }).bindPopup(popup);

                            capa.addLayer(marker);

                            // 👉 Registro en el buscador unificado
                            if (typeof registrarElementoBuscable === "function") {
                                registrarElementoBuscable({
                                    nombre: name,
                                    capa: "Centros de Desarrollo Comunitario",
                                    marker: marker
                                });
                            }

                            
                        }
                    });

                    capasPuntos["Centros de Desarrollo Comunitario"] = capa;

                    const itemCapa = document.createElement("li");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = false;

                    checkbox.addEventListener("change", function () {
                        if (checkbox.checked) {
                            capa.addTo(map);
                        } else {
                            map.removeLayer(capa);
                        }
                    });

                    const iconoImg = document.createElement("img");
                    iconoImg.src = iconosCapas["Centros de Desarrollo Comunitario"].options.iconUrl;
                    iconoImg.width = 24;
                    iconoImg.height = 24;
                    iconoImg.style.marginRight = "8px";

                    const label = document.createElement("span");
                    label.textContent = "Centros de Desarrollo Comunitario";

                    itemCapa.appendChild(checkbox);
                    itemCapa.appendChild(iconoImg);
                    itemCapa.appendChild(label);
                    listaCapas.appendChild(itemCapa);
                }
            });
        });
// Capa: Módulos Deportivos
const urlCSVModulos = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB17wAqRP0vSPM2x68YQBluo4oaYYtMLydDev0yDpqV65Gsx5brSHRTs7aX9rixw/pub?output=csv";

const iconosEstado = {
    "Bueno": L.icon({
        iconUrl: "img/icono/modulo_verde.png",
        iconSize: [20, 30],
        iconAnchor: [25, 20],
        popupAnchor: [10, -20]
    }),
    "Regular": L.icon({
        iconUrl: "img/icono/modulo_amarillo.png",
        iconSize: [20, 30],
        iconAnchor: [25, 20],
        popupAnchor: [10, -20]
    }),
    "Malo": L.icon({
        iconUrl: "img/icono/modulo_rojo.png",
        iconSize: [20, 30],
        iconAnchor: [25, 20],
        popupAnchor: [10, -20]
    })
};

fetch(urlCSVModulos)
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: false,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data.slice(1);
                const capaModulos = L.layerGroup([], { pane: 'capasPuntosPane' });

                data.forEach(columnas => {
                    // DEPURACIÓN
                    console.log("====== Fila recibida ======");
                    console.log(columnas);
                    console.log("columnas.length:", columnas.length);

                    const nombre = columnas[1]?.trim();
                    const tipo = columnas[2]?.trim();
                    const direccion = columnas[3]?.trim();
                    const lat = parseFloat(columnas[4]);
                    const lng = parseFloat(columnas[5]);
                    const linkGoogle = columnas[6]?.trim();
                    const contacto = columnas[7]?.trim();
                    const actGratis = columnas[8]?.trim();
                    const actCosto = columnas[9]?.trim();
                    const talleres = columnas[10]?.trim();
                    const horarios = columnas[11]?.trim();
                    const edades = columnas[12]?.trim();
                    const observaciones = columnas[13]?.trim();
                    const linkFoto = columnas[14]?.trim();
                    const estado = columnas[15]?.trim();

                    // DEPURACIÓN
                    console.log("Nombre:", nombre);
                    console.log("Lat:", lat, "Lng:", lng, "Estado:", estado);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const icono = iconosEstado[estado] || iconosEstado["Regular"];

                        let popup = `<b>${nombre}</b><br>`;
                        if (tipo) popup += `<b>Tipo:</b> ${tipo}<br>`;
                        if (direccion) popup += `<b>Dirección:</b> ${direccion}<br>`;
                        if (linkGoogle) {
                            const limpio = linkGoogle.replace(/^"+|"+$/g, "").trim();
                            const urlSegura = encodeURI(limpio);
                            popup += `<b>Ubicación:</b> <a href="${urlSegura}" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a><br>`;
                        }
                        if (contacto) popup += `<b>Contacto:</b> ${contacto}<br>`;
                        if (actGratis) popup += `<b>Actividades Gratuitas:</b> ${actGratis}<br>`;
                        if (actCosto) popup += `<b>Actividades con Costo:</b> ${actCosto}<br>`;
                        if (talleres) popup += `<b>Talleres Eventuales:</b> ${talleres}<br>`;
                        if (horarios) popup += `<b>Días y Horarios:</b> ${horarios}<br>`;
                        if (edades) popup += `<b>Edades:</b> ${edades}<br>`;
                        if (observaciones) popup += `<b>Observaciones:</b> ${observaciones}<br>`;
                        if (linkFoto) popup += `<b>Foto:</b> <a href="${linkFoto}" target="_blank">Ver imagen</a><br>`;

                        const marker = L.marker([lat, lng], {
                            icon: icono,
                            pane: 'capasPuntosPane'
                        }).bindPopup(popup);

                        capaModulos.addLayer(marker);

                        registrarElementoBuscable({
                        nombre: nombre,
                        capa: "Módulos Deportivos",
                        marker: marker
                    });

                    }
                });

                capasPuntos["Módulos Deportivos"] = capaModulos;

                const itemCapa = document.createElement("li");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = false;

                checkbox.addEventListener("change", function () {
                    if (checkbox.checked) {
                        capaModulos.addTo(map);
                    } else {
                        map.removeLayer(capaModulos);
                    }
                });

                const iconoImg = document.createElement("img");
                iconoImg.src = "img/icono/modulos.png";
                iconoImg.width = 20;
                iconoImg.height = 27;
                iconoImg.style.marginRight = "8px";

                const label = document.createElement("span");
                label.textContent = "Módulos Deportivos";

                itemCapa.appendChild(checkbox);
                itemCapa.appendChild(iconoImg);
                itemCapa.appendChild(label);
                listaCapas.appendChild(itemCapa);
            }
        });
    })
    .catch(error => console.error("Error al cargar Módulos Deportivos:", error));
});
