const registerForm = document.querySelector(".register");
const deleteForm = document.querySelector(".delete-form");
const cod = document.querySelectorAll("input[name=cod]");
let index, state = null;

let tbody = document.querySelector("tbody");

const inputSub = document.querySelectorAll("form input[type=submit]")
let inputClick, validateInput = null;
let nameFormValue = null;
let codFormValue = null;
let descFormValue = null;
let amtFormValue = null;
let nameDelValue, codDelValue, descDelValue, amtDelValue = null;
let nameList = [];
let codList = [];
let descList = [];
let amtList = [];
let estoqueList = [];
let statusList = [];
let dateList = [];
let estoqueVal = 0

let dados = {
    "name": nameList,
    "cod": codList,
    "desc": descList,
    "amt": amtList,
    "status": statusList,
    "estoque": estoqueList,
    "data": dateList
}

inputSub.forEach((input)=>{ // Identifica qual dos botões foi clicado
    input.addEventListener('click', ()=>{
        inputClick = input.value;
        if(inputClick == "Cadastrar"){
            validateInput = 1;
            registerForm.classList.remove("hidden");
            deleteForm.classList.add("hidden");
            document.querySelector(".title-register").classList.remove("hidden");
            document.querySelector(".title-delete").classList.add("hidden");
        }
        if(inputClick == "Remover peça"){
            validateInput = 0;
            registerForm.classList.add("hidden");
            deleteForm.classList.remove("hidden");
            document.querySelector(".title-register").classList.add("hidden");
            document.querySelector(".title-delete").classList.remove("hidden");
        }
    })
})

registerForm.addEventListener('submit', (e)=>{ // Envia o formulário com todas as validações
    e.preventDefault();
    const isNameValid = checkName();
    const isCodValid = codError();
    const isDescValid = checkDesc();
    const isAmtValid = checkAmt();
    const formData = new FormData(registerForm);
    const inpName = formData.get('name');
    const inpAmt = formData.get('amt');

    nameFormValue = registerForm.name.value;
    codFormValue = registerForm.cod.value;
    descFormValue = registerForm.desc.value;
    amtFormValue = parseInt(registerForm.amt.value);

    if(isNameValid && isCodValid && isDescValid && isAmtValid && validateInput == 1){ // Cadastra peças
        index = dados['cod'].lastIndexOf(codFormValue);
        if(nameFormValue != dados['name'][index] && index != -1){
            document.querySelectorAll(".register .invalid-name")[2].classList.add("err-msg");
            return false;
        } else if(index != -1){
            estoqueVal = dados['estoque'][index] + amtFormValue
            document.querySelectorAll(".register .invalid-name")[2].classList.remove("err-msg");
        } else {
            estoqueVal = amtFormValue;
        }
        nameList.push(nameFormValue);
        codList.push(codFormValue);
        descList.push(descFormValue);
        estoqueList.push(estoqueVal);
        dados['status'].push("entrou");
        dados['amt'].push(amtFormValue);
        registerStock(inpName, inpAmt, 'entrada');
        localStorage.setItem("estoqueDados", JSON.stringify(dados));
        registerForm.reset();
    }
})

deleteForm.addEventListener('submit', (e)=>{ // Evento de envio do formulário delete
    e.preventDefault();
    verifyInfoDelete();
    localStorage.setItem("estoqueDados", JSON.stringify(dados));
})

