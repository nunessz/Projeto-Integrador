WelcomeUser();

function WelcomeUser(){
    const regexUser = /^role=user$/;
    const regexAdmin = /^role=admin$/;
    let content = document.querySelector('.nav-bar ul').lastElementChild;
    const regexBasic = /role=[a-z]+/;

    setInterval(()=>{ // Valida se o usuário possui um cookie de sessão valido a cada segundo
        let cookie = document.cookie;
        const roleSearch = cookie.match(regexBasic);
        const role = roleSearch ? roleSearch[0] : "Sem autorização!";

        if(role == 'Sem autorização!'){
            document.location.href = '../login-admin.html';
        }
        if(regexUser.test(cookie)) {
            content.innerHTML = `Olá, usuário colaborador!`;
        }
        if(regexAdmin.test(cookie)){
            content.innerHTML = `Olá, usuário admin!`;
        }
    }, 500);
}