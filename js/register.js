/* global
  firebase,
  redirectTo,
  PROFILE,
  getFormDataObject,
  hideSpinner,
  createStateButtonHandler,
  validateAll,
  renderIn,
  getFormErrorText
*/
const saveUserInDB = (user, userExtraData) => {
  const userRef = firebase.database().ref(`users/${user.uid}`);
  return userRef.set(userExtraData);
};

document.addEventListener('DOMContentLoaded', () => {
  hideSpinner();
  const btnRegister = document.getElementById('btn-register');
  const userInfoForm = document.getElementById('personal-info');
  const btnSendFormIcon = document.getElementById('btn-send-form-icon');
  const errorContainer = document.getElementById('register-error');

  // Se crea el manejador de estado del boton de registro
  const buttonStateHandler = createStateButtonHandler(
    btnRegister,
    btnSendFormIcon,
    'fa-spinner',
    'fa-sign-in-alt',
  );

  btnRegister.addEventListener('click', () => {
    if (validateAll(userInfoForm)) {
      buttonStateHandler.start();

      const userInfo = getFormDataObject(userInfoForm);
      const { email, password, displayName } = userInfo;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const { user } = response;
          const initData = {
            email,
            displayName,
            photoURL: '',
            phoneNumber: '',
            emailVerified: false,
          };

          saveUserInDB(user, initData).then(() => redirectTo(PROFILE));
        })
        .catch((error) => renderIn(errorContainer)(getFormErrorText(error.code)))
        .finally(() => buttonStateHandler.stop());
    }
  });
});
