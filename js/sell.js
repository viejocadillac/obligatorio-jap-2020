/* global PUBLISH_PRODUCT_URL, getJSONData, Dropzone */

let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = '$';
const DOLLAR_CURRENCY = 'Dólares (USD)';
const PESO_CURRENCY = 'Pesos Uruguayos (UYU)';
const DOLLAR_SYMBOL = 'USD ';
const PESO_SYMBOL = 'UYU ';
const PERCENTAGE_SYMBOL = '%';
const SUCCESS_MSG = '¡Se ha realizado la publicación con éxito! :)';
const ERROR_MSG = 'Ha habido un error :(, verifica qué pasó.';

// Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts() {
  const unitProductCostHTML = document.getElementById('productCostText');
  const comissionCostHTML = document.getElementById('comissionText');
  const totalCostHTML = document.getElementById('totalCostText');

  const unitCostToShow = MONEY_SYMBOL + productCost;
  const comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;

  const totalCost = Math.round(productCost * comissionPercentage * 100) / 100;
  const totalCostToShow = MONEY_SYMBOL + totalCost;

  unitProductCostHTML.innerHTML = unitCostToShow;
  comissionCostHTML.innerHTML = comissionToShow;
  totalCostHTML.innerHTML = totalCostToShow;
}

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      /* Usuario no logueado, mostrar mensaje de esto y boton de ir al login o a crear cuenta */
      const main = document.getElementById('main');
      main.classList.add('main-no-user');
      main.innerHTML = `
        <img src="${HOME}/img/login.svg" height="200">
        <h1 class="main-no-user__title">Inicia sesión para ver esto</h1>
        <a href="${LOGIN}" class="btn btn-primary btn-iniciar-sesion" >Ir a iniciar sesión</a>
        <p class="main-no-user__footer">¿No tenés cuenta? <a href="${REGISTER}">Registrate</a></p>
      `;
      hideSpinner();
    }
  }, () => {
    // TODO Manejar errores
  });
  document.getElementById('productCountInput').addEventListener('change', () => {
    productCount = this.value;
    updateTotalCosts();
  });

  document.getElementById('productCostInput').addEventListener('change', () => {
    productCost = this.value;
    updateTotalCosts();
  });

  document.getElementById('goldradio').addEventListener('change', () => {
    comissionPercentage = 0.13;
    updateTotalCosts();
  });

  document.getElementById('premiumradio').addEventListener('change', () => {
    comissionPercentage = 0.07;
    updateTotalCosts();
  });

  document.getElementById('standardradio').addEventListener('change', () => {
    comissionPercentage = 0.03;
    updateTotalCosts();
  });

  document.getElementById('productCurrency').addEventListener('change', () => {
    if (this.value === DOLLAR_CURRENCY) {
      MONEY_SYMBOL = DOLLAR_SYMBOL;
    } else if (this.value === PESO_CURRENCY) {
      MONEY_SYMBOL = PESO_SYMBOL;
    }

    updateTotalCosts();
  });

  // Configuraciones para el elemento que sube archivos
  const dzoptions = {
    url: '/',
    autoQueue: false,
  };
  const myDropzone = new Dropzone('div#file-upload', dzoptions);

  // Se obtiene el formulario de publicación de producto
  const sellForm = document.getElementById('sell-info');

  // Se agrega una escucha en el evento 'submit' que será
  // lanzado por el formulario cuando se seleccione 'Vender'.
  sellForm.addEventListener('submit', (e) => {
    const productNameInput = document.getElementById('productName');
    const productCategory = document.getElementById('productCategory');
    const productCost = document.getElementById('productCostInput');
    let infoMissing = false;

    // Quito las clases que marcan como inválidos
    productNameInput.classList.remove('is-invalid');
    productCategory.classList.remove('is-invalid');
    productCost.classList.remove('is-invalid');

    // Se realizan los controles necesarios,
    // En este caso se controla que se haya ingresado el nombre y categoría.
    // Consulto por el nombre del producto
    if (productNameInput.value === '') {
      productNameInput.classList.add('is-invalid');
      infoMissing = true;
    }

    // Consulto por la categoría del producto
    if (productCategory.value === '') {
      productCategory.classList.add('is-invalid');
      infoMissing = true;
    }

    // Consulto por el costo
    if (productCost.value <= 0) {
      productCost.classList.add('is-invalid');
      infoMissing = true;
    }

    if (!infoMissing) {
      // Aquí ingresa si pasó los controles, irá a enviar
      // la solicitud para crear la publicación.

      getJSONData(PUBLISH_PRODUCT_URL).then((resultObj) => {
        const msgToShowHTML = document.getElementById('resultSpan');
        let msgToShow = '';

        // Si la publicación fue exitosa, devolverá mensaje de éxito,
        // de lo contrario, devolverá mensaje de error.
        if (resultObj.status === 'ok') {
          msgToShow = resultObj.data.msg;
          document.getElementById('alertResult').classList.add('alert-success');
        } else if (resultObj.status === 'error') {
          msgToShow = ERROR_MSG;
          document.getElementById('alertResult').classList.add('alert-danger');
        }

        msgToShowHTML.innerHTML = msgToShow;
        document.getElementById('alertResult').classList.add('show');
      });
    }

    // Esto se debe realizar para prevenir que el formulario se envíe
    // (comportamiento por defecto del navegador)
    if (e.preventDefault) e.preventDefault();
    return false;
  });
});
