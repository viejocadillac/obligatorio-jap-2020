
document.addEventListener('DOMContentLoaded', () => {
  const btnRegister = document.getElementById('btn-register');
  const userInfoForm = document.getElementById('personal-info');
  btnRegister.addEventListener('click', () => {
    const userInfo = Object.fromEntries(new FormData(userInfoForm));
    console.log(userInfo)
    firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage)
      // ...
    });
  });
});
