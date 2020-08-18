

firebase.auth().onAuthStateChanged(function(user) {
    const sessionStorageUser = getFromLocalStorage('user')
    if ( !user && !sessionStorageUser) {
    // User is not signed in. Redirect to login
    redirectTo(LOGIN)
    }
}, function(error) {
    console.log(error);
});
