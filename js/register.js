const saveUserInDB = (user, userExtraData) => {
  const userRef = firebase.database().ref(`users/${user.uid}`);
  return userRef.set(userExtraData);
};

document.addEventListener('DOMContentLoaded', () => {
  const btnRegister = document.getElementById('btn-register');
  const userInfoForm = document.getElementById('personal-info');
  btnRegister.addEventListener('click', () => {
    const userInfo = Object.fromEntries(new FormData(userInfoForm));
    console.log(userInfo)
    firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      console.log(errorCode);
    });
  });
});