function verifyInfoDelete(){ // Verifica as informações do formulário de remoção
    codDelValue = deleteForm.cod.value;
    amtDelValue = parseInt(deleteForm.amt.value);

    const invalidCode = document.querySelectorAll(".delete-form .invalid-code");
    const invalidAmt = document.querySelectorAll(".delete-form .invalid-amt");

    let findIndCod = dados["cod"].lastIndexOf(codDelValue);

    if(findIndCod != -1){ // Verifica se o código existe
        invalidCode.forEach((el)=> el.classList.remove("err-msg"));
        if(amtDelValue == ''){ // Adiciona erro se a quantidade for vazia
            invalidAmt.forEach((el)=> el.classList.remove("err-msg"));
            invalidAmt[0].classList.add("err-msg");
        } else if(amtDelValue <= dados['estoque'][findIndCod]){ // Registra os dados na tabela
            invalidAmt.forEach((el)=> el.classList.remove("err-msg"));
            updateTables(amtDelValue, findIndCod);
            dados['status'].push("saiu");
            dados['amt'].push(amtDelValue);
            dados['cod'].push(codDelValue);
            dados['name'].push(dados['name'][findIndCod]);
            registerStock(dados['name'][findIndCod], amtDelValue, 'saida');
            deleteForm.reset();
        } else { // Erro de quantidade inválida
            invalidAmt.forEach((el)=> el.classList.remove("err-msg"));
            invalidAmt[1].classList.add("err-msg");
        }
    } else {
        if(codDelValue == ''){ // Erro se o código for vazio
            invalidCode.forEach((el)=> el.classList.remove("err-msg"));
            invalidCode[0].classList.add("err-msg");
        } else { // Erro se o código não existir
            invalidCode.forEach((el)=> el.classList.remove("err-msg"));
            invalidCode[1].classList.add("err-msg");
        }
        if(amtDelValue == ''){ // Erro se a quantidade for vazia
            invalidAmt.forEach((el)=> el.classList.remove("err-msg"));
            invalidAmt[0].classList.add("err-msg");
        } else { // Erro se a quantidade não pertencer a algum produto existente
            invalidAmt.forEach((el)=> el.classList.remove("err-msg"));
            invalidAmt[2].classList.add("err-msg");
        }
    }
}

function updateTables(amtVal, ind){ // Faz a atualização das tabelas com novas quantidades
    estoqueVal = dados['estoque'][ind] - amtVal;
    dados['estoque'].push(estoqueVal);
}

function checkName(){ // Valida se é um nome válido
    let name = document.querySelector("#name");
    const nameP = document.querySelectorAll(".invalid-name");
    let nameVal = name.value;
    const regexName = /^[a-zA-Z0-9\u00C0-\u00FF]+?\s?[a-zA-Z0-9\u00C0-\u00FF]+?\s?[a-zA-Z0-9\u00C0-\u00FF]+$/g;
    const regexNum = /^[0-9]+?\s?[0-9]+?\s?[0-9]+$/g;

    let regexTest = regexName.test(nameVal);
    let regexTestNum = regexNum.test(nameVal);

    if(regexTest == true){
        if(regexTestNum){
            invalidName(1);
        } else {
            nameP.forEach((nameInd)=>{
                nameInd.classList.remove('err-msg');
                name.classList.remove("invalid-input");
            });
            return true;
        }
    }
    
    if(nameVal == ""){
        invalidName(0);
        return false;
    }

    else if(regexTest == false){
        invalidName(1);
        return false;
    }
}

function invalidName(val){ // Utilizado para add ou rem a classe de err-msg
    const nameP = document.querySelectorAll(".invalid-name");
    let name = document.querySelector("#name");

    nameP.forEach((nameInd)=>{
        nameInd.classList.remove('err-msg');
        name.classList.remove("invalid-input");
    })
    nameP[val].classList.add('err-msg');
    name.classList.add("invalid-input");
}

function codFormat(){ // Utilizado para formatar o campo de cod assim q o usuario sair do campo
    cod.forEach((codInp)=>{
        codInp.addEventListener('blur', ()=>{
            if(codInp.value.length == 8){
                const codeVal = codInp.value.split(""); // Transforma em array de caracteres
                codeVal.splice(4, 0, "-"); // No  indice 4 adiciona o "-"
                codInp.value = `${codeVal.join("")}`; // Constroi o array em string
            }
        })
    })

}
codFormat();

function codError(){ // Adiciona ou remove erros do input código
    const regexCod = /^[0-9]+$/g;
    const invalidRegex = /[a-zA-Z\u00C0-\u00FF]+/;
    const codInp = document.querySelectorAll(".invalid-code");
    let codVerify = cod[0].value;

    if(!regexCod.test(codVerify) && codVerify[4] != "-"){
        if(codVerify.length == 0){
            removeErr(codInp);
            codInp[0].classList.add("err-msg");
            cod[0].classList.add("invalid-input");
            return false;
        } else {
            removeErr(codInp);
            codInp[1].classList.add("err-msg");
            cod[0].classList.add("invalid-input");
            return false;
        }
    } else {
        if(codVerify.match(invalidRegex)){
            removeErr(codInp);
            codInp[2].classList.remove("err-msg");
            codInp[1].classList.add("err-msg");
            cod[0].classList.add("invalid-input");
            return false;
        }
        if(codVerify.length < 8){
            codInp[0].classList.remove("err-msg");
            codInp[1].classList.remove("err-msg");
            codInp[2].classList.add("err-msg");
            cod[0].classList.add("invalid-input");
            return false;
        } else {
            removeErr(codInp);
            return true;
        }
    }
}

function removeErr(codInp){ // Remove erros do input código
    codInp.forEach((code)=>{
        code.classList.remove("err-msg");
    })
    cod[0].classList.remove("invalid-input");
}

function checkDesc(){ // Checa se é uma descrição sem caracteres
    const descInp = document.querySelector("#desc");
    const regexDesc = /^[a-zA-Z\u00C0-\u00FF.,-\s]+$/g;
    let validate = regexDesc.test(descInp.value);
    const pInvalid = document.querySelector(".invalid-desc");

    if(validate == false){
        if(descInp.value != ""){
            pInvalid.classList.add('err-msg');
            descInp.classList.add("invalid-input");
            return false;
        } else {
            pInvalid.classList.remove('err-msg');
            descInp.classList.remove("invalid-input");
            return true;
        }

    } else {
        pInvalid.classList.remove('err-msg');
        descInp.classList.remove("invalid-input");
        return true;
    }

}

function checkAmt(){ // Checa se o input amount está vazio ou não
    const amtInp = document.getElementById("amtReg");
    const pInvalid = document.querySelectorAll(".register .invalid-amt");
    if(amtInp.value == ""){ // Checa se está vazio
        pInvalid.forEach(pInd => {
            pInd.classList.remove("err-msg");
        })
        pInvalid[0].classList.add("err-msg");
        amtInp.classList.add("invalid-input");
        return false;
    }
    if(amtInp.value == 0){ // Checa se é igual a 0
        pInvalid.forEach(pInd => {
            pInd.classList.remove("err-msg");
        })
        pInvalid[1].classList.add("err-msg");
        amtInp.classList.add("invalid-input");
        return false;
    } else { // Caso contrário, remove os erros
        pInvalid.forEach(pInd => {
            pInd.classList.remove("err-msg");
        })
        amtInp.classList.remove("invalid-input");
        return true;
    }
}

function registerStock(name, amt, status){ // Identifica se é entrada ou saida de dados e registra na tabela os dados
    let date = new Date;
    let day = date.getDate();
    let month = (date.getMonth() + 1);
    let monthFormat = month < 10 ? '0' + month : month.toString();
    let dayFormat = day < 10 ? '0' + day : day;
    let year = date.getFullYear();
    let color = '#32C505'
    let dataFormat = `${dayFormat}/${monthFormat}/${year}`;
    dados['data'].push(dataFormat);
    if(status == 'saida'){
        tbody.innerHTML += `
        <tr style="background-color: rgba(255, 0, 0, 0.15);">
            <td>${name}</td>
            <td>${amt}</td>
            <td class="status">
                <i class="fa-solid fa-circle" style="color: ${color};"></i>
                <p class="em-estoque">Em estoque</p>    
            </td>
            <td>${dataFormat}</td>
        </tr>`
    }
    if(status == 'entrada'){
        tbody.innerHTML += `
        <tr style="background-color: rgba(0, 255, 0, 0.25);">
            <td>${name}</td>
            <td>${amt}</td>
            <td class="status">
                <i class="fa-solid fa-circle" style="color: ${color};"></i>
                <p class="em-estoque">Em estoque</p>    
            </td>
            <td>${dataFormat}</td>
        </tr>`
    }

}