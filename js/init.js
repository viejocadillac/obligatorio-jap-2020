/* eslint-disable no-unused-vars */
/* global firebase */

const HOME = '/obligatorio-jap-2020';
const LOGIN = `${HOME}/login`;
const REGISTER = `${HOME}/register`;
const PROFILE = `${HOME}/my-profile`;

const CATEGORIES_URL = 'https://japdevdep.github.io/ecommerce-api/category/all.json';
const PUBLISH_PRODUCT_URL = 'https://japdevdep.github.io/ecommerce-api/product/publish.json';
const CATEGORY_INFO_URL = 'https://japdevdep.github.io/ecommerce-api/category/1234.json';
const PRODUCTS_URL = 'https://japdevdep.github.io/ecommerce-api/product/all.json';
const PRODUCT_INFO_URL = 'https://japdevdep.github.io/ecommerce-api/product/5678.json';
const PRODUCT_INFO_COMMENTS_URL = 'https://japdevdep.github.io/ecommerce-api/product/5678-comments.json';
const CART_INFO_URL = 'https://japdevdep.github.io/ecommerce-api/cart/654.json';
const CART_BUY_URL = 'https://japdevdep.github.io/ecommerce-api/cart/buy.json';

// Global functions

/**
 *
 * @param {HTMLElement} container Contenedor donde se renderizara el contenido
 * @param {boolean} replace Indica si se debe remplazar el contenido (true) o agregar (false)
 */
const renderIn = (container, replace = false) => (innerHTML) => {
  if (replace) {
    // eslint-disable-next-line no-param-reassign
    container.innerHTML = innerHTML;
  } else {
    // eslint-disable-next-line no-param-reassign
    container.innerHTML += innerHTML;
  }
};

const getFormDataObject = (form) => Object.fromEntries(new FormData(form));

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

const logout = (redirect = true) => {
  firebase.auth().signOut().then(() => {
    if (redirect) redirectTo(HOME);
  });
};

const generateUserResumeHTML = (displayName, email) => `
  <h3 class="user-resume__name">${displayName}</h3>
  <p class="user-resume__email">${email}</p>
`;

const createNavMenu = (displayName, photoURL) => {
  const dropdownButton = document.getElementById('dropdownMenuButton');
  const opcionesDeUsuario = document.getElementById('opciones-usuario-dropdown');

  if (displayName && dropdownButton) {
    // Nombre de usuario y barra de navegacion presente (dropdown)
    dropdownButton.innerHTML = `<img class="site-header__user-image" src="${photoURL}"></img><span class="d-none d-md-inline-block user-name">${displayName}</span>`;
    opcionesDeUsuario.innerHTML = `
      <a href="cart.html" class="dropdown-item"><i class="fas fa-shopping-cart"></i>Mi Carrito</a>
      <a href="my-profile.html" class="dropdown-item"><i class="fas fa-user"></i>Perfil</a>
      <button id="logout-button" class="dropdown-item" onclick="logout()"><i class="fas fa-sign-out-alt"></i>Cerrar Sesion</button>`;
  } else if (dropdownButton) {
    // Barra de navegacion presente pero sin nombre de usuario (dropdown)
    opcionesDeUsuario.innerHTML = `
      <a href="${LOGIN}"class="dropdown-item">Iniciar Sesion</a>
      <a href="${REGISTER}" class="dropdown-item">Crear cuenta</a>
    `;
  }
};

const validators = {
  repassword: (val) => document.getElementById('password').value === val,
  password: (val) => val.length > 6,
  email: (val) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(val).toLowerCase());
  },
};

const isValid = (input) => {
  if (input.type === 'password' && input.name === 'repassword') {
    return validators.repassword(input.value);
  } if (input.type === 'password') {
    return validators.password(input.value);
  } if (input.type === 'text' && input.name === 'email') {
    return validators.email(input.value);
  }
  return input.value.length > 0;
};

const toggleError = (e) => {
  const { target } = e;
  const errorMessage = target.dataset.error;
  if (isValid(target)) {
    target.nextElementSibling.innerHTML = '';
  } else {
    target.nextElementSibling.innerHTML = errorMessage;
  }
};

const validateAll = (form) => {
  const inputs = form.getElementsByClassName('with-error');
  const arrayOfInputs = Array.from(inputs);

  arrayOfInputs.forEach((input) => toggleError({ target: input }));
  return arrayOfInputs.every((input) => isValid(input));
};

const addErrorHandlerToInputs = () => {
  const inputs = document.getElementsByClassName('with-error');
  Array.from(inputs).forEach((input) => {
    input.addEventListener('input', (e) => {
      toggleError(e);
    });
  });
};

/**
 * Devuelve dos funciones que manejan el estado del boton, tanto el disabled como la clase del icono
 * @param {HTMLElement} button Boton que se desea controlar
 * @param {HTMLElement} icon Elemento idealmente i (icono de FontAwesome)
 *                            al que se le cambiara la clase
 * @param {string} classLoading Clase que se le aplica al boton cuando se
 *                               inicia una operacion asincrona
 * @param {string} classStatic Clase que se le aplica al boton cuando
 *                              se encuentra en su estado inicial
 * @returns {object} Objeto con dos funciones: start y stop
 */
