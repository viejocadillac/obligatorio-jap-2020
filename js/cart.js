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

  // Se extrae del dataset de cada tr que tenga como atributo name=subtotal, la propiedad subtotal,
  // generando un array con todos los subtotales.
  const subtotals = items.map((tr) => tr.querySelector("[name='subtotal']").dataset.subtotal);
  return subtotals;
};

const calculateSubtotal = (subtotals) => {
  const sum = (acc, value) => acc + parseInt(value, 10);
  return subtotals.reduce(sum, 0);
};

/**
 * Funcion que calcula el precio de envio
 * TODO Agregar la logica del calculo dependiendo de la opcion seleccionada.
 * @returns {number} Precio de envio
 */
const getDeliveryCost = () => 0;



const updateTotal = () => {
  const cartElement = document.getElementById('items-container');
  const subtotals = getAllSubtotals(cartElement);
  const subtotal = calculateSubtotal(subtotals);

  document.getElementById('subtotal').innerHTML = subtotal;
  document.getElementById('total').innerHTML = `UYU ${subtotal + getDeliveryCost()};`;
};

// eslint-disable-next-line no-unused-vars
const onCountChange = (e) => {
  const newProductCount = e.querySelector('td input').value;

  const unitCostElement = e.querySelector('td[name="unit-cost"]');
  const subtotalElement = e.querySelector('td[name="subtotal"]');

  // Se separa el string, por un lado la unidad monetaria y por el otro costo.
  const [currency, unitCostString] = unitCostElement.innerText.split(' ');

  const unitCost = parseInt(unitCostString, 10);
  subtotalElement.innerHTML = `${currency} ${unitCost * newProductCount}`;
  subtotalElement.setAttribute('data-subtotal', unitCost * newProductCount);
  updateTotal();
};

const generateCartItemHTML = (product) => {
  const subTotal = product.count * product.unitCost;
  return `
    <tr oninput="onCountChange(this)">
      <td>
          <img class="cart-item__img" src="${product.src}"></img>
      </td>
      <td>${product.name}</td>
      <td name="unit-cost">${product.currency} ${product.unitCost}</td>
      <td>
          <input type="number" value="${product.count}" min=1>
      </td>
      <td name="subtotal" data-subtotal=${subTotal} data-currency=${product.currency}>
        ${product.currency} ${subTotal}
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
    data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
    data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
    data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
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
