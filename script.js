$(document).ready(function () {
    
    let numMudancas = 0
    let estadoInicial = ""
    let estadosIntermediarios = []
    let estadosFinais = []

    let inp = ""

    let tabela = []

    const vazio = "VAZIO"

    //Adiciona entrada para transição
    function adicionaMudanca () {
        
        $("#mudanca").append(
            `<div id="div-transicao-${numMudancas}">
            <select name="" id="transicao-${numMudancas*2}">
                ${inp}
            </select>
            <input type="text" name="" id="alfabeto-${numMudancas}" placeholder="Alfabeto">
            <select name="" id="transicao-${numMudancas*2 + 1}">
                ${inp}
            </select> <button class="btn-del" id="btn-del-${numMudancas}">-</button>
        </div>`
        );
        numMudancas += 1
    }

    //Retira entrada de transição
    $(document).on('click', '.btn-del', function(e) {
        let id = e.target.id.split("btn-del-")[1]
        $(`#div-transicao-${id}`).remove();

    });

    //Atualiza relação de estados inicial, intemediários e finais
    $("#ok").click(function (e) { 
        e.preventDefault();
        estadoInicial = $("#e-inicial").val().split(" ")[0]
        estadosIntermediarios = $("#e-inter").val().split(" ")
        estadosFinais = $("#e-finais").val().split(" ")

        numMudancas = 0

        let vet = [estadoInicial]

        estadosIntermediarios.forEach(element => {
            if(element != "" && !vet.includes(element))
                vet.push(element)
        });

        estadosFinais.forEach(element => {
            if(!vet.includes(element))
                vet.push(element)
        });

        inp = ""
        vet.forEach(element => {
            inp += `<option value="${element}">${element}</option>`
        });


        $("#mudanca").html(
            `<h6>Mudança de Estados</h6>`
        );
        adicionaMudanca()
        $("#container").removeClass()
    });

    //Busca entradas aceitas em uma determinada transição e retorna o alfabto gerado por elas
    function geraAlfabeto(id) {
        let e = $(`#${id}`).val().split(" ")
        let alfabeto = []
        e.forEach(element => {
            const teste = element.split("..")
            if(teste.length == 1){
                alfabeto.push(element)
            }else{
                if (isNaN(teste[0])){
                    let letras = " a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W Y X Z "
                    letras = letras.split(" " + teste[0] + " ")[1]
                    letras = letras.split(" " + teste[1] + " ")[0]
                    letras = letras.split(" ")
                    letras.unshift(teste[0])
                    letras.push(teste[1])
                    alfabeto = alfabeto.concat(letras)

                }else{
                    let e0 = parseInt(teste[0], 10)
                    let e1 = parseInt(teste[1], 10)
                    for (let i = e0; i <= e1; i++){
                        alfabeto.push(i)
                    }
                }
            }
        });
        return alfabeto
    }

    //Gera a tabela de transições(tabela do automato)
    $("#gerar").click(function (e) { 
        e.preventDefault();

        let elem = $("div[id^=div-transicao-]")  
        let trans = elem.find("select[id^=transicao-]")
        let alfabetos = elem.find("input[id^=alfabeto-]")
        tabela = []

        for (let i = 0; i < trans.length / 2; i++) {
            const t1 = trans[i*2].id
            const t2 = trans[i*2 + 1].id
            const a = alfabetos[i].id
            tabela.push([$(`#${t1}`).val(), $(`#${t2}`).val(), geraAlfabeto(a)])
        }
        
        console.log(tabela);

        $("#div-sentenca").removeClass()
        
    });

    //Evento para dicionar mais transições
    $('#btn-estados').click(function (e) { 
        e.preventDefault();
        adicionaMudanca()
    });


    //Realiza as transições de um estado lendo um caractere
    function realizaTransicao(e, c) {
        let novosEstados = []
        tabela.forEach(l => {
            if(e == l[0]){
                const i = l[2].values();
                for (let element of i) {
                    if (element == c){
                        novosEstados.push(l[1])
                        break;
                    }
                        
                }
            }
        });
        return novosEstados
    }

    //Realiza as transições de um conjunto de estados lendo um caractere
    function mudaEstado(e, c) {
        let novosEstados = []
        e.forEach(estado => {
            novosEstados = novosEstados.concat(realizaTransicao(estado, c))
        });
        return novosEstados
    }

    //Realiza as transições vazias de um conjunto de estados
    function e_closure(e) {
        let verificador = mudaEstado(e, vazio)
        if(verificador.length != 0){
            return e.concat((e_closure(verificador)))
        }
        return e
    }

    //Pega a string e alimenta o automato com cada caractere da string e verifica aceitação
    $("#verifica").click(function (e) { 
        e.preventDefault();
        e.preventDefault();
        const sentenca = $("#sentenca").val()
        let estadoAtual = [estadoInicial]
        let result = ""
        estadoAtual = e_closure(estadoAtual)
        for (let i = 0; i < sentenca.length; i++) {
            estadoAtual = mudaEstado(estadoAtual, sentenca[i]);
            estadoAtual = e_closure(estadoAtual)
        }
        console.log(estadoAtual);

        estadoAtual.forEach(estado => {
            const e = estadosFinais.length
            for (let i = 0; i < estadosFinais.length; i++) {
                if(estadosFinais[i] == estado){
                    if(result == ''){
                        result = "ACEITA EM "
                    }
                    result += " " + estado
                }
                
            }
            
            
        });

        if(result == ""){
            result = "NÃO ACEITA"
        }

        $("#result").html(result)
    });

});