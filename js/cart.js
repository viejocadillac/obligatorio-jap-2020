/* global getJSONData CART_INFO_URL renderIn */

const generateCartItemHTML = (item) => `
    <article class="cart-item">
    <img src="${item.src}" alt="${item.name}" class="cart-item__img">
    <div>
      <p class="cart-item__name">${item.name}</p>
      <p class="cart-item__price">${item.currency} ${item.unitCost}</p>
    </div>

    <div class="cart-item__countcontrols">
      <i class="fa fa-plus"></i>
      <p class="cart-item__count">${item.count}</p>
      <i class="fa fa-minus"></i>
    </div>          
  </article>
`;

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {

  getJSONData(CART_INFO_URL, false).then(({ data }) => {
    const itemsContainer = document.getElementById('items-container');

    data.articles.map(generateCartItemHTML).forEach(renderIn(itemsContainer));
   

  
  });

  const toggleFooter = document.getElementById('btn-toggle-checkout');
  let footerIsShown = false;
  toggleFooter.addEventListener('click', () => {
    const icon = document.querySelector('.icon-toggle-footer');
    const cartFooter = document.querySelector('.cart__footer');
    if (footerIsShown) {
      icon.style.transform = 'rotate(0deg)';
      cartFooter.style.maxHeight = '3rem';
    } else {
      icon.style.transform = 'rotate(180deg)';
      cartFooter.style.maxHeight = '999px';
    }
    footerIsShown = !footerIsShown;
  });
});
