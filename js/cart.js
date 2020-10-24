/* global getJSONData CART_INFO_URL renderIn, CART_BUY_URL, $ */

/*
  Valor de cada moneda con respecto al peso en este caso.
  Se utiliza para las conversiones de moneda cuando se cambia la
  opcion de en que moneda se quieren ver los costos
*/
const CURRENCIES = {
  UYU: 1,
  USD: 40,
};

const ACCEPTED_CREDIT_CARDS = new Set(['visa', 'mastercard']);

/**
 * @param {number} number Cantidad a formatear
 * @returns {string} Cadena formateada dependiendo del locale
 */
const formatNumberWithLocale = (number) => {
  const locale = navigator.languages[0];
  const numberFormater = new Intl.NumberFormat(locale);
  return numberFormater.format(number);
};

const getSelectedCurrency = () => document.getElementsByName('porcentajeEnvio')[1].value;
const formatMoney = (ammount, currency = getSelectedCurrency()) => `${currency} ${formatNumberWithLocale(ammount)}`;
const isAcceptedCreditCard = (name) => ACCEPTED_CREDIT_CARDS.has(name);

// TODO Validar dependiendo del tipo
const isValid = (input) => input.value.length > 0;

const toggleError = (e) => {
  const { target } = e;
  const errorMessage = target.dataset.error;
  if (isValid(target)) {
    target.nextElementSibling.innerHTML = '';
  } else {
    target.nextElementSibling.innerHTML = errorMessage;
  }
};

const capitalize = (string) => {
  const firstCapitalized = string.charAt(0).toUpperCase();
  return firstCapitalized + string.slice(1);
};

/* ----------------------- Generadores de HTML -----------------------*/

const generateAddressHTML = (address) => `
  <legend class="cart-stats__legend">Envío a:</legend>
  <b>${capitalize(address.calle)} ${address.numero}</b> <br>
  ${capitalize(address.ciudad)} / ${address.departamento} <br>
  ${address.observaciones ? `(${capitalize(address.observaciones)})` : ''}
  
  <hr>
`;

const generatePaymentConfirmationHTML = (payment) => `
  <div>
    <b>**** **** **** ${payment.numero.slice(-4)}</b> <br>
    ${isAcceptedCreditCard(payment.metodo) ? 'Tarjeta' : 'Cuenta bancaria'} 
  </div>
  <img src="img/${payment.metodo}.jpg" width="70px" alt="${payment.metodo}">
`;

const generateCartItemHTML = ({
  id,
  currency,
  unitCost,
  name,
  count,
  src,
}) => {
  const subtotal = count * unitCost;
  return `
    <tr
        id="${id}"
        class="cart-item"
        oninput="onCountChange(this)"
        data-currency=${currency}
        data-unitcost=${unitCost}
        data-subtotal=${subtotal}
      >
      <td class="table__cell table__cell-img">
          <img src="${src}" class="cart-item__img"></img>
      </td>
      <td class="table__cell--left" >
        <span class="cart-item__name">${name}</span>
      </td>
      <td class="cart-item__cost" name="unit-cost" data-th="Precio">${formatMoney(unitCost, currency)}</td>
      <td class="cart-item__count" data-th="x">
          <input type="number" class="cart-item__count-input" value="${count}" min=1>
      </td>
      <td name="subtotal" class="cart-item__subtotal">
      ${formatMoney(subtotal, currency)}
      </td>
      <td>
        <button class="cart-item__delete" type="button" onclick="deleteItemAndUpdate(this)" data-delete="${id}"><i class="far fa-trash-alt"></i></button>
      </td>
      
    </tr>
  `;
};

const generateCurrencyOptionHTML = (currency) => `<option value="${currency}">${currency}</option>`;

