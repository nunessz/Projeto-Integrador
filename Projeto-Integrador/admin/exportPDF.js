let grafico = null;

function initialize(){
    const estoqueDados = localStorage.getItem("estoqueDados");
    if(estoqueDados){
        let input = 0;
        let output = 0;
        const select = document.querySelector("#typeGraphic");
        const selected = select.value;
        const data = JSON.parse(estoqueDados);

        if(selected != 'mov' && selected != 'stock'){
            alert("Insira um tipo de relatório!");
            return false;
        } else{
            function corAleatoria() {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgba(${r}, ${g}, ${b}, 0.7)`;
        }

        if(grafico){
            grafico.destroy();
        }

        createPDF();
        async function createPDF() {
            // Variáveis para criação do gráfico
            const canvas = document.getElementById('myChart');
            const ctx = canvas.getContext('2d');
            const codigosGetLabel = [];
            const codigosGetInfo = [];

            canvas.width = 500;
            canvas.height = 300;

            let labels = [];
            let dataGraphic = [];
            let bgColor = [];

            for(let i = 0; i < data.status.length; i++){ // Lógica para relatório de entradas e saídas gerais dos produtos
                if(data.status[i] == 'entrou'){
                    input += data.amt[i];
                } else {
                    output += data.amt[i];
                }
            }

            if(selected == 'stock'){ // Configurações para o relatório de estoque

                data.cod.forEach((item, i)=>{
                    const searchGetLabel = data.cod.lastIndexOf(item);
                    if(codigosGetLabel.indexOf(searchGetLabel) == -1){
                        codigosGetLabel.push(searchGetLabel);
                        labels.push(data.name[i]);
                        dataGraphic.push(data.estoque[i]);
                        bgColor.push(corAleatoria());
                    }
                })
            } else {
                labels = ['Entrada Geral', 'Saída Geral'];
                dataGraphic = [input, output];
                bgColor = ['#32C505', '#FF0000'];
            }

            // Cria o gráfico
            grafico = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataGraphic,
                        backgroundColor: bgColor
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    plugins: {
                        legend: { 
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });

            // Aguarda a renderização do gráfico
            await new Promise(resolve => setTimeout(resolve, 300));

            // Converte canvas para imagem
            const imagemBase64 = canvas.toDataURL('image/png');

            // Cria PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            let yPosition = 150; // Posição vertical inicial
            
            if(selected == 'mov'){ // Formatando o relatório com base na opção de movimentações gerais
                pdf.setFontSize(18);
                pdf.text("Relatório de Movimentação Geral com Gráfico", 40, 10);
                pdf.addImage(imagemBase64, 'PNG', 10, 20, 180, 120);
                pdf.setFontSize(12);
                pdf.text(`Entrada Geral - Quantidade: ${input}`, 10, yPosition); // Adiciona linha com os dados
                yPosition += 10; // Move para a próxima linha
                pdf.text(`Saída Geral - Quantidade: ${output}`, 10, yPosition);
            } else { // Formatando o relatório com base na opção de estoque de cada produto
                pdf.setFontSize(18);
                pdf.text("Relatório de Estoque de Peças com Gráfico", 40, 10);
                pdf.addImage(imagemBase64, 'PNG', 10, 20, 180, 120);
                pdf.setFontSize(12);
                data.cod.forEach(item =>{ // Procura qual o estoque mais recente do produto
                    const searchGetInfo = data.cod.lastIndexOf(item);
                    if(codigosGetInfo.indexOf(searchGetInfo) == -1){
                        codigosGetInfo.push(searchGetInfo);
                    }
                    
                })
                for(let i = 0; i < codigosGetInfo.length; i++){
                    pdf.text(`Peça: ${data.name[codigosGetInfo[i]]} - Estoque: ${data.estoque[codigosGetInfo[i]]}`, 10, yPosition);
                    const descricao = data.desc[codigosGetInfo[i]] == '' || data.desc[codigosGetInfo[i]] == undefined ? 'Não possui descrição' : data.desc[codigosGetInfo[i]];

                    yPosition += 5;
                    pdf.text(`Descrição: ${descricao}`, 10, yPosition);

                    yPosition += 10;
                }
            }

            // Salva PDF
            pdf.save("relatório.pdf");

        }
        }

    }
}