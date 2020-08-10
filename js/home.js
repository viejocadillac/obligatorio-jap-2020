firebase.auth().onAuthStateChanged(function(user) {
  if ( user ) {
  // User is signed in.
  document.getElementById('opciones-usuario').innerHTML = `<option value="user" selected disabled>${user.displayName}</option>`
  document.getElementById('opciones-usuario').innerHTML += '<option name="logout" value="logout" >Cerrar Sesion</option>'
  } else {
    document.getElementById('opciones-usuario').innerHTML = '<option value="user" selected disabled>Anonimo</option>'
    document.getElementById('opciones-usuario').innerHTML += '<option name="signin" value="signin" disabled>Crearme una cuenta</option>'

  }
}, function(error) {
  console.log(error);
});