$(function(){
    let looking = $('.fa-regular'); // Busca o icone de visibilidade
    looking.click(()=>{ // Detecta o click
        const input = $('input[name=password]');
        const type = input.attr('type');
        
        input.attr('type', type == 'password' ? 'text' : 'password'); // Verifica qual o type que será necessário e já o inclui
        looking.toggleClass('fa-eye'); // Habilita ou desabilita o icone necessário
    })
})

