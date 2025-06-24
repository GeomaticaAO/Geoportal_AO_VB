document.addEventListener("DOMContentLoaded", function () {
    if (typeof L === "undefined") {
        console.error("Leaflet no se ha cargado correctamente.");
        return;
    }

    // 🗺️ Crear y configurar el mapa
    const map = L.map('map', {
        center: [19.344796609, -99.238588729],
        zoom: 13,
        minZoom: 10,
        maxZoom: 20,
        zoomControl: false,
        tap: false
    });

    // Hacer el mapa accesible desde otros scripts
    window.map = map;

    // 🌈 Estilo original: borde rojo, sin relleno
    window.estiloColoniasBase = {
        color: "red",
        weight: 3,
        opacity: 0.7,
        fillOpacity: 0
    };

    // Variables globales accesibles desde otras capas
    window.capaColonias = null;
    window.vistaInicialAplicada = false;
    window.coloniaSeleccionada = null;

    // 🌍 Capas base
    const satelital = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; OpenStreetMap contributors',
            minZoom: 10,
            maxZoom: 50
        }
    ).addTo(map);

    const street = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            minZoom: 10,
            maxZoom: 50
        }
    );

    L.control.layers({
        "Mapa Satelital": satelital,
        "Mapa Street": street
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // 🧼 Función para reiniciar vista y estilo de colonias
    window.resetearColonias = function () {
        if (capaColonias && capaColonias.eachLayer) {
            capaColonias.eachLayer(layer => {
                if (capaColonias.resetStyle) {
                    capaColonias.resetStyle(layer);
                }
                if (layer.setStyle) {
                    layer.setStyle(estiloColoniasBase);
                }
            });
            map.setView([19.344796609, -99.238588729], 13);
        } else {
            console.warn("⚠️ La capa de colonias no está disponible.");
        }
    };

    // 🏠 Botón tipo casita
    const reloadButton = L.control({ position: 'topright' });
    reloadButton.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = '<img src="img/icons/home-gray-icon.png" alt="Restablecer" style="width: 35px; cursor: pointer;">';
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.style.borderRadius = '4px';
        div.style.marginTop = '5px';
        div.title = "Restablecer vista de colonias";
        div.onclick = () => {
            console.log("🏡 Botón restablecer colonias clicado");
            resetearColonias();
        };
        return div;
    };
    reloadButton.addTo(map);

    // 🧱 Límite de la alcaldía
    function agregarLimiteAlcaldia() {
        fetch("archivos/vectores/limite_alcaldia.geojson")
            .then(response => response.ok ? response.json() : Promise.reject("Error al cargar limite_alcaldia"))
            .then(data => {
                L.geoJSON(data, {
                    style: {
                        color: "#BB1400",
                        weight: 2,
                        fillOpacity: 0
                    }
                }).addTo(map).bringToBack();
                console.log("Capa límite alcaldía cargada correctamente.");
            })
            .catch(error => console.error("Error al cargar limite_alcaldia:", error));
    }
    agregarLimiteAlcaldia();

    // 🖼️ Simbología en esquina inferior derecha
    const simboloControl = L.control({ position: 'bottomright' });
    simboloControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-control-symbol');
        div.innerHTML = '<img src="img/simbol/Simbologi.png" alt="Simbología" style="width: 150px;">';
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.style.borderRadius = '4px';
        div.style.border = '1px solid #ccc';
        return div;
    };
    simboloControl.addTo(map);

    console.log("🗺️ Mapa base cargado correctamente.");
});
