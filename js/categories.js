/* eslint-disable no-undef */
/* global getJSONData */

const showCategories = (categories) => {
  const categoriesContainer = document.getElementById('categories-container');
  const categoriesListedCount = document.getElementById('categories-listed-count');
  categoriesListedCount.innerHTML = categories.length;
  categoriesContainer.innerHTML = '';

  categories.forEach((category) => {
    categoriesContainer.innerHTML += `
    <section class="producto">
        <header>
            <img src="${category.imgSrc}" alt="${category.name}">
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
  getJSONData(CATEGORIES_URL).then(({
    data,
  }) => {
    // eslint-disable-next-line no-undef
    /* La variable lastSorted esta definida en el archivo sort.js */
    lastSorted = data;
    showCategories(data);

    let sortOptions = {
      key: 'productCount',
      areNumbers: true,
    };
    addOrderListener('by-product-count-max-min', lastSorted, DESC, sortOptions, showCategories);
    addOrderListener('by-product-count-min-max', lastSorted, ASC, sortOptions, showCategories);

    // Orden alfabetico A-Z
    sortOptions = {
      key: 'name',
    };
    addOrderListener('by-abc-az', lastSorted, ASC, sortOptions, showCategories);
    // Orden alfabetico Z-A
    addOrderListener('by-abc-za', lastSorted, DESC, sortOptions, showCategories);

    // Filter
    document.getElementById('filter').addEventListener('click', () => {
      const [minValue, maxValue] = getNumberValues('filter-min', 'filter-max');

      filterByRange(lastSorted, 'productCount', minValue, maxValue, showCategories);
    });

    // Clear filter
    addClearFilterListener('filter-clear', 'filter-min', 'filter-max', showCategories);
  });
});
