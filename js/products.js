/* eslint-disable no-undef */
/* global getJSONData, PRODUCTS_URL */

const showProducts = (products, criteria, filterOptions) => {
  const productsContainer = document.getElementById('productos-container');
  productsContainer.innerHTML = '';

  let displayArray = sortArray(criteria, products);

  if (filterOptions) {
    const { keyToCompare, min, max } = filterOptions;
    displayArray = filterByRange(displayArray, keyToCompare, min, max);
  }


  displayArray.forEach((producto) => {
    productsContainer.innerHTML += `
      <section class="producto">
          <header>
              <img src="${producto.imgSrc}" alt="">
          </header>
          <div class="product-body">
              <h2 class="product-price">${producto.currency} ${producto.cost}</h2>
              <h3 class="product-name">${producto.name}</h3>
              <p class="product-description">${producto.description}</p>
          </div>
          <hr>
          <p class="vendidos"><span id="cantidad-vendidos">${producto.soldCount}</span> vendidos.</p>
      </section>
    `;
  });
  return displayArray;
};


let lastSorted;

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(PRODUCTS_URL).then(({ data }) => {
    // eslint-disable-next-line no-undef
    lastSorted = showProducts(data, ORDER_ASC_BY_NAME);

  

    document.getElementById('sortAsc').addEventListener('click', () => {
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_ASC_BY_NAME);
      } else {
        lastSorted = showProducts(data, ORDER_ASC_BY_NAME);
      }
    });

    document.getElementById('sortDesc').addEventListener('click', () => {

      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_DESC_BY_NAME);
      } else {
        lastSorted = showProducts(data, ORDER_DESC_BY_NAME);
      }
    });

    document.getElementById('sortByCount').addEventListener('click', () => {
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_BY_SOLD_COUNT);
      } else {
        lastSorted = showProducts(data, ORDER_BY_SOLD_COUNT);
      }
    });

    document.getElementById('rangeFilterCount').addEventListener('click', () => {
      const minValue = document.getElementById('rangeFilterCountMin').value;
      const maxValue = document.getElementById('rangeFilterCountMax').value;

      lastSorted = showProducts(lastSorted, FILTER, { keyToCompare: 'soldCount', min: minValue, max: maxValue });
    });

    document.getElementById('clearRangeFilter').addEventListener('click', () => {
      lastSorted = showProducts(data, ORDER_ASC_BY_NAME);
      document.getElementById('rangeFilterCountMin').value = ''
      document.getElementById('rangeFilterCountMax').value = ''
    });
  });
});




const filterByRange = ( (array, keyToCompare, min ,max) => {
  return array.filter(( element) => element[keyToCompare] > min && element[keyToCompare] < max);
});
