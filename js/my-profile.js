/* global firebase renderIn hideSpinner LOGIN REGISTER */

const updateUserData = (data, cb) => {
  // Chequea si hay algun usuario logueado.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userRef = firebase.database().ref(`users/${user.uid}`);
      return userRef.update(data, cb);
    }
  }, (error) => {
    console.log(error);
  });
};

const onUserData = (callback) => {
  // Chequea si hay algun usuario logueado.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
        callback(snapshot.val());
      });
    } else {
      /* Usuario no logueado, mostrar mensaje de esto y boton de ir al login o a crear cuenta */
      const main = document.getElementById('main');
      main.classList.add('main-no-user');
      main.innerHTML = `
      <img src="/img/login.svg" height="200">
        <h1 class="main-no-user__title">Inicia sesión para ver esto</h1>
        <a href="${LOGIN}" class="btn btn-primary btn-iniciar-sesion" >Ir a iniciar sesión</a>
        <p class="main-no-user__footer">¿No tenés cuenta? <a href="${REGISTER}">Registrate</a></p>
      `;
      hideSpinner();
    }
  }, (error) => {
    console.log(error);
  });
};

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener('DOMContentLoaded', () => {
  const inputImage = document.getElementById('profile-image-input');
  const profileImage = document.getElementById('profile-image');
  const inputName = document.getElementById('name');
  const inputAge = document.getElementById('age');
  const inputEmail = document.getElementById('email');
  const inputPhone = document.getElementById('phoneNumber');
  const userResumeData = document.getElementById('user-resume-data');

  const inputDepartamento = document.getElementById('inputDepartamento');
  const inputCiudad = document.getElementById('inputCiudad');
  const inputCalle = document.getElementById('inputCalle');
  const inputNumeroPuerta = document.getElementById('inputNumeroPuerta');
  const inputObservaciones = document.getElementById('inputObservaciones');

  inputImage.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = reader.result;
      /*
        Automaticamente cuando el usuario selecciona una nueva imagen,
        esta se sube a la base de datos
      */
      updateUserData({ photoURL: image }, () => console.log('Image loaded'));
    };

    reader.readAsDataURL(inputImage.files[0]);
  });

  onUserData((userData) => {
    if (userData) {
      const image = userData.photoURL ? userData.photoURL : `${HOME}/img/profile-example.png`;
      inputName.setAttribute('value', userData.displayName);
      inputAge.setAttribute('value', userData.age);
      inputPhone.setAttribute('value', userData.phoneNumber);
      inputEmail.setAttribute('value', userData.email);
      profileImage.setAttribute('src', image);

      inputDepartamento.value = userData.departamento ? userData.departamento : 'Montevideo';
      inputCiudad.setAttribute('value', userData.ciudad ? userData.ciudad : '');
      inputCalle.setAttribute('value', userData.calle ? userData.calle : '');
      inputNumeroPuerta.setAttribute('value', userData.numero ? userData.numero : '');
      inputObservaciones.setAttribute('value', userData.observaciones ? userData.observaciones : '');

      renderIn(userResumeData, true)(generateUserResumeHTML(userData.displayName, userData.email));
    }

    hideSpinner();
  });

  const userInfoForm = document.getElementById('personal-info');
  /* Boton de guardar cambios */
  const saveChanges = document.getElementById('save-changes');

  saveChanges.addEventListener('click', () => {
    const userInfo = Object.fromEntries(new FormData(userInfoForm));
    updateUserData(userInfo);
    saveChanges.disabled = true;
  });

  /*
    Cuando se produce un cambio en cualquiera de los input,
    se activa el boton de guardar cambios
  */
  userInfoForm.addEventListener('input', () => {
    saveChanges.disabled = false;
  });
});
