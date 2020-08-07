const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";


var firebaseConfig = {
  apiKey: "AIzaSyAoWh9ESaf4ECr9YQ5006lHzOOMya11sF0",
  authDomain: "obligatorio-jap-2020.firebaseapp.com",
  databaseURL: "https://obligatorio-jap-2020.firebaseio.com",
  projectId: "obligatorio-jap-2020",
  storageBucket: "obligatorio-jap-2020.appspot.com",
  messagingSenderId: "210642457292",
  appId: "1:210642457292:web:188b2a0316d84304b8a869"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){


  const mensaejePortada = document.getElementById('mensaje-bienvenida')
  const navLinksContainer = document.getElementById('nav-links-container')

  navLinksContainer.addEventListener('click', logout)

  const user = sessionStorage.getItem('user');
  if(user){
    const userObj = JSON.parse(user)
    mensaejePortada.innerHTML += ` ${ userObj.user ? userObj.user : user.getName()}!`
    navLinksContainer.innerHTML += '<a class="py-2 d-none d-md-inline-block" click="logout()">Cerrar Sesion</a>'

  }else {
    window.location = '/obligatorio-jap-2020/login'
  }

});

function logout() {
  sessionStorage.removeItem('user')
  firebase.auth().signOut().then(function() {
    console.log('// Sign-out successful.')
  }).catch(function(error) {
    // An error happened.
  });
}
