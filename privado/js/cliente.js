//Esse arquivo será utilizado para armazenar código javascript
//que permitirá a comunicação com o backend.
const formCliente = document.getElementById('formCliente');
//passando uma função como parâmetro para outra função
//nesse momento é errado usar a seguinte sintaxe: validarCampos()
//só quando a submissão dos dados acontecer é que a função validarCampos será executada.
formCliente.onsubmit = validarCampos;
const enderecoAPI = 'http://localhost:4000/clientes';
buscarTodosClientes();

var motivoAcao = "CADASTRAR";

function gravarCliente(){
    const objetoCliente = {
        cpf: document.getElementById('cpf').value,
        nome: document.getElementById('nome').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    }

    fetch(enderecoAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoCliente)
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirMensagem(respostaAPI.mensagem, 'green');
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });

}

function selecionarCliente(cpf, nome, endereco, cidade, estado, cep, motivo) {

    document.getElementById('cpf').value = cpf;
    document.getElementById('nome').value = nome;
    document.getElementById('endereco').value = endereco;
    document.getElementById('cidade').value = cidade;
    document.getElementById('estado').value = estado;
    document.getElementById('cep').value = cep;

    motivoAcao = motivo;
    const botaoConfirmacao = document.getElementById('botaoConfirmacao');
    if (motivoAcao == 'EDITAR') {
        botaoConfirmacao.innerHTML = 'EDITAR';
    }
    else if (motivoAcao == 'EXCLUIR') {
        botaoConfirmacao.innerHTML = 'EXCLUIR';
    }


}

function excluirCliente(){

    fetch(enderecoAPI, {
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cpf: document.getElementById('cpf').value})
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirMensagem(respostaAPI.mensagem, 'green');
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });
}

function atualizarCliente(){

    const objetoCliente = {
        cpf: document.getElementById('cpf').value,
        nome: document.getElementById('nome').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado'),
        cep: document.getElementById('cep').value
    }

    fetch(enderecoAPI, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoCliente)
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirMensagem(respostaAPI.mensagem, 'green');
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });

}

function buscarTodosClientes(){
    fetch(enderecoAPI, {method:'GET'})
    .then((resposta) => {
        return resposta.json();
    })
    .then((respostaAPI) => {
        if (respostaAPI.status == true) {
            exibirTabelaClientes(respostaAPI.listaClientes);
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    })
    .catch((erro) => {
        exibirMensagem(erro, '#D2691E');
    });
}

function validarCampos(evento){

    const cpf      = document.getElementById('cpf').value;
    const nome     = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const cidade   = document.getElementById('cidade').value;
    const estado   = document.getElementById('estado').value;
    const cep      = document.getElementById('cep').value;

    //impedem que o navegador continue o processo de submissão do formulário
    evento.stopPropagation();
    evento.preventDefault();

    if (cpf && nome && endereco && cidade && estado && cep) {
        if (motivoAcao == "CADASTRAR"){
            gravarCliente();
        }
        else if (motivoAcao == "EDITAR"){
            atualizarCliente();
            motivoAcao = "CADASTRAR";
        }
        else if (motivoAcao == "EXCLUIR"){
            excluirCliente();
            motivoAcao = "CADASTRAR";
        }
        
        formCliente.reset();
        buscarTodosClientes();
        return true;
    }
    else{
        exibirMensagem('Por favor, preencha todos os campos do formulário.');
        return false;
    }
}


function exibirMensagem(mensagem, cor = 'black') {
    const divMensagem = document.getElementById('mensagem');
    divMensagem.innerHTML = "<p style='color: " + cor + ";'>" + mensagem + "</p>";
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
}


function exibirTabelaClientes(listaClientes){
    if (listaClientes.length > 0) {
        const espacoTabela = document.getElementById('containerTabela');
        const tabela = document.createElement('table');
        tabela.classList="table table-striped table-hover";
        const cabecalho = document.createElement('thead');
        cabecalho.innerHTML = `
            <tr>
                <th>CPF</th>
                <th>NOME</th>
                <th>ENDERECO</th>
                <th>CIDADE</th>
                <th>ESTADO</th>
                <th>CEP</th>
                <th>Ações</th>
            </tr>
        `;
        const corpo = document.createElement('tbody');
        for (const cliente of listaClientes) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${cliente.cpf}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.endereco}</td>
                <td>${cliente.cidade}</td>
                <td>${cliente.estado}</td>
                <td>${cliente.cep}</td>
                <td>
                    <button onclick="selecionarCliente('${cliente.cpf}','${cliente.nome}','${cliente.endereco}','${cliente.cidade}','${cliente.estado}','${cliente.cep}','EDITAR')">Alterar</button>
                    <button onclick="selecionarCliente('${cliente.cpf}','${cliente.nome}','${cliente.endereco}','${cliente.cidade}','${cliente.estado}','${cliente.cep}','EXCLUIR')">Excluir</button>
                </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(cabecalho);
        tabela.appendChild(corpo);
        espacoTabela.innerHTML="";
        espacoTabela.appendChild(tabela);
    }
    else{
        exibirMensagem('Nenhum cliente encontrado.');
    }
}