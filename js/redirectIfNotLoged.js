/* global firebase, getFromLocalStorage, redirectTo, LOGIN */

// Chequea si hay algun usuario logueado. Si no lo hay redirige a LOGIN
firebase.auth().onAuthStateChanged((user) => {
  const localStorageUser = getFromLocalStorage('user');
  if (!user && !localStorageUser) {
    // User is not signed in. Redirect to login
    redirectTo(LOGIN);
  }
}, (error) => {
  console.log(error);
});
