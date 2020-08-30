/* eslint-disable no-undef */
/* global getJSONData, PRODUCTS_URL */

const showProducts = (products, criteria, filterOptions) => {
  const productsContainer = document.getElementById('cat-list-container');
  productsContainer.innerHTML = '';

  let displayArray = sortArray(criteria, products);

  if (filterOptions) {
    const { keyToCompare, min, max } = filterOptions;
    displayArray = filterByRange(displayArray, keyToCompare, min, max);
  }


  displayArray.forEach((category) => {
    productsContainer.innerHTML += `
    <section class="producto">
        <header>
            <img src="${category.imgSrc}" alt="">
        </header>
        <div class="product-body">
            <h2 class="product-price">${category.name}</h2>
            <p class="product-description">${category.description}</p>
        </div>
        <hr>
        <p class="vendidos"><span id="cantidad-vendidos">${category.productCount}</span> productos.</p>
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
  getJSONData(CATEGORIES_URL).then(({ data }) => {
    // eslint-disable-next-line no-undef
    lastSorted = showProducts(data, ORDER_ASC_BY_NAME);

    document.getElementById('precio-venta-mayor-menor').addEventListener('click', () => {
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_BY_PRICE_DESC);
      } else {
        lastSorted = showProducts(data, ORDER_BY_PRICE_DESC);
      }
    });

    document.getElementById('precio-venta-menor-mayor').addEventListener('click', () => {
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_BY_PRICE_ASC);
      } else {
        lastSorted = showProducts(data, ORDER_BY_PRICE_ASC);
      }
    });

    /*

    document.getElementById('cantidad-vendidos-mayor-menor').addEventListener('click', () => {
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_BY_SOLD_COUNT_DESC);
      } else {
        lastSorted = showProducts(data, ORDER_BY_SOLD_COUNT_DESC);
      }
    });

    document.getElementById('cantidad-vendidos-menor-mayor').addEventListener('click', () => {
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_BY_SOLD_COUNT_ASC);
      } else {
        lastSorted = showProducts(data, ORDER_BY_SOLD_COUNT_ASC);
      }
    });
*/
    // Orden alfabetico A-Z
    document.getElementById('sortAsc').addEventListener('click', () => {
      console.log('AZ')
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_ASC_BY_NAME);
      } else {
        lastSorted = showProducts(data, ORDER_ASC_BY_NAME);
      }
    });

    // Orden alfabetico Z-A
    document.getElementById('sortDesc').addEventListener('click', () => {
      console.log('ZA')
      if (lastSorted) {
        lastSorted = showProducts(lastSorted, ORDER_DESC_BY_NAME);
      } else {
        lastSorted = showProducts(data, ORDER_DESC_BY_NAME);
      }
    });

  
    // Filter
    document.getElementById('rangeFilterCount').addEventListener('click', () => {
      const minValue = document.getElementById('rangeFilterCountMin').value;
      const maxValue = document.getElementById('rangeFilterCountMax').value;

      const filterByPrice = document.getElementById('filtrado-por-precio').checked;
      const filterBySold = document.getElementById('filtrado-por-ventas').checked;

      if (filterByPrice) {
        lastSorted = showProducts(lastSorted, FILTER, { keyToCompare: 'cost', min: minValue, max: maxValue });
      } else if (filterBySold) {
        lastSorted = showProducts(lastSorted, FILTER, { keyToCompare: 'soldCount', min: minValue, max: maxValue });
      }
    });

    // Clear filter
    document.getElementById('clearRangeFilter').addEventListener('click', () => {
      lastSorted = showProducts(data, ORDER_ASC_BY_NAME);
      document.getElementById('rangeFilterCountMin').value = '';
      document.getElementById('rangeFilterCountMax').value = '';
    });
  });
});

const filterByRange = ((array, keyToCompare, min, max) => {
  const filtrados = array.filter(( element) => element[keyToCompare] > min && element[keyToCompare] < max);
  return filtrados;
});
























function showCategoriesList() {
  let htmlContentToAppend = '';
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    const category = currentCategoriesArray[i];

    if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount))
            && ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {
      htmlContentToAppend += `
      <section class="producto">
      <header>
          <img src="${category.imgSrc}" alt="">
      </header>
      <div class="product-body">
          <h2 class="product-price">${category.name}</h2>
          <p class="product-description">${category.description}</p>
      </div>
      <hr>
      <p class="vendidos"><span id="cantidad-vendidos">${category.productCount}</span> productos.</p>
  </section>
            `;
    }

    document.getElementById('cat-list-container').innerHTML = htmlContentToAppend;
  }
}