const createStateButtonHandler = (button, icon, classLoading, classStatic) => ({
  start: () => {
    // eslint-disable-next-line no-param-reassign
    button.disabled = true;
    icon.classList.replace(classStatic, classLoading);
  },
  stop: () => {
    // eslint-disable-next-line no-param-reassign
    button.disabled = false;
    icon.classList.replace(classLoading, classStatic);
  },
});

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
let DB;

/*
Se chequea si hay un usuario logueado, dependiendo de eso,
se completa el menu de la barra de navegacion
*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in with google.
    firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
      const name = snapshot.val().displayName ? snapshot.val().displayName : snapshot.val().email.split('@')[0];
      const image = snapshot.val().photoURL ? snapshot.val().photoURL : `${HOME}/img/profile-example.png`;
      createNavMenu(name, image);
    });
  } else {
    createNavMenu();
  }
}, (error) => {});

/*
Los input que sean envueltos con la clase pasada en wrapperClass y que tengan la clase
pasada como parametro mediante controlClass,
cuando se intente enviar el formulario y no sea valido el contenido del mismo, mostrara un mensaje
de error abajo. Los estilos del mismo seran modificables mediante la clase pasada en errorClass
*/
const addErrorMessages = (wrapperClass, controlClass, errorClass) => {
  const divsError = document.getElementsByClassName(wrapperClass);

  for (let index = 0; index < divsError.length; index += 1) {
    const wrapper = divsError[index];
    const control = wrapper.querySelector(`.${controlClass}`);

    const spanError = document.createElement('span');
    spanError.classList.add(errorClass);
    spanError.innerHTML = wrapper.dataset.error;
    wrapper.appendChild(spanError);

    control.addEventListener('invalid', (e) => {
      e.preventDefault();
      spanError.style.visibility = 'visible';
    });

    control.addEventListener('input', (e) => {
      e.preventDefault();
      if (control.value !== '') {
        spanError.style.visibility = 'hidden';
      }
    });
  }
};

const getJSONData = (url, showLoading = true, options = {}) => {
  const result = {};
  if (showLoading) showSpinner();
  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((response) => {
      result.status = 'ok';
      result.data = response;
      return result;
    })
    .catch((error) => {
      result.status = 'error';
      result.data = error;
      if (showLoading) hideSpinner();
      return result;
    });
};

const isFocused = (element) => document.activeElement === element;

let PRODUCTS = [];

function setProductsAndActualize(container, items) {
  const contenedor = container;
  // Se restablece el contenido de la lista
  contenedor.innerHTML = '';

  // Se agrega cada elemento a ella
  items.forEach((product) => {
    contenedor.innerHTML += `
      <a href="#" class="dropdown-item" >
        ${product.name}
      </a>
    `;
  });
}

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  const inputSearch = document.getElementById('input-search');
  const autocompleteList = document.getElementById('search-suggestions-list');

  // Maneja el cambio de foco en cada elemento con las teclas de flecha arriba y abajo
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && event.target.previousElementSibling) {
      // Se previene el comportamiento por default (Scroll de la pagina)
      // mientras se encuentre un elemento hermano
      event.preventDefault();
      event.target.previousElementSibling.focus();
    } else if (event.key === 'ArrowDown' && event.target.nextElementSibling) {
      event.preventDefault();
      event.target.nextElementSibling.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target !== inputSearch) {
      event.stopPropagation();
      if (autocompleteList) autocompleteList.style.display = 'none';
    }
  });

  let fetching = false;
  // Cuando se hace focus en el input de busqueda, se llama a la api y
  // se obtiene la lista de productos
  if (inputSearch) {
    inputSearch.addEventListener('focus', () => {
      // Se controla que hasta que no se termina la solicitud no se pueda generar otra.
      if (!fetching) {
        fetching = true;
        getJSONData(PRODUCTS_URL, false).then(({
          data,
        }) => {
          PRODUCTS = data;
          setProductsAndActualize(autocompleteList, data);
          autocompleteList.style.display = 'block';
          fetching = false;
        });
      }
    });

    // Se ejecuta cada vez que se ingresa algo en el input de busqueda
    inputSearch.addEventListener('input', (event) => {
    // Se obtiene el texto ingresado
      const inputValue = event.target.value;

      // Se genera una expresion regular (Se puede ingresar expresiones en el input), ignorando
      // la diferencia entre mayusculas y minusculas.
      try {
        const regex = new RegExp(inputValue, 'i');
        const filtrados = PRODUCTS.filter((product) => product.name.match(regex));
        setProductsAndActualize(autocompleteList, filtrados);
      } catch (error) {
      // console.log('Expresion de busqueda no valida');
      }
    });
  }
  addErrorHandlerToInputs();
});
