const saveUserInDB = (user, userExtraData) => {
  const userRef = firebase.database().ref(`users/${user.uid}`);
  return userRef.set(userExtraData);
};

document.addEventListener('DOMContentLoaded', () => {
  const btnRegister = document.getElementById('btn-register');
  const userInfoForm = document.getElementById('personal-info');
  btnRegister.addEventListener('click', () => {
    const userInfo = Object.fromEntries(new FormData(userInfoForm));
    const { email, password } = userInfo;

    firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
      const { user } = response;
      const dataToSave = {
        email,
        displayName: userInfo.displayName,
        photoURL: '',
        phoneNumber: '',
        emailVerified: false,
      };

      saveUserInDB(user, dataToSave).then(() => redirectTo(PROFILE));
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      console.log(errorCode);
    });
  });
});
