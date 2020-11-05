/* global firebase, redirectTo, PROFILE, getFormDataObject hideSpinner */
const saveUserInDB = (user, userExtraData) => {
  const userRef = firebase.database().ref(`users/${user.uid}`);
  return userRef.set(userExtraData);
};

document.addEventListener('DOMContentLoaded', () => {
  hideSpinner();
  const btnRegister = document.getElementById('btn-register');
  const userInfoForm = document.getElementById('personal-info');
  btnRegister.addEventListener('click', () => {
    const userInfo = getFormDataObject(userInfoForm);
    const { email, password, displayName } = userInfo;

    firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
      const { user } = response;
      const initData = {
        email,
        displayName,
        photoURL: '',
        phoneNumber: '',
        emailVerified: false,
      };

      saveUserInDB(user, initData).then(() => redirectTo(PROFILE));
    }).catch(() => {
      // TODO Manejar errores
    });
  });
});
