/* global HOME, firebase, firebaseui, validateAll, redirectTo, generateUserResumeHTML hideSpinner */

// For Firebase
const CLIENT_ID = '210642457292-5ta58pfjm3pqbg7h7seocdkbtbhqt1oh.apps.googleusercontent.com';

// FirebaseUI config.
const uiConfig = {
  // Url to redirect to after a successful sign-in.
  signInSuccessUrl: HOME,
  callbacks: {
    signInSuccessWithAuthResult() {
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
  const btnSendFormIcon = document.getElementById('btn-send-form-icon');
  const btnLogin = document.getElementById('btn-login');

  const buttonStateHandler = createStateButtonHandler(
    btnLogin,
    btnSendFormIcon,
    'fa-spinner',
    'fa-sign-in-alt',
  );

  firebase.auth().onAuthStateChanged((user) => {
    const signin = document.getElementById('signin');

    if (user) {
      signin.style.display = 'none';
      firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
        signin.classList.add('main-no-user');
        const userImage = snapshot.val().photoURL ? snapshot.val().photoURL : `${HOME}/img/profile-example.png`;
        document.getElementById('user-loged').style.display = 'block';
        document.getElementById('user-resume').innerHTML = `
        <img src="${userImage}" height="150px"></img>
          ${generateUserResumeHTML(snapshot.val().displayName, snapshot.val().email)}
        `;
        hideSpinner();
      });
    } else {
      signin.style.display = 'block';
      document.getElementById('user-loged').style.display = 'none';
      hideSpinner();
    }
  });

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
    const formData = new FormData(formulario);
    const userObj = Object.fromEntries(formData.entries());

    if (validateAll(formulario)) {
      buttonStateHandler.start();
      firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password).then(() => {
        redirectTo(HOME);
      }).catch((error) => {
        const errorCode = error.code;
        document.getElementById('form-error').innerHTML = getFormErrorText(errorCode);
      })
        .finally(() => {
          buttonStateHandler.stop();
        });
    }
  });
});
