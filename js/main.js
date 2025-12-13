// Almacenar datos de países (completo, fusionado con slangs)
window.englishSpeakingCountries = [
  {
    name: "United States",
    capital: "Washington D.C.",
    coordinates: { lat: 37.0902, lng: -95.7129 },
    info: "English is the de facto national language, with about 80% of the population speaking it at home.",
    fact: "The United States doesn't have an official language at the federal level.",
    population: "331M",
    speakers: "79%",
    flag: "🇺🇸",
    color: 0xff3366,
    slang: ["What's up!", "You're awesome!", "My bad"]
  },
  {
    name: "United Kingdom",
    capital: "London",
    coordinates: { lat: 55.3781, lng: -3.4360 },
    info: "English originated in England and spread around the world through British colonization.",
    fact: "The UK has the highest number of English speakers in Europe.",
    population: "67M",
    speakers: "98%",
    flag: "🇬🇧",
    color: 0x3366ff,
    slang: ["Brilliant!", "Cheers", "Mate"]
  },
  {
    name: "Canada",
    capital: "Ottawa",
    coordinates: { lat: 56.1304, lng: -106.3468 },
    info: "English is one of Canada's two official languages, with about 56% of the population speaking it as their first language.",
    fact: "Canadian English has influences from both British and American English.",
    population: "38M",
    speakers: "86%",
    flag: "🇨🇦",
    color: 0xff3333,
    slang: ["Eh?", "Loonie", "Toque"]
  },
  {
    name: "Australia",
    capital: "Canberra",
    coordinates: { lat: -25.2744, lng: 133.7751 },
    info: "English is the main language spoken in Australia, with a distinctive accent and vocabulary.",
    fact: "Australian English has unique abbreviations like 'arvo' for afternoon and 'barbie' for barbecue.",
    population: "25M",
    speakers: "97%",
    flag: "🇦🇺",
    color: 0x003366,
    slang: ["G'day!", "No worries", "Arvo"]
  },
  {
    name: "India",
    capital: "New Delhi",
    coordinates: { lat: 20.5937, lng: 78.9629 },
    info: "English is an official language in India used in government, business, and education.",
    fact: "India has the second-largest English-speaking population in the world after the United States.",
    population: "1.38B",
    speakers: "12%",
    flag: "🇮🇳",
    color: 0xff9933,
    slang: ["Prepone", "Timepass", "Yaar"]
  },
  {
    name: "South Africa",
    capital: "Pretoria, Cape Town, Bloemfontein",
    coordinates: { lat: -30.5595, lng: 22.9375 },
    info: "English is one of 11 official languages and is commonly used in public and commercial life.",
    fact: "South African English incorporates words from Afrikaans and indigenous languages.",
    population: "60M",
    speakers: "31%",
    flag: "🇿🇦",
    color: 0x007749,
    slang: ["Howzit?", "Lekker", "Bra"]
  },
  {
    name: "Ireland",
    capital: "Dublin",
    coordinates: { lat: 53.1424, lng: -7.6921 },
    info: "English is the predominant language, though Irish (Gaelic) is also an official language.",
    fact: "Hiberno-English, the dialect spoken in Ireland, has been influenced by Irish grammar and syntax.",
    population: "5M",
    speakers: "99%",
    flag: "🇮🇪",
    color: 0x169b62,
    slang: ["Grand", "Craic", "Eejit"]
  },
  {
    name: "New Zealand",
    capital: "Wellington",
    coordinates: { lat: -40.9006, lng: 174.8860 },
    info: "English is the primary language, with a distinctive accent and Māori influences.",
    fact: "New Zealand English includes many Māori words like 'kiwi' and 'mana'.",
    population: "5M",
    speakers: "96%",
    flag: "🇳🇿",
    color: 0x000000,
    slang: ["Sweet as", "Chur", "Bro"]
  }
];

// Mostrar Mouseketools (slang típico)
function showMousetools(country) {
  const box = document.getElementById('mouseketools-box');
  const slangList = document.getElementById('slang-list');
  if (!country || !country.slang) {
    box.style.display = 'none';
    slangList.innerHTML = '';
    return;
  }
  box.style.display = 'block';
  box.querySelector('h4').textContent = `Mouseketools (${country.name})`;
  slangList.innerHTML = country.slang.map(s => `<li>${s}</li>`).join('');
}

// Ejemplo de integración: mostrar Mouseketools al seleccionar país
// Llama showMousetools(country) cuando el usuario selecciona un país
// Por ejemplo:
// showMousetools(window.englishSpeakingCountries[0]);

// Escena
const scene = new THREE.Scene();

// Cámara
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 3);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimización
document.getElementById("container").appendChild(renderer.domElement);

// Controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = false;
controls.rotateSpeed = 0.8;
controls.minDistance = 1.8;
controls.maxDistance = 5;

// Luz ambiental
scene.add(new THREE.AmbientLight(0x444444, 0.6));

// Luz direccional principal
const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(5, 3, 5);
scene.add(mainLight);

// Luz desde atrás para resaltar contornos
const backLight = new THREE.DirectionalLight(0x223366, 0.4);
backLight.position.set(-5, -3, -5);
scene.add(backLight);

// Mostrar mensaje de carga
const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = `
  <div class="loading-content">
    <div class="loading-spinner"></div>
    <p>Loading Earth texture...</p>
  </div>
`;
document.body.appendChild(loadingOverlay);

// Textura de la Tierra con manejo de errores
const textureLoader = new THREE.TextureLoader();
let earthTexture;

try {
  earthTexture = textureLoader.load(
    "assets/textures/earth_daymap.jpg",
    function () {
      // Ocultar carga cuando la textura esté lista
      gsap.to(loadingOverlay, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loadingOverlay.style.display = 'none';
        }
      });
    },
    undefined,
    function (error) {
      console.error("Error loading texture:", error);
      loadingOverlay.querySelector('p').textContent = "Texture not available. Using fallback.";
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 2000);
    }
  );
} catch (error) {
  console.error("Texture loading failed:", error);
  loadingOverlay.style.display = 'none';
}

// Esfera (planeta)
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshPhongMaterial({
  map: earthTexture,
  specular: new THREE.Color(0x333333),
  shininess: 10
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Almacenar datos de países (completo, fusionado con slangs)
window.englishSpeakingCountries = [
  {
    name: "United States",
    capital: "Washington D.C.",
    coordinates: { lat: 37.0902, lng: -95.7129 },
    info: "English is the de facto national language, with about 80% of the population speaking it at home.",
    fact: "The United States doesn't have an official language at the federal level.",
    population: "331M",
    speakers: "79%",
    flag: "🇺🇸",
    color: 0xff3366,
    slang: ["What's up!", "You're awesome!", "My bad"]
  },
  {
    name: "United Kingdom",
    capital: "London",
    coordinates: { lat: 55.3781, lng: -3.4360 },
    info: "English originated in England and spread around the world through British colonization.",
    fact: "The UK has the highest number of English speakers in Europe.",
    population: "67M",
    speakers: "98%",
    flag: "🇬🇧",
    color: 0x3366ff,
    slang: ["Brilliant!", "Cheers", "Mate"]
  },
  {
    name: "Canada",
    capital: "Ottawa",
    coordinates: { lat: 56.1304, lng: -106.3468 },
    info: "English is one of Canada's two official languages, with about 56% of the population speaking it as their first language.",
    fact: "Canadian English has influences from both British and American English.",
    population: "38M",
    speakers: "86%",
    flag: "🇨🇦",
    color: 0xff3333,
    slang: ["Eh?", "Loonie", "Toque"]
  },
  {
    name: "Australia",
    capital: "Canberra",
    coordinates: { lat: -25.2744, lng: 133.7751 },
    info: "English is the main language spoken in Australia, with a distinctive accent and vocabulary.",
    fact: "Australian English has unique abbreviations like 'arvo' for afternoon and 'barbie' for barbecue.",
    population: "25M",
    speakers: "97%",
    flag: "🇦🇺",
    color: 0x003366,
    slang: ["G'day!", "No worries", "Arvo"]
  },
  {
    name: "India",
    capital: "New Delhi",
    coordinates: { lat: 20.5937, lng: 78.9629 },
    info: "English is an official language in India used in government, business, and education.",
    fact: "India has the second-largest English-speaking population in the world after the United States.",
    population: "1.38B",
    speakers: "12%",
    flag: "🇮🇳",
    color: 0xff9933,
    slang: ["Prepone", "Timepass", "Yaar"]
  },
  {
    name: "South Africa",
    capital: "Pretoria, Cape Town, Bloemfontein",
    coordinates: { lat: -30.5595, lng: 22.9375 },
    info: "English is one of 11 official languages and is commonly used in public and commercial life.",
    fact: "South African English incorporates words from Afrikaans and indigenous languages.",
    population: "60M",
    speakers: "31%",
    flag: "🇿🇦",
    color: 0x007749,
    slang: ["Howzit?", "Lekker", "Bra"]
  },
  {
    name: "Ireland",
    capital: "Dublin",
    coordinates: { lat: 53.1424, lng: -7.6921 },
    info: "English is the predominant language, though Irish (Gaelic) is also an official language.",
    fact: "Hiberno-English, the dialect spoken in Ireland, has been influenced by Irish grammar and syntax.",
    population: "5M",
    speakers: "99%",
    flag: "🇮🇪",
    color: 0x169b62,
    slang: ["Grand", "Craic", "Eejit"]
  },
  {
    name: "New Zealand",
    capital: "Wellington",
    coordinates: { lat: -40.9006, lng: 174.8860 },
    info: "English is the primary language, with a distinctive accent and Māori influences.",
    fact: "New Zealand English includes many Māori words like 'kiwi' and 'mana'.",
    population: "5M",
    speakers: "96%",
    flag: "🇳🇿",
    color: 0x000000,
    slang: ["Sweet as", "Chur", "Bro"]
  }
];

// Crear elementos de lista de países
const countriesContainer = document.getElementById('countries-container');
englishSpeakingCountries.forEach(country => {
  const chip = document.createElement('div');
  chip.className = 'country-chip';
  chip.textContent = country.name;
  chip.addEventListener('click', () => {
    highlightCountry(country);
    // Resaltar también en la lista
    document.querySelectorAll('.country-chip').forEach(c => c.classList.remove('highlighted'));
    chip.classList.add('highlighted');
    showMousetools(country);
  });
  countriesContainer.appendChild(chip);
});

// Convertir coordenadas lat/lng a posición 3D
function latLongToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Crear marcadores para cada país
const countryMarkers = [];
englishSpeakingCountries.forEach(country => {
  const { lat, lng } = country.coordinates;
  const position = latLongToVector3(lat, lng, 1.02);

  // Crear esfera para el marcador
  const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: country.color,
    emissive: country.color,
    emissiveIntensity: 0.5
  });

  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.copy(position);
  marker.userData = country;
  marker.visible = true;

  // Añadir el marcador como hijo de la Tierra
  earth.add(marker);
  countryMarkers.push(marker);

  // Crear anillo alrededor del marcador
  const ringGeometry = new THREE.RingGeometry(0.04, 0.05, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: country.color,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.copy(position);
  ring.userData = country;
  ring.visible = true;

  // Añadir el anillo como hijo de la Tierra
  earth.add(ring);
  countryMarkers.push(ring);
});

// Raycaster para detectar hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredCountry = null;
let lastDetectionTime = 0;
const DETECTION_THROTTLE_MS = 50;

// Función throttle para mejorar rendimiento
function throttle(callback, delay) {
  let timeout;
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        lastCall = now;
        callback(...args);
      }, delay - (now - lastCall));
      return;
    }
    lastCall = now;
    callback(...args);
  };
}

