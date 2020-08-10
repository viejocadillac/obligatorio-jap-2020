const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";


// Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyB-XYq5X9nS1FIQZoCXvOohWwsJMdBDLXc",
  authDomain: "jovenes-a-programar-deed4.firebaseapp.com",
  databaseURL: "https://jovenes-a-programar-deed4.firebaseio.com",
  projectId: "jovenes-a-programar-deed4",
  storageBucket: "jovenes-a-programar-deed4.appspot.com",
  messagingSenderId: "972986978219",
  appId: "1:972986978219:web:c41276ff01dcc7ca7a8cee"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


firebase.auth().onAuthStateChanged(function(user) {
  const dropdownButton = document.getElementById('dropdown-button');
  const opcionesDeUsuario = document.getElementById('opciones-usuario-dropdown');
  if ( user ) {
  // User is signed in.
  dropdownButton.innerHTML = `${user.displayName}`
  opcionesDeUsuario.innerHTML += '<a href="cart.html" class="dropdown-item">Mi Carrito</a>'
  opcionesDeUsuario.innerHTML += '<a href="my-profile.html" class="dropdown-item">Perfil</a>'

  opcionesDeUsuario.innerHTML += '<button id="logout-button" class="dropdown-item" onclick="logout()">Cerrar Sesion</button>'
  } else {
    opcionesDeUsuario.innerHTML += '<a class="dropdown-item disabled">Crear cuenta</a>'

  }
}, function(error) {
  console.log(error);
});




var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

const logout = (e) => {
  firebase.auth().signOut().then(()=> {
    console.log('sesion cerrada correctamente')
  })
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});







