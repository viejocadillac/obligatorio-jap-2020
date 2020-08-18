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
            <a href="category-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </a>
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
document.addEventListener('DOMContentLoaded', (e) => {
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

    if ((minCount !== undefined) && (minCount !== '') && (parseInt(minCount)) >= 0) {
      minCount = parseInt(minCount);
    } else {
      minCount = undefined;
    }

    if ((maxCount !== undefined) && (maxCount !== '') && (parseInt(maxCount)) >= 0) {
      maxCount = parseInt(maxCount);
    } else {
      maxCount = undefined;
    }

    showCategoriesList();
  });
});
