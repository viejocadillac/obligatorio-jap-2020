/* global getJSONData CART_INFO_URL renderIn */

/**
 * Funcion que retorna un array con los subtotales de cada item del carrito
 * @param { HTMLElement } cartElement Contenedor donde se renderiza cada elemento del carrito
 * @returns {[Object]} Array de subtotales
 */
const getAllSubtotals = (cartElement) => {
  const itemsCollection = cartElement.getElementsByTagName('tr');

  // Se convierte la coleccion a array para tener disponible el metodo map.
  const items = Array.from(itemsCollection);

  // Se extrae del dataset la propiedad subtotal,
  // generando un array con todos los subtotales.
  const subtotals = items.map((tr) => ({
    currency: tr.dataset.currency,
    cost: parseInt(tr.dataset.subtotal, 10),
  }));
  return subtotals;
};

// Valor de cada moneda con respecto al peso en este caso.
const CURRENCIES = {
  UYU: 1,
  USD: 40,
};

const convertToPeso = (value) => value.cost * CURRENCIES[value.currency];

const sumAllValues = (subtotals) => subtotals.reduce((acc, value) => acc + value, 0);

/**
 * Funcion que calcula el precio de envio
 * @param {number} subtotal Subtotal sobre el que se calcula el precio de envio
 * @returns {number} Precio de envio
 */
const getDeliveryCost = (subtotal) => {
  const selectEnvio = document.querySelector('input[name="envio"]:checked');
  const percentDelivery = parseFloat(selectEnvio.value);
  return Math.round(percentDelivery * subtotal);
};

/**
 * @param {number} number Cantidad a formatear
 * @returns {string} Cadena formateada
 */
const getFormatedNumberWithLocale = (number) => {
  // TODO Detectar Locale
  const numberFormater = new Intl.NumberFormat('es-UY');
  return numberFormater.format(number);
};

const getSelectedCurrency = () => document.getElementsByName('porcentajeEnvio')[1].value;

/**
 * Convierte el valor pasado en pesos a la moneda seleccionada
 * La moneda indicada debe ser parte del array CURRENCIES.
 * @param {number} value Valor a convertir
 */
const convertPesoToSelectedCurrency = (value) => {
  const selectedCurrency = getSelectedCurrency();
  return value / CURRENCIES[selectedCurrency];
};

const formatMoney = (ammount, currency = getSelectedCurrency()) => {
  return `${currency} ${getFormatedNumberWithLocale(ammount)}`;
};

const updateDeliveryCost = (subtotal) => {
  const contenedores = document.getElementsByName('delivery-cost');
  Array.from(contenedores).forEach((contenedor) => {
    const percentDelivery = parseFloat(contenedor.dataset.percent);
    contenedor.innerHTML = formatMoney(subtotal * percentDelivery);
  });
};

const updateTotal = () => {
  const cartElement = document.getElementById('items-container');
  const subtotals = getAllSubtotals(cartElement);

  const subtotalsInPesos = subtotals.map(convertToPeso);
  const subtotalInPesos = sumAllValues(subtotalsInPesos);

  const subtotal = convertPesoToSelectedCurrency(subtotalInPesos);
  const deliveryCost = getDeliveryCost(subtotal);
  const totalCost = subtotal + deliveryCost;

  document.getElementsByName('subtotal-cart').forEach((sub) => {
    // eslint-disable-next-line no-param-reassign
    console.log(sub)
    console.log(subtotal)
    sub.innerHTML = formatMoney(subtotal);
  });
  document.getElementById('envio').innerHTML = formatMoney(deliveryCost);
  document.getElementById('total').innerHTML = formatMoney(totalCost);

  updateDeliveryCost(subtotal);
};

// eslint-disable-next-line no-unused-vars
const onCountChange = (cartItem) => {
  const { unitcost, currency } = cartItem.dataset;
  const unitCostInt = parseInt(unitcost, 10);

  const newProductCount = cartItem.querySelector('td input').value;
  const subtotalElement = cartItem.querySelector('td[name="subtotal"]');

  const subtotal = unitCostInt * newProductCount;

  subtotalElement.innerHTML = formatMoney(subtotal, currency);

  cartItem.setAttribute('data-subtotal', unitCostInt * newProductCount);
  updateTotal();
};

const generateCartItemHTML = ({
  currency,
  unitCost,
  name,
  count,
  src,
}) => {
  const subtotal = count * unitCost;
  return `
    <tr
        class="cart-item"
        oninput="onCountChange(this)"
        data-currency=${currency}
        data-unitcost=${unitCost}
        data-subtotal=${subtotal}
      >
      <td class="cart-item__celda cart-item__celda-img">
          <img src="${src}" class="cart-item__img"></img>
      </td>
      <td class="cart-item__name" >${name}</td>
      <td class="cart-item__cost" name="unit-cost" data-th="Precio">${formatMoney(unitCost, currency)}</td>
      <td class="cart-item__count" data-th="x">
          <input type="number" class="cart-item__count-input" value="${count}" min=1>
      </td>
      <td name="subtotal" class="cart-item__subtotal">
      ${formatMoney(subtotal, currency)}
      </td>
    </tr>
  `;
};

const generateCurrencyOptionHTML = (currency) => `<option value="${currency}">${currency}</option>`;

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CART_INFO_URL, false).then(({
    data,
  }) => {
    const itemsContainer = document.getElementById('items-container');
    data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
    updateTotal();
  });

  // Seleccion del metodo de envio
  document.getElementsByName('envio').forEach((element) => {
    element.addEventListener('change', () => {
      updateTotal();
    });
  });

  const selectsCurrency = document.getElementsByName('porcentajeEnvio');
  // Se completan las monedas en el select
  const currenciesHTML = Object.keys(CURRENCIES).map(generateCurrencyOptionHTML);
  selectsCurrency.forEach((select) => {
    select.addEventListener('change', (e) => {
      selectsCurrency.forEach((sel) => {
        // eslint-disable-next-line no-param-reassign
        sel.selectedIndex = e.target.selectedIndex;
      });
      updateTotal();
    });
    currenciesHTML.forEach(renderIn(select));
  });
});