// Manejar movimiento del mouse (optimizado)
function onMouseMove(event) {
  const now = Date.now();
  if (now - lastDetectionTime < DETECTION_THROTTLE_MS) return;
  lastDetectionTime = now;

  // Calcular posición normalizada del mouse
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Actualizar el raycaster
  raycaster.setFromCamera(mouse, camera);

  // Calcular objetos intersectados (solo marcadores para mejor rendimiento)
  const intersects = raycaster.intersectObjects(countryMarkers);

  if (intersects.length > 0) {
    const detectedCountry = intersects[0].object.userData;

    if (detectedCountry && detectedCountry !== hoveredCountry) {
      hoveredCountry = detectedCountry;
      highlightCountry(detectedCountry);
    }
  } else if (hoveredCountry) {
    hoveredCountry = null;
    resetCountryHighlights();
    hideCountryInfo();
  }
}

// Aplicar throttle al event listener
window.addEventListener('mousemove', throttle(onMouseMove, DETECTION_THROTTLE_MS));

// Resaltar un país específico
function highlightCountry(country) {
  resetCountryHighlights();

  // Encontrar y resaltar los marcadores de este país
  countryMarkers.forEach(marker => {
    if (marker.userData.name === country.name) {
      // Animación de resaltado
      gsap.to(marker.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.3,
        ease: "power2.out"
      });

      if (marker.material.emissive) {
        gsap.to(marker.material, {
          emissiveIntensity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  });

  showCountryInfo(country);
  showMousetools(country);
}

// Restablecer todos los resaltados de países
function resetCountryHighlights() {
  countryMarkers.forEach(marker => {
    gsap.to(marker.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    if (marker.material.emissive) {
      gsap.to(marker.material, {
        emissiveIntensity: 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  // Quitar resaltado de la lista de países
  document.querySelectorAll('.country-chip').forEach(chip => {
    chip.classList.remove('highlighted');
  });
}

// Mostrar información del país
function showCountryInfo(country) {
  const infoPanel = document.getElementById('info-panel');
  const countryName = document.getElementById('country-name');
  const countryInfo = document.getElementById('country-info');
  const population = document.getElementById('population');
  const speakers = document.getElementById('speakers');
  const countryFlag = document.getElementById('country-flag');

  countryName.textContent = country.name;
  countryInfo.innerHTML = `
    <div class="country-detail">
      <p>${country.info}</p>
      <p><strong>Fun Fact:</strong> ${country.fact}</p>
    </div>
  `;
  population.textContent = country.population;
  speakers.textContent = country.speakers;
  countryFlag.textContent = country.flag;

  // Cambiar color del borde según el país
  document.querySelectorAll('.country-detail').forEach(el => {
    el.style.borderLeftColor = `#${country.color.toString(16).padStart(6, '0')}`;
  });

  infoPanel.classList.add('visible');
}

// Ocultar información del país
function hideCountryInfo() {
  const infoPanel = document.getElementById('info-panel');
  infoPanel.classList.remove('visible');
  showMousetools(null); // Oculta Mouseketools
}

// Event listeners
window.addEventListener('resize', onWindowResize);
document.getElementById('close-btn').addEventListener('click', hideCountryInfo);

// Manejar redimensionado de ventana
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Rotación suave de la Tierra
  earth.rotation.y += 0.001;

  controls.update();
  renderer.render(scene, camera);
}


// Iniciar animación
animate();

