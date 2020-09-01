/* global getJSONData, CATEGORIES_URL */

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('categories-container');
  getJSONData(CATEGORIES_URL).then(({
    data
  }) => {
    data.forEach((product) => {
      productsContainer.innerHTML += `
        <section class="grid-element">
            <header>
                <img class="grid-element-img" src="${product.imgSrc}" alt="">
            </header>
            <div class="grid-element-body">
                <h2 class="grid-element-body-title">${product.name}</h2>
                <p class="grid-element-body-description">${product.description}</p>
            </div>
            <hr>
            <p class="grid-element-footer"><span >${product.productCount}</span> productos.</p>
        </section>
      `;
    });
  });
});