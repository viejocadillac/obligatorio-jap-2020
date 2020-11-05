/* global getJSONData, CATEGORIES_URL hideSpinner */

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  const sliderInner = document.getElementById('slider-inner');
  getJSONData(CATEGORIES_URL).then(({
    data,
  }) => {
    data.forEach((category, i) => {
      sliderInner.innerHTML += `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <img class="carousel-img" src="${category.imgSrc}" alt="${category.name}">
          <div class="carousel-caption">
            <a href=""><h2>${category.name}</h2></a>
            <p>${category.description}</p>
            <p class="product-count"><span>${category.productCount}</span> productos.</p>
          </div>
        </div>
        `;
    });
  }).then(() => hideSpinner());
});
