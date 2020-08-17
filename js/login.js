
// For Firebase
const CLIENT_ID = '210642457292-5ta58pfjm3pqbg7h7seocdkbtbhqt1oh.apps.googleusercontent.com'

// FirebaseUI config.
var uiConfig = {
    // Url to redirect to after a successful sign-in.
    signInSuccessUrl: '/obligatorio-jap-2020',
    'callbacks': {
        'signInSuccess': function(user, credential, redirectUrl) {
            if (window.opener) {
                // The widget has been opened in a popup, so close the window
                // and return false to not redirect the opener.
                window.close();
                return false;
            } else {
                // The widget has been used in redirect mode, so we redirect to the signInSuccessUrl.
                return true;
            }
        }
    },
    'signInFlow': 'popup',
    'signInOptions': [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // Required to enable ID token credentials for this provider.
            clientId: CLIENT_ID
        },
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com',
    'credentialHelper': firebaseui.auth.CredentialHelper.GOOGLE_YOLO 
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded to include the FirebaseUI sign-in widget
// within the element corresponding to the selector specified.
ui.start('#firebaseui-auth-container', uiConfig);


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.


document.addEventListener("DOMContentLoaded", function (e) {

    const formulario = document.getElementById('formulario-login')

    formulario.addEventListener('submit', (e)=> {
        e.preventDefault()

        var user = firebase.auth().currentUser;
            if ( user ) {
            // User is signed in.
            alert('Ya se encuentra logueado con google')
           
            } else {
               

                const formData = new FormData(formulario)
                const userObj = Object.fromEntries(formData.entries())
                sessionStorage.setItem('user', JSON.stringify(userObj))
                window.location = HOME
        
              
          
            }
          
       
    })
});

