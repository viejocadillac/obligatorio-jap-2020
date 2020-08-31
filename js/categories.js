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

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CATEGORIES_URL).then(({ data }) => {
    // eslint-disable-next-line no-undef
    /* La variable lastSorted esta definida en el archivo sort.js */
    lastSorted = data;
    showProducts(data);

    let sortOptions = { key: 'productCount', areNumbers: true };
    addOrderListener('precio-venta-mayor-menor', lastSorted, DESC, sortOptions, showProducts);
    addOrderListener('precio-venta-menor-mayor', lastSorted, ASC, sortOptions, showProducts);

    // Orden alfabetico A-Z
    sortOptions = { key: 'name' };
    addOrderListener('sortAsc', lastSorted, ASC, sortOptions, showProducts);
    // Orden alfabetico Z-A
    addOrderListener('sortDesc', lastSorted, DESC, sortOptions, showProducts);

    // Filter
    document.getElementById('rangeFilterCount').addEventListener('click', () => {
      const minValue = document.getElementById('rangeFilterCountMin').value;
      const maxValue = document.getElementById('rangeFilterCountMax').value;

      const filtered = filterByRange(lastSorted, 'productCount', minValue, maxValue);
      showProducts(filtered);
    });

    // Clear filter
    document.getElementById('clearRangeFilter').addEventListener('click', () => {
      showProducts(lastSorted);
      document.getElementById('rangeFilterCountMin').value = '';
      document.getElementById('rangeFilterCountMax').value = '';
    });
  });
});
