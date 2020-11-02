/* global HOME, firebase, firebaseui, validateAll, redirectTo */

// For Firebase
const CLIENT_ID = '210642457292-5ta58pfjm3pqbg7h7seocdkbtbhqt1oh.apps.googleusercontent.com';

// FirebaseUI config.
const uiConfig = {
  // Url to redirect to after a successful sign-in.
  signInSuccessUrl: HOME,
  callbacks: {
    signInSuccess() {
      if (window.opener) {
        // The widget has been opened in a popup, so close the window
        // and return false to not redirect the opener.
        window.close();
        return false;
      }
      // The widget has been used in redirect mode, so we redirect to the signInSuccessUrl.
      return true;
    },
  },
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // Required to enable ID token credentials for this provider.
      clientId: CLIENT_ID,
    },
  ],
  // Terms of service url.
  tosUrl: 'https://www.google.com',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded to include the FirebaseUI sign-in widget
// within the element corresponding to the selector specified.
ui.start('#firebaseui-auth-container', uiConfig);

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario-login');

  /*
    Se oculta el mensaje de error del formulario cada vez que se ingresa
    algo en los input con clase with-error
  */
  const inputs = document.getElementsByClassName('with-error');
  Array.from(inputs).forEach((input) => {
    input.addEventListener('input', () => {
      document.getElementById('login-error').innerHTML = '';
    });
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = firebase.auth().currentUser;
    if (user) {
      // User is signed in.
      // TODO Mostrar el error de otra forma, por ejemplo abajo del formulario
      alert('Ya se encuentra logueado con google');
    } else {
      const formData = new FormData(formulario);
      const userObj = Object.fromEntries(formData.entries());

      if (validateAll(formulario)) {
        firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password).then(() => {
          redirectTo(HOME);
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          let errorToDisplay;
          console.log(error);

          if (errorCode === 'auth/invalid-email') {
            errorToDisplay = 'Email no valido';
          } else if (errorCode === 'auth/wrong-password') {
            errorToDisplay = 'Contraseña incorrecta';
          } else if (errorCode === 'auth/user-not-found') {
            errorToDisplay = 'Usuario no encontrado';
          } else {
            errorToDisplay = 'No se puedo iniciar sesion';
          }

          document.getElementById('login-error').innerHTML = errorToDisplay;
     
          // ..
        });

      }
 

      
    }
  });
});
