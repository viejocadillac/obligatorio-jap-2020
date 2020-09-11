/* global
    getJSONData,
    PRODUCT_INFO_URL PRODUCTS_URL,
    PRODUCT_INFO_COMMENTS_URL,
    getFromLocalStorage,
    setLocalStorage,
    firebase,
    moment,
    addErrorMessages
*/

moment.locale('es');

const getRelatedProducts = (relacionadosIndex) => new Promise((resolve, reject) => {
  getJSONData(PRODUCTS_URL, false).then(({ status, data }) => {
    if (status !== 'ok') reject();
    const relatedProducts = relacionadosIndex.map((relacionadoIndex) => data[relacionadoIndex]);
    resolve(relatedProducts);
  });
});

const generateRelatedHTML = (product) => `
  <section class="grid-element product-related">
    <header>
        <a href="product-info.html"><img class="grid-element-img" src="${product.imgSrc}" alt="${product.name}"></a>
    </header>
    <div class="grid-element-body">
        <h2 class="grid-element-body-title related-price">${product.currency} ${product.cost}</h2>
        <h3 class="product-name related-name">${product.name}</h3>
    </div>
  </section>
`;

const generateStarsHTML = (starsCount, size) => {
  let starsHTML = '';
  for (let index = 0; index < starsCount; index++) {
    starsHTML += `
      <i class="fas fa-star fa-${size} star"></i>
    `;
  }
  return starsHTML;
};

const generateCommentHTML = (comment) => `
  <section class="comment">
    <header>
      <div class="stars stars-comment">${generateStarsHTML(parseInt(comment.score, 10), 'xs')}</div>
      <span>${comment.user}</span> | <span>${moment(comment.dateTime).fromNow()}</span>
    </header>
    <p>${comment.description}</p>
    <hr/>
  </section>
`;

const generateImageHTML = (url) => `<img src="${url}" class="image-small" alt="" ></img>`;

const renderIn = (container) => (innerHTML) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML += innerHTML;
};

// Convierte la propiedad score a Integer ya que puede venir como entero o como string
const parseScoreInt = (comment) => ({ ...comment, score: parseInt(comment.score, 10) });

const getLocalComments = () => {
  let comments = getFromLocalStorage('comments');
  if (!comments) comments = [];
  return comments.map(parseScoreInt);
};

// Devuelve todos los comentarios, tanto los locales como los que provienen del JSON
const getComments = () => new Promise((resolve, reject) => {
  getJSONData(PRODUCT_INFO_COMMENTS_URL).then(({ status, data }) => {
    if (status !== 'ok') reject(status);
    const serverComments = data;
    const localComments = getLocalComments();

    const allComments = [...serverComments, ...localComments];
    resolve(allComments);
  });
});

// Calcula la puntuacion promedio de todas las opiniones
const calcAveragePoints = (opinions) => {
  const suma = opinions.reduce((acc, current) => acc + current.score, 0);
  return Math.ceil(suma / opinions.length);
};

// Simula un guardado de comentario en una base de datos
const saveComment = (comment) => {
  let comments = getFromLocalStorage('comments');
  if (!comments) comments = [];
  comments.push(comment);
  setLocalStorage('comments', comments);
};

const addComment = (data) => {
  firebase.auth().onAuthStateChanged((user) => {
    let userName;
    if (user) {
      // User is signed in with google.
      userName = user.displayName;
    } else {
      // usuario no logueado con google, se chequea si existe en localStorage
      const localStorageUser = getFromLocalStorage('user');

      if (localStorageUser) {
        userName = localStorageUser.username;
      } else {
        userName = '';
      }
    }

    const comment = {
      score: data.valoracion,
      description: data.text,
      dateTime: new Date().toISOString(),
      user: userName,
    };

    saveComment(comment);
    const comentarios = document.getElementById('comentarios');
    comentarios.innerHTML += generateCommentHTML(comment);
  }, (error) => {});
};

const addToAveragePoints = (scoreToAdd) => {
  const stars = document.getElementById('stars');
  const actualScore = parseInt(stars.dataset.score, 10);
  const sum = actualScore + parseInt(scoreToAdd, 10);
  const newScore = sum / 2;
  stars.innerHTML = generateStarsHTML(newScore, 'md');
  stars.setAttribute('data-score', newScore);
};

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  getJSONData(PRODUCT_INFO_URL).then(({ data }) => {
    const containerImagesSmall = document.getElementById('container-images-small');
    const cantidadVendidos = document.getElementById('cantidad-vendidos');
    const productDescription = document.getElementById('product-description');

    productDescription.innerHTML = data.description;

    cantidadVendidos.innerHTML = `Nuevo | ${data.soldCount} vendidos.`;
    const imageBig = document.getElementById('image-big');

    containerImagesSmall.addEventListener('mouseover', (event) => {
      event.stopPropagation();

      if (event.target.src) {
        imageBig.src = event.target.src;
      }
    });

    data.images.map(generateImageHTML).forEach(renderIn(containerImagesSmall));

    const relatedContainer = document.getElementById('related-products');

    // Se obtienen los productos relacionados y se los renderiza en el contenedor
    getRelatedProducts(data.relatedProducts).then((related) => {
      related
        .map(generateRelatedHTML)
        .forEach(renderIn(relatedContainer));
    });

    // Se obtienen los comentarios
    getComments().then((comments) => {
      const comentarios = document.getElementById('comentarios');
      const stars = document.getElementById('stars');

      const points = calcAveragePoints(comments);
      stars.innerHTML = generateStarsHTML(points, 'md');
      stars.setAttribute('data-score', points);

      comments.map(generateCommentHTML).forEach(renderIn(comentarios));
    });

    addErrorMessages('error-wrapper', 'control', 'form-error');

    const form = document.getElementById('form-opinion');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let formData = new FormData(form);
      formData = Object.fromEntries(formData.entries());
      addComment(formData);
      addToAveragePoints(formData.valoracion);
    });
  });
});
