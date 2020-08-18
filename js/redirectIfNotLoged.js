firebase.auth().onAuthStateChanged(function (user) {
    const localStorageUser = getFromLocalStorage('user')
    if (!user && !localStorageUser) {
        // User is not signed in. Redirect to login
        redirectTo(LOGIN)
    }
}, function (error) {
    console.log(error);
});