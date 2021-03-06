/* eslint-disable no-undef */
/* global getJSONData, PRODUCTS_URL */

const showProducts = (products) => {
  const productsContainer = document.getElementById('products-container');
  const productsListedCount = document.getElementById('products-listed-count');
  productsListedCount.innerHTML = products.length;
  productsContainer.innerHTML = '';

  products.forEach((product) => {
    productsContainer.innerHTML += `
      <section class="grid-element">
          <header>
              <a href="product-info.html"><img class="grid-element-img" src="${product.imgSrc}" alt="${product.name}"></a>
          </header>
          <div class="grid-element-body">
              <h2 class="grid-element-body-title">${product.currency} ${product.cost}</h2>
              <h3 class="product-name">${product.name}</h3>
              <p class="grid-element-body-description">${product.description}</p>
          </div>
          <hr>
          <p class="grid-element-footer"><span >${product.soldCount}</span> vendidos.</p>
      </section>
    `;
  });
};

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(PRODUCTS_URL)
    .then(({
      data,
    }) => {
      // eslint-disable-next-line no-undef
      lastSorted = data;
      showProducts(data);

      let sortOptions = {
        key: 'cost',
        areNumbers: true,
      };
      addOrderListener('by-cost-max-min', lastSorted, DESC, sortOptions, showProducts);
      addOrderListener('by-cost-min-max', lastSorted, ASC, sortOptions, showProducts);

      sortOptions = {
        key: 'soldCount',
        areNumbers: true,
      };
      addOrderListener('by-sold-count-max-min', lastSorted, DESC, sortOptions, showProducts);
      addOrderListener('by-sold-count-min-max', lastSorted, ASC, sortOptions, showProducts);

      // Orden alfabetico A-Z
      sortOptions = {
        key: 'name',
      };
      addOrderListener('by-abc-az', lastSorted, ASC, sortOptions, showProducts);
      // Orden alfabetico Z-A
      addOrderListener('by-abc-za', lastSorted, DESC, sortOptions, showProducts);

      // Filter
      document.getElementById('filter').addEventListener('click', () => {
        const [minValue, maxValue] = getNumberValues('filter-min', 'filter-max');

        const filterByPrice = document.getElementById('filter-by-price').checked;
        const filterBySold = document.getElementById('filter-by-sold').checked;

        if (filterByPrice) {
          filterByRange(lastSorted, 'cost', minValue, maxValue, showProducts);
        } else if (filterBySold) {
          filterByRange(lastSorted, 'soldCount', minValue, maxValue, showProducts);
        }
      });

      // Clear filter
      addClearFilterListener('filter-clear', 'filter-min', 'filter-max', showProducts);
    })
    .finally(() => {
      hideSpinner();
    });
});
