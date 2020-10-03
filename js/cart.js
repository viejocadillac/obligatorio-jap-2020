/* global getJSONData CART_INFO_URL renderIn */

/**
 * Funcion que retorna un array con los subtotales de cada item del carrito
 * @param { HTMLElement } cartElement Contenedor donde se renderiza cada elemento del carrito
 * @returns {[Number]} Array de subtotales
 */
const getAllSubtotals = (cartElement) => {
  const itemsCollection = cartElement.getElementsByTagName('tr');

  // Se convierte la coleccion a array para tener disponible el metodo map.
  const items = Array.from(itemsCollection);

  // Se extrae del dataset la propiedad subtotal,
  // generando un array con todos los subtotales.
  const subtotals = items.map((tr) => (
    { currency: tr.dataset.currency, cost: parseInt(tr.dataset.subtotal, 10) }));
  return subtotals;
};

// Valor de cada moneda con respecto al peso en este caso.
const CURRENCIES = {
  UYU: 1,
  USD: 40,
};

const convertToPeso = (value) => value.cost * CURRENCIES[value.currency];

/**
 * Calcula la suma de todos los productos en el array pasado
 */
const calculateSubtotal = (subtotals) => subtotals.reduce((acc, value) => acc + value, 0);

/**
 * Funcion que calcula el precio de envio
 * TODO Agregar la logica del calculo dependiendo de la opcion seleccionada.
 * @returns {number} Precio de envio
 */
const getDeliveryCost = (subtotal) => {
  const selectEnvio = document.getElementById('select-envio');
  const percentDelivery = parseFloat(selectEnvio.value);
  return Math.round(percentDelivery * subtotal);
};


const getFormatedCost = (prefix, number) => {
  const numberFormater = new Intl.NumberFormat('es-UY');
  return `${prefix} ${numberFormater.format(number)}`;
};

/**
 * Convierte el valor pasado en pesos a la moneda indicada
 * @param {number} value Valor a convertir
 * @param {string} currency Moneda a la cual se quiere convertir
 */
const convertPesoTo = (value, currency) => value / CURRENCIES[currency];

const updateTotal = () => {
  const cartElement = document.getElementById('items-container');
  const subtotals = getAllSubtotals(cartElement);

  const subtotalsInPesos = subtotals.map(convertToPeso);
  const subtotalInPesos = calculateSubtotal(subtotalsInPesos);

  const selectedCurrency = document.getElementById('select-currency').value;

  const subtotalConverted = convertPesoTo(subtotalInPesos, selectedCurrency);

  const deliveryCost = getDeliveryCost(subtotalConverted);
  const totalCost = subtotalConverted + deliveryCost;

  document.getElementById('subtotal').innerHTML = getFormatedCost(selectedCurrency, subtotalConverted);
  document.getElementById('envio').innerHTML = getFormatedCost(selectedCurrency, deliveryCost);
  document.getElementById('total').innerHTML = getFormatedCost(selectedCurrency, totalCost);
};

// eslint-disable-next-line no-unused-vars
const onCountChange = (e) => {
  const { currency, unitcost } = e.dataset;
  const unitCostInt = parseInt(unitcost, 10);

  const newProductCount = e.querySelector('td input').value;
  const subtotalElement = e.querySelector('td[name="subtotal"]');

  const subtotal = unitCostInt * newProductCount;

  subtotalElement.innerHTML = getFormatedCost(currency, subtotal);
  e.setAttribute('data-subtotal', unitCostInt * newProductCount);
  updateTotal();
};

const generateCartItemHTML = (product) => {
  const subtotal = product.count * product.unitCost;
  return `
    <tr
        class="cart-item"
        oninput="onCountChange(this)"
        data-currency=${product.currency}
        data-unitcost=${product.unitCost}
        data-subtotal=${subtotal}
      >
      <td class="cart-item__celda">
          <img class="cart-item__img" src="${product.src}"></img>
      </td>
      <td class="cart-item__celda cart-item__name">${product.name}</td>
      <td class="cart-item__celda" name="unit-cost">${getFormatedCost(product.currency, product.unitCost)}</td>
      <td class="cart-item__celda">
          <input type="number" class="cart-item__count" value="${product.count}" min=1>
      </td>
      <td name="subtotal" class="cart-item__celda cart-stats__number">
      ${getFormatedCost(product.currency, subtotal)}
      </td>
    </tr>
  `;
};

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CART_INFO_URL, false).then(({ data }) => {
    const itemsContainer = document.getElementById('items-container');

    data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
    // data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
    // data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
    // data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));

    updateTotal();
  });

  // Seleccion del metodo de envio
  const selectEnvio = document.getElementById('select-envio');
  selectEnvio.addEventListener('change', () => {
    updateTotal();
  });

  // Se completan las monedas en el select
  const selectCurrency = document.getElementById('select-currency');
  Object.keys(CURRENCIES).forEach((currency) => {
    selectCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
  });

  selectCurrency.addEventListener('change', () => {
    updateTotal();
  });

  selectEnvio.addEventListener('change', () => {
    updateTotal();
  });

  const toggleFooter = document.getElementById('btn-toggle-checkout');
  let footerIsShown = false;
  toggleFooter.addEventListener('click', () => {
    const icon = document.querySelector('.icon-toggle-footer');
    const cartFooter = document.querySelector('.cart__footer');
    if (footerIsShown) {
      icon.style.transform = 'rotate(0deg)';
      cartFooter.style.maxHeight = '3rem';
    } else {
      icon.style.transform = 'rotate(180deg)';
      cartFooter.style.maxHeight = '999px';
    }
    footerIsShown = !footerIsShown;
  });
});
