/* eslint-disable no-undef */
/* global getJSONData */

const showProducts = (elements) => {
  const productsContainer = document.getElementById('cat-list-container');
  const cantidadEncontrados = document.getElementById('cantidad-encontrados');
  cantidadEncontrados.innerHTML = elements.length;
  productsContainer.innerHTML = '';

  elements.forEach((category) => {
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
};

const filterByRange = ((array, keyToCompare, min, max) => {
  const filtrados = array.filter(( element) => element[keyToCompare] > min && element[keyToCompare] < max);
  return filtrados;
});

let lastSorted;

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CATEGORIES_URL).then(({ data }) => {
    // eslint-disable-next-line no-undef
    lastSorted = data;
    showProducts(data);

    document.getElementById('precio-venta-mayor-menor').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(DESC, lastSorted, { key: 'productCount', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(DESC, data, { key: 'productCount', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      }
    });

    document.getElementById('precio-venta-menor-mayor').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(ASC, lastSorted, { key: 'productCount', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(ASC, data, { key: 'productCount', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      }
    });

    // Orden alfabetico A-Z
    document.getElementById('sortAsc').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(ASC, lastSorted, { key: 'name' });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(ASC, data, { key: 'name' });
        lastSorted = newOrder;
        showProducts(newOrder);
      }
    });

    // Orden alfabetico Z-A
    document.getElementById('sortDesc').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(DESC, lastSorted, { key: 'name' });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(DESC, data, { key: 'name' });
        lastSorted = newOrder;
        showProducts(newOrder);
      }
    });

    // Filter
    document.getElementById('rangeFilterCount').addEventListener('click', () => {
      const minValue = document.getElementById('rangeFilterCountMin').value;
      const maxValue = document.getElementById('rangeFilterCountMax').value;

      const filtered = filterByRange(lastSorted, 'productCount', minValue, maxValue);
      showProducts(filtered);
    });

    // Clear filter
    document.getElementById('clearRangeFilter').addEventListener('click', () => {
      lastSorted = showProducts(lastSorted);
      document.getElementById('rangeFilterCountMin').value = '';
      document.getElementById('rangeFilterCountMax').value = '';
    });
  });
});


