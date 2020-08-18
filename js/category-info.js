/* eslint-disable no-plusplus */
/* global CATEGORY_INFO_URL, getJSONData */

let category = {};

function showImagesGallery(array) {
  let htmlContentToAppend = '';

  for (let i = 0; i < array.length; i++) {
    const imageSrc = array[i];

    htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="${imageSrc}" alt="">
            </div>
        </div>
        `;

    document.getElementById('productImagesGallery').innerHTML = htmlContentToAppend;
  }
}

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(CATEGORY_INFO_URL).then((resultObj) => {
    if (resultObj.status === 'ok') {
      category = resultObj.data;

      const categoryNameHTML = document.getElementById('categoryName');
      const categoryDescriptionHTML = document.getElementById('categoryDescription');
      const productCountHTML = document.getElementById('productCount');
      const productCriteriaHTML = document.getElementById('productCriteria');

      categoryNameHTML.innerHTML = category.name;
      categoryDescriptionHTML.innerHTML = category.description;
      productCountHTML.innerHTML = category.productCount;
      productCriteriaHTML.innerHTML = category.productCriteria;

      // Muestro las imagenes en forma de galería
      showImagesGallery(category.images);
    }
  });
});
