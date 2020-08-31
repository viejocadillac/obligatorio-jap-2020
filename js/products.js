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

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(PRODUCTS_URL).then(({ data }) => {
    // eslint-disable-next-line no-undef
    lastSorted = data;
    showProducts(data);

    let sortOptions = { key: 'cost', areNumbers: true };
    addOrderListener('precio-venta-mayor-menor', lastSorted, DESC, sortOptions, showProducts);
    addOrderListener('precio-venta-menor-mayor', lastSorted, ASC, sortOptions, showProducts);

    sortOptions = { key: 'soldCount', areNumbers: true };
    addOrderListener('cantidad-vendidos-mayor-menor', lastSorted, DESC, sortOptions, showProducts);
    addOrderListener('cantidad-vendidos-menor-mayor', lastSorted, ASC, sortOptions, showProducts);

    // Orden alfabetico A-Z
    sortOptions = { key: 'name' };
    addOrderListener('sortAsc', lastSorted, ASC, sortOptions, showProducts);
    // Orden alfabetico Z-A
    addOrderListener('sortDesc', lastSorted, DESC, sortOptions, showProducts);

    // Filter
    document.getElementById('rangeFilterCount').addEventListener('click', () => {
      const minValue = parseInt(document.getElementById('rangeFilterCountMin').value, 10);
      const maxValue = parseInt(document.getElementById('rangeFilterCountMax').value, 10);

      const filterByPrice = document.getElementById('filtrado-por-precio').checked;
      const filterBySold = document.getElementById('filtrado-por-ventas').checked;

      let filtered;
      if (filterByPrice) {
        filtered = filterByRange(lastSorted, 'cost', minValue, maxValue);
        showProducts(filtered);
      } else if (filterBySold) {
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


