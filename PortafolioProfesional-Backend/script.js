
// Mila · mi portafolio

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ----- menu en celular ----
const navBoton = document.getElementById("nav-boton");
const navLista = document.getElementById("nav-lista");

navBoton.addEventListener("click", () => {
  const abierta = navLista.classList.toggle("abierta");
  navBoton.setAttribute("aria-expanded", abierta);
});

navLista.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    navLista.classList.remove("abierta");
    navBoton.setAttribute("aria-expanded", "false");
  });
});

// ----enlace activo según la sección visible -----
const enlaces = document.querySelectorAll(".nav-enlace");
const secciones = document.querySelectorAll("main section[id]");

const observadorSecciones = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      enlaces.forEach((enlace) => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === "#" + entrada.target.id);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

secciones.forEach((seccion) => observadorSecciones.observe(seccion));

// --- efecto de escritura en la terminal ----
const frases = [
  "portafolio en construcción",
  "preparando proyectos...",
  "escribiendo código...",
  "muy pronto"
];

const escritura = document.getElementById("escritura");
let frase = 0;
let letra = frases[0].length;
let borrando = true;

function escribir() {
  const texto = frases[frase];

  if (borrando) {
    letra--;
    if (letra === 0) {
      borrando = false;
      frase = (frase + 1) % frases.length;
    }
  } else {
    letra++;
    if (letra === texto.length) {
      borrando = true;
      escritura.textContent = texto.slice(0, letra);
      setTimeout(escribir, 1800); // pausa con la frase completa
      return;
    }
  }

  escritura.textContent = frases[frase].slice(0, letra);
  setTimeout(escribir, borrando ? 40 : 85);
}

if (!reducirMovimiento) {
  setTimeout(escribir, 2500); // empieza mostrando "portafolio en construcción"
}

// ---- carrusel de proyectos -----
const carrusel = document.getElementById("carrusel");
const tarjetas = carrusel.querySelectorAll(".proyecto");
const puntos = document.getElementById("puntos");

tarjetas.forEach(() => puntos.appendChild(document.createElement("span")));

function anchoPaso() {
  const gap = parseFloat(getComputedStyle(carrusel).columnGap) || 0;
  return tarjetas[0].offsetWidth + gap;
}

function actualizarPuntos() {
  const indice = Math.round(carrusel.scrollLeft / anchoPaso());
  puntos.querySelectorAll("span").forEach((punto, i) => {
    punto.classList.toggle("activo", i === indice);
  });
}

function mover(direccion) {
  const final = carrusel.scrollWidth - carrusel.clientWidth;
  if (direccion > 0 && carrusel.scrollLeft >= final - 5) {
    carrusel.scrollTo({ left: 0 });          // vuelve al inicio
  } else if (direccion < 0 && carrusel.scrollLeft <= 5) {
    carrusel.scrollTo({ left: final });      // va al final
  } else {
    carrusel.scrollBy({ left: direccion * anchoPaso() });
  }
}

document.getElementById("anterior").addEventListener("click", () => mover(-1));
document.getElementById("siguiente").addEventListener("click", () => mover(1));
carrusel.addEventListener("scroll", actualizarPuntos, { passive: true });
carrusel.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") mover(1);
  if (e.key === "ArrowLeft") mover(-1);
});
actualizarPuntos();

const elementos = document.querySelectorAll(".seccion .contenedor");

if (!reducirMovimiento && "IntersectionObserver" in window) {
  elementos.forEach((el) => el.classList.add("revelar"));

  const observadorRevelar = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observadorRevelar.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach((el) => observadorRevelar.observe(el));
}

// ---- año actual en el pie de pagina ----
document.getElementById("anio").textContent = new Date().getFullYear();
