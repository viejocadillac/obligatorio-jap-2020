
const redirectToLogin = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if ( !user ) {
        // User is not signed in. Redirect to login
        window.location = '/obligatorio-jap-2020/login'
        }
    }, function(error) {
        console.log(error);
    });
};

redirectToLogin(); 
