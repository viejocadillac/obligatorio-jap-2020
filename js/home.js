/* global getJSONData, CATEGORIES_URL */

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  const sliderInner = document.getElementById('slider-inner');
  getJSONData(CATEGORIES_URL).then(({
    data,
  }) => {
    data.forEach((product, i) => {
      sliderInner.innerHTML += `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <img class="carousel-img" src="${product.imgSrc}" alt="${product.name}">
          <div class="carousel-caption">
            <h2>${product.name}</h5>
            <p>${product.description}</p>
            <p class="product-count"><span>${product.productCount}</span> productos.</p>
          </div>
        </div>
        `;
    });
  });
});
