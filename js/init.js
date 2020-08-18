/* eslint-disable no-unused-vars */
/* global firebase */

const HOME = '/obligatorio-jap-2020';
const LOGIN = '/obligatorio-jap-2020/login';

const CATEGORIES_URL = 'https://japdevdep.github.io/ecommerce-api/category/all.json';
const PUBLISH_PRODUCT_URL = 'https://japdevdep.github.io/ecommerce-api/product/publish.json';
const CATEGORY_INFO_URL = 'https://japdevdep.github.io/ecommerce-api/category/1234.json';
const PRODUCTS_URL = 'https://japdevdep.github.io/ecommerce-api/product/all.json';
const PRODUCT_INFO_URL = 'https://japdevdep.github.io/ecommerce-api/product/5678.json';
const PRODUCT_INFO_COMMENTS_URL = 'https://japdevdep.github.io/ecommerce-api/product/5678-comments.json';
const CART_INFO_URL = 'https://japdevdep.github.io/ecommerce-api/cart/987.json';
const CART_BUY_URL = 'https://japdevdep.github.io/ecommerce-api/cart/buy.json';

// Global functions

const redirectTo = (url) => {
  window.location.href = url;
};

const setLocalStorage = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

const showSpinner = () => {
  document.getElementById('spinner-wrapper').style.display = 'block';
};

const hideSpinner = () => {
  document.getElementById('spinner-wrapper').style.display = 'none';
};

const logout = (e) => {
  firebase.auth().signOut().then(() => {
    const localStorageUser = getFromLocalStorage('user');
    if (localStorageUser) {
      localStorage.removeItem('user');
      redirectTo(LOGIN);
    }
    console.log('sesion cerrada correctamente');
  });
};

const createNavMenu = (displayName) => {
  const dropdownButton = document.getElementById('dropdown-button');
  const opcionesDeUsuario = document.getElementById('opciones-usuario-dropdown');

  if (displayName && dropdownButton) {
    // Nombre de usuario y barra de navegacion presente (dropdown)
    dropdownButton.innerHTML = `${displayName}`;
    opcionesDeUsuario.innerHTML += `
      <a href="cart.html" class="dropdown-item"><i class="fas fa-shopping-cart"></i>Mi Carrito</a>
      <a href="my-profile.html" class="dropdown-item"><i class="fas fa-user"></i>Perfil</a>
      <button id="logout-button" class="dropdown-item" onclick="logout()"><i class="fas fa-sign-out-alt"></i>Cerrar Sesion</button>`;
  } else if (dropdownButton) {
    // Barra de navegacion presente pero sin nombre de usuario (dropdown)
    opcionesDeUsuario.innerHTML += '<a class="dropdown-item disabled">Crear cuenta</a>';
  }
};

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyB-XYq5X9nS1FIQZoCXvOohWwsJMdBDLXc',
  authDomain: 'jovenes-a-programar-deed4.firebaseapp.com',
  databaseURL: 'https://jovenes-a-programar-deed4.firebaseio.com',
  projectId: 'jovenes-a-programar-deed4',
  storageBucket: 'jovenes-a-programar-deed4.appspot.com',
  messagingSenderId: '972986978219',
  appId: '1:972986978219:web:c41276ff01dcc7ca7a8cee',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/*
Se chequea si hay un usuario logueado, dependiendo de eso,
se completa el menu de la barra de navegacion
*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in with google.
    createNavMenu(user.displayName);
  } else {
    // usuario no logueado con google, se chequea si existe en localStorage
    const localStorageUser = getFromLocalStorage('user');

    if (localStorageUser) {
      createNavMenu(localStorageUser.username);
    } else {
      createNavMenu();
    }
  }
}, (error) => {
  console.log(error);
});

const getJSONData = (url) => {
  const result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((response) => {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch((error) => {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
};
