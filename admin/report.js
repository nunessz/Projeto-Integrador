const getData = localStorage.getItem("estoqueDados");
const dados = JSON.parse(getData);

if(getData != null){
    const tableCont = document.querySelector(".table-container table");
    const totalProducts = dados.status.length;

    const lines = [
        [],
        [],
        [],
        [],
        [],
        []
    ];
    
    for(let i = 0; i < totalProducts; i++){
        let tipo = dados.status[i] == 'entrou' ? 'ENTRADA' : 'SAÍDA';
        let classTipo = dados.status[i] == 'entrou' ? 'entrada' : 'saida';
        let tipoMov = tipo == 'ENTRADA' ? 'Entrou' : 'Saiu';
    
        lines[0].push(`<th class="${classTipo}">${tipo}</th>`);
        lines[1].push(`<td>${dados.name[i]}</td>`);
        lines[2].push(`<td>Código: <br>${dados.cod[i]}</td>`);
        lines[3].push(`<td>Estoque: <br>${dados.estoque[i]}</td>`);
        lines[4].push(`<td>${tipoMov}: <br>${dados.amt[i]}</td>`);
        lines[5].push(`<td>${dados.data[i]}</td>`);
    }
    
    tableCont.innerHTML = `
        <thead>
            <tr>${lines[0].join('')}</tr>
        </thead>
        <tbody>
            <tr>${lines[1].join('')}</tr>
            <tr>${lines[2].join('')}</tr>
            <tr>${lines[3].join('')}</tr>
            <tr>${lines[4].join('')}</tr>
            <tr>${lines[5].join('')}</tr>
        </tbody>`;
} else {
    const container = document.querySelector(".section-container");
    container.innerHTML = `<p class="nodata">Sem dados para criar o relatório! <br>Volte a página do painel para cadastrar peças</p>`
}