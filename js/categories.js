/* eslint-disable radix */
/* global getJSONData, CATEGORIES_URL */

const ORDER_ASC_BY_NAME = 'AZ';
const ORDER_DESC_BY_NAME = 'ZA';
const ORDER_BY_PROD_COUNT = 'Cant.';
let currentCategoriesArray = [];
let currentSortCriteria;
let minCount;
let maxCount;

function sortCategories(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort((a, b) => {
      if (a.name > b.name) { return -1; }
      if (a.name < b.name) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort((a, b) => {
      const aCount = parseInt(a.productCount);
      const bCount = parseInt(b.productCount);

      if (aCount > bCount) { return -1; }
      if (aCount < bCount) { return 1; }
      return 0;
    });
  }

  return result;
}

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

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;

  if (categoriesArray !== undefined) {
    currentCategoriesArray = categoriesArray;
  }

  currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

  // Muestro las categorías ordenadas
  showCategoriesList();
}

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CATEGORIES_URL).then((resultObj) => {
    if (resultObj.status === 'ok') {
      sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
    }
  });

  document.getElementById('sortAsc').addEventListener('click', () => {
    sortAndShowCategories(ORDER_ASC_BY_NAME);
  });

  document.getElementById('sortDesc').addEventListener('click', () => {
    sortAndShowCategories(ORDER_DESC_BY_NAME);
  });

  document.getElementById('sortByCount').addEventListener('click', () => {
    sortAndShowCategories(ORDER_BY_PROD_COUNT);
  });

  document.getElementById('clearRangeFilter').addEventListener('click', () => {
    document.getElementById('rangeFilterCountMin').value = '';
    document.getElementById('rangeFilterCountMax').value = '';

    minCount = undefined;
    maxCount = undefined;

    showCategoriesList();
  });

  document.getElementById('rangeFilterCount').addEventListener('click', () => {
    // Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    // de productos por categoría.
    minCount = document.getElementById('rangeFilterCountMin').value;
    maxCount = document.getElementById('rangeFilterCountMax').value;

    if (minCount && (parseInt(minCount)) >= 0) {
      minCount = parseInt(minCount);
    } else {
      minCount = undefined;
    }

    if (maxCount && (parseInt(maxCount)) >= 0) {
      maxCount = parseInt(maxCount);
    } else {
      maxCount = undefined;
    }

    showCategoriesList();
  });
});
