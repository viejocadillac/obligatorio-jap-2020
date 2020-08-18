
const redirectToLogin = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        const sessionStorageUser = JSON.parse(localStorage.getItem('user'))
        if ( !user && !sessionStorageUser) {
        // User is not signed in. Redirect to login
        redirectTo(LOGIN)
        }
    }, function(error) {
        console.log(error);
    });
};

redirectToLogin(); 
