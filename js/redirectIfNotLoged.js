
const redirectToLogin = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        const sessionStorageUser = JSON.parse(localStorage.getItem('user'))
        if ( !user && !sessionStorageUser) {
        // User is not signed in. Redirect to login
        window.location = '/obligatorio-jap-2020/login'
        }
    }, function(error) {
        console.log(error);
    });
};

redirectToLogin(); 
