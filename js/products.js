/* eslint-disable no-undef */
/* global getJSONData, PRODUCTS_URL */

const showProducts = (elements) => {
  const productsContainer = document.getElementById('productos-container');
  const cantidadEncontrados = document.getElementById('cantidad-encontrados');
  cantidadEncontrados.innerHTML = elements.length;
  productsContainer.innerHTML = '';

  elements.forEach((producto) => {
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
  getJSONData(PRODUCTS_URL).then(({ data }) => {
    // eslint-disable-next-line no-undef
    lastSorted = data;
    showProducts(data);

    document.getElementById('precio-venta-mayor-menor').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(DESC, lastSorted, { key: 'cost', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(DESC, data, { key: 'cost', areNumbers: true });
        lastSorted = data;
        showProducts(newOrder);
      }
    });

    document.getElementById('precio-venta-menor-mayor').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(ASC, lastSorted, { key: 'cost', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(ASC, data, { key: 'cost', areNumbers: true });
        lastSorted = data;
        showProducts(newOrder);
      }
    });

    document.getElementById('cantidad-vendidos-mayor-menor').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(DESC, lastSorted, { key: 'soldCount', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(DESC, data, { key: 'soldCount', areNumbers: true });
        lastSorted = data;
        showProducts(newOrder);
      }
    });

    document.getElementById('cantidad-vendidos-menor-mayor').addEventListener('click', () => {
      if (lastSorted) {
        const newOrder = sortArray(ASC, lastSorted, { key: 'soldCount', areNumbers: true });
        lastSorted = newOrder;
        showProducts(newOrder);
      } else {
        const newOrder = sortArray(ASC, data, { key: 'soldCount', areNumbers: true });
        lastSorted = data;
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
        lastSorted = data;
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
        lastSorted = data;
        showProducts(newOrder);
      }
    });

  
    // Filter
    document.getElementById('rangeFilterCount').addEventListener('click', () => {
      const minValue = parseInt(document.getElementById('rangeFilterCountMin').value, 10);
      const maxValue = parseInt(document.getElementById('rangeFilterCountMax').value, 10);

      const filterByPrice = document.getElementById('filtrado-por-precio').checked;
      const filterBySold = document.getElementById('filtrado-por-ventas').checked;

      let filtered;
      if (filterByPrice) {
        console.log('precio')
        filtered = filterByRange(lastSorted, 'cost', minValue, maxValue);
        showProducts(filtered);
      } else if (filterBySold) {
        console.log('vendidos')
        filtered = filterByRange(lastSorted, 'soldCount', minValue, maxValue);
        showProducts(filtered);
      }
    });

    // Clear filter
    document.getElementById('clearRangeFilter').addEventListener('click', () => {
      showProducts(lastSorted);
      document.getElementById('rangeFilterCountMin').value = '';
      document.getElementById('rangeFilterCountMax').value = '';
    });
  });
});


