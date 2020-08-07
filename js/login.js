//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.


document.addEventListener("DOMContentLoaded", function (e) {

    const formulario = document.getElementById('formulario-login')

    formulario.addEventListener('submit', (e)=> {
        e.preventDefault()
        const formData = new FormData(formulario)
        const userObj = Object.fromEntries(formData.entries())
        sessionStorage.setItem('user', JSON.stringify(userObj))
        window.location = '/'
    })

   


});

//TODO
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:

    // When user are loged, redirect to the home 
    saveSession(googleUser.getBasicProfile())
    window.location = 'https://viejocadillac.github.io/obligatorio-jap-2020'
    /*
    var profile = googleUser.getBasicProfile();
    console.log(googleUser)
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    */
}

function saveSession(user){
    sessionStorage.setItem('user', JSON.stringify(user))
}


