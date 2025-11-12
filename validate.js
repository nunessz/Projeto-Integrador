const form = document.querySelector('form');
const admin = 'admin';
const usuario = 'usuario';
let valid = false;

form.addEventListener('submit',(e)=> {
    e.preventDefault();
    Validate();
})

function Validate(){
    const user = document.querySelector("#user").value;
    const pass = document.querySelector("#password").value;

    if(user == admin){
        if(pass == admin){
            document.cookie = "role=admin";
            valid = true;
            document.location.href = "admin/admin-panel.html";
        } else {
            valid = false;
        }
    }  
    
    else if(user == usuario){
        if(pass == usuario){
            document.cookie = "role=user";
            valid = true;
            document.location.href = "admin/panel.html";
        } else {
            valid = false;
        }
    }

    else {
        valid = false;
    }

    Invalid(valid);
}

function Invalid(valid){
    const error = document.querySelector(".error-inputs");
    
    if(valid == false){
        error.style.display = "flex";
    } else {
        error.style.display = "none";
    }
}

function checkCookie(){
    document.cookie = "role=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