const getFormOfPaymentWithCardHTML = () => `
  <div class="form-row">
    <div class="form-group col-md-12">
      <label for="numero-tarjeta">Número de tarjeta</label>
      <input type="text" name="numero" id="numero-tarjeta" class="form-control form-control-sm with-error" data-error="Ingresá un número de tarjeta válido">
      <!-- Div donde se renderiza el mensaje de error -->
      <div></div>
    </div>

    <div class="form-group col-md-12">
      <label for="nombre-tarjeta">Nombre</label>
      <input type="text" name="titular" id="nombre-tarjeta" class="form-control form-control-sm with-error" data-error="Debés ingresar tu nombre">
      <!-- Div donde se renderiza el mensaje de error -->
      <div></div>
    </div>
  </div>                

  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="fecha-vencimiento">Vence en:</label>
      <input type="date" name="vencimiento" id="fecha-vencimiento" class="form-control form-control-sm with-error" data-error="Ingresá la fecha de vencimiento">
      <!-- Div donde se renderiza el mensaje de error -->
      <div></div>
    </div>

    <div class="form-group col-md-6">
      <label for="">Código de seguridad</label>
      <input type="number" name="ccv" id="codigo-seguridad" class="form-control form-control-sm with-error" data-error="Código de seguridad en el reverso">
      <!-- Div donde se renderiza el mensaje de error -->
      <div></div>
    </div>
  </div>
`;

const getFormOfPaymentWithTransactionHTML = () => `
  <div class="form-row">
    <div class="form-group col-md-12">
      <label for="numero-tarjeta">Número de cuenta</label>
      <input type="text" name="numero" id="numero-tarjeta" class="form-control form-control-sm with-error" data-error="Número de cuenta no válido">
      <!-- Div donde se renderiza el mensaje de error -->
      <div></div>
    </div>

    <div class="form-group col-md-12">
      <label for="nombre-tarjeta">Nombre</label>
      <input type="text" name="titular" id="nombre-tarjeta" class="form-control form-control-sm with-error" data-error="Ingresá el nombre del titular">
      <!-- Div donde se renderiza el mensaje de error -->
      <div></div>
    </div>
  </div>                
`;

/* Se inicializa la libreria del modal */
$('#modal-wizard').smartWizard({
  selected: 0,
  theme: 'dots',
  autoAdjustHeight: false,
  justified: true,
  transitionEffect: 'fade',
  showStepURLhash: false,
  enableFinishButton: true,
  lang: {
    next: 'Siguiente',
    previous: 'Anterior',
  },
});

const renderConfirmationData = (data) => {
  const confirmCard = document.getElementById('confirm-card');
  const confirmDireccion = document.getElementById('confirm-direccion');

  renderIn(confirmCard, true)(generatePaymentConfirmationHTML(data.metodoPago));
  renderIn(confirmDireccion, true)(generateAddressHTML(data.direccion));
};

const getPurchaseData = () => {
  const formDireccion = document.getElementById('form-step-0');
  const formMetodoEnvio = document.getElementById('form-step-1');
  const formMetodoPago = document.getElementById('form-step-2');

  const confirmationData = {
    direccion: Object.fromEntries(new FormData(formDireccion)),
    metodoEnvio: Object.fromEntries(new FormData(formMetodoEnvio)),
    metodoPago: Object.fromEntries(new FormData(formMetodoPago)),
  };
  return confirmationData;
};

const validateAll = (form) => {
  const inputs = form.getElementsByClassName('with-error');
  const arrayOfInputs = Array.from(inputs);

  arrayOfInputs.forEach((input) => toggleError({ target: input }));
  return arrayOfInputs.every((input) => isValid(input));
};

$('#modal-wizard').on('leaveStep', (e, anchorObject, currentStepIndex) => {
  /* Se verifica que estemos en el ultimo paso, justo antes de pasar al ultimo */
  if (currentStepIndex === 2) {
    /*
      Se obtienen los datos de todos los formularios del checkout y
      se los renderiza en el ultimo paso que es el de confirmacion
    */
    renderConfirmationData(getPurchaseData());
  }

  /*
    Se obtiene el formulario del paso actual y se verifica que todos los
    campos requeridos hayan sido ingresados y sean validos.
    Si son validos, continua al paso siguiente.
   */
  const form = document.getElementById(`form-step-${currentStepIndex}`);
  return form ? validateAll(form) : true;
});

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

const convertToPeso = (value) => value.cost * CURRENCIES[value.currency];

const sumAllValues = (subtotals) => subtotals.reduce((acc, value) => acc + value, 0);

/**
 * Funcion que calcula el precio de envio
 * @param {number} subtotal Subtotal sobre el que se calcula el precio de envio
 * @returns {number} Precio de envio redondeado
 */
const getDeliveryCost = (subtotal) => {
  const selectEnvio = document.querySelector('input[name="envio"]:checked');
  const percentDelivery = parseFloat(selectEnvio.value);
  return Math.round(percentDelivery * subtotal);
};

/**
 * Convierte el valor pasado en pesos a la moneda seleccionada
 * La moneda indicada debe ser parte del array CURRENCIES.
 * @param {number} value Valor a convertir
 * @returns {number} Valor convertido
 */
const convertPesoToSelectedCurrency = (value) => {
  const selectedCurrency = getSelectedCurrency();
  return value / CURRENCIES[selectedCurrency];
};

const updateDeliveryCost = (subtotal) => {
  const contenedores = document.getElementsByName('delivery-cost');
  Array.from(contenedores).forEach((contenedor) => {
    const percentDelivery = parseFloat(contenedor.dataset.percent);
    renderIn(contenedor, true)(formatMoney(subtotal * percentDelivery));
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
    sub.innerHTML = formatMoney(subtotal);
  });
  document.getElementById('envio').innerHTML = formatMoney(deliveryCost);
  document.getElementById('total').innerHTML = formatMoney(totalCost);

  updateDeliveryCost(subtotal);
};

// eslint-disable-next-line no-unused-vars
const deleteItemAndUpdate = (button) => {
  const idOfItemToDelete = button.dataset.delete;
  const itemToDelete = document.getElementById(idOfItemToDelete);
  itemToDelete.parentNode.removeChild(itemToDelete);

  // Se borra el boton
  button.parentNode.removeChild(button);
  updateTotal();
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

const addErrorHandlerToInputs = () => {
  const inputs = document.getElementsByClassName('with-error');
  Array.from(inputs).forEach((input) => {
    input.addEventListener('input', (e) => {
      toggleError(e);
    });
  });
};

const updateFormPayments = () => {
  const formContainer = document.getElementById('datos-de-pago');
  const paymentMethods = Array.from(document.getElementsByName('metodo'));
  const selectedMethod = paymentMethods.filter((method) => method.checked)[0];

  if (isAcceptedCreditCard(selectedMethod.value)) {
    // render form credit card
    renderIn(formContainer, true)(getFormOfPaymentWithCardHTML());
  } else {
    // render form transaction
    renderIn(formContainer, true)(getFormOfPaymentWithTransactionHTML());
  }
  addErrorHandlerToInputs();
};

const renderPurchaseMessage = ({ msg }, success) => {
  const messageContainer = document.getElementById('purchase-message');
  messageContainer.innerHTML = msg;
  if (success) {
    messageContainer.classList.add('purchase-message--success');
    messageContainer.classList.remove('purchase-message--fail');
  } else {
    messageContainer.classList.remove('purchase-message--success');
    messageContainer.classList.add('purchase-message--fail');
  }
};

const sendPurchaseData = (data) => {
  /*
    La informacion al servidor deberia de ser enviada por POST, pero
    el servidor al que se manda esta solicitud simulada no lo acepta,
    por lo que siemplemente se hace una solicitud GET para obtener el mensaje de confirmacion
  */
  console.log(data);
  return fetch(CART_BUY_URL).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    // eslint-disable-next-line no-throw-literal
    throw { msg: 'Error al realizar la compra' };
  });
};

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CART_INFO_URL, false).then(({
    data,
  }) => {
    const itemsContainer = document.getElementById('items-container');
    /*
      Se agrega una propiedad extra (id) a los datos que llegan del servidor
      para luego poder referenciarlo y eliminarlo
    */
    data.articles
      .map((article, i) => ({ id: `cart-item-${i}`, ...article }))
      .map(generateCartItemHTML)
      .forEach(renderIn(itemsContainer));

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

  const metodosDePagoContainer = document.getElementById('metodos-de-pago');
  metodosDePagoContainer.addEventListener('change', () => {
    updateFormPayments();
  });

  updateFormPayments();

  addErrorHandlerToInputs();

  /* Envio de los datos de compra */
  const buttonEnvio = document.getElementById('button-envio');
  buttonEnvio.addEventListener('click', () => {
    // TODO Mostrar spinner de carga
    sendPurchaseData(getPurchaseData()).then((response) => {
      renderPurchaseMessage(response, true);
    }).catch((err) => {
      renderPurchaseMessage(err, false);
    });
  });
});
