// Resgata os itens que foram adicionados na sacola na página principal
const filmes = localStorage.getItem('filmes');
const filmesAdicionadosNaSacola = JSON.parse(filmes);

const cupom = localStorage.getItem('cupom');
// Verifica se a pessoa informou o cupom válido na página principal
if (cupom === 'HTMLNAOELINGUAGEM') {
    const inputCupom = document.querySelector('.bag .container-bag-input input');
    inputCupom.value = cupom;
}

/** Adiciona os filmes que foram adicionados na sacola na página principal */ 
const addFilmeNaSacola = (filme) => {
    const conteudoSacolaVazia = document.querySelector('.bag .empty-bag');
    conteudoSacolaVazia.setAttribute('hidden', '');

    const itemSacola = document.querySelector('.bag .films-bag');

    const li = document.createElement('li');
    itemSacola.append(li);

    const conteudoSobreFilme = document.createElement('div');
    conteudoSobreFilme.classList.add('films-bag-content');

    const minePoster = document.createElement('img');
    minePoster.setAttribute('src', filme.urlPoster);
    minePoster.classList.add('little-poster');

    conteudoSobreFilme.append(minePoster);        
    li.append(conteudoSobreFilme);

    const containerNomePreco = document.createElement('div');
    containerNomePreco.classList.add('name-price');

    const nomeFilme = document.createElement('span');
    nomeFilme.innerText = filme.nomeFilme;
    
    const precoFilme = document.createElement('span');
    precoFilme.innerText = `R$ ${Number(filme.valor.replace(',', '.')).toFixed(2)}`;

    containerNomePreco.append(nomeFilme);
    containerNomePreco.append(precoFilme);

    conteudoSobreFilme.append(containerNomePreco);

    const conteudoAdicionar = document.createElement('div');
    conteudoAdicionar.classList.add('content-add');

    const iconeAdicionar = document.createElement('img');
    iconeAdicionar.setAttribute('src', '/images/bag/add.png');
    iconeAdicionar.classList.add('add');

    li.id = filme.id; //Adiciona id no container do filme que gostaria de mudar a quantidade na sacola
    // Adiciona o evento de click no icone de adicionar quantidade
    iconeAdicionar.addEventListener('click', () => {
        const idFilme = Number(li.id)
        filmesAdicionadosNaSacola.forEach((item, i) => {
            if (item.id === idFilme) {
                filmesAdicionadosNaSacola[i].quantidade++
                atualizarItemNaSacola(filmesAdicionadosNaSacola[i])
            }
        })       
    })

    const quantidadeFilme = document.createElement('span');
    quantidadeFilme.classList.add('amount');
    quantidadeFilme.innerText = filme.quantidade;

    const iconeDeletar = document.createElement('img');
    iconeDeletar.setAttribute('src', '/images/bag/delete.png');
    iconeDeletar.classList.add('delete');

    // Adiciona o evento de click no icone de deletar, para diminuir a quantidade ou excluir o item da sacola
    iconeDeletar.addEventListener('click', () => {
        const idFilme = Number(li.id);

        filmesAdicionadosNaSacola.forEach((item, i) => {
            if (item.id === idFilme) {
                filmesAdicionadosNaSacola[i].quantidade--
                if (filmesAdicionadosNaSacola[i].quantidade === 0) {
                    const filmesDaSacola = document.querySelectorAll('.films-bag li');
                    if(filmesDaSacola.length === 1) {
                        // Caso só exista um filme na sacola, ao ser removido, volta o layout da sacola vazia 
                        document.querySelector('.empty-bag').toggleAttribute('hidden');
                        localStorage.clear();
                    }
                    // Remove o filme da sacola e da lista de filmes adicionados na sacola
                    filmesDaSacola[i].remove();
                    filmesAdicionadosNaSacola.splice(i, 1);
                }                
                atualizarItemNaSacola(filmesAdicionadosNaSacola[i]);                
            }
        })       
    })
    
    conteudoAdicionar.append(iconeAdicionar);
    conteudoAdicionar.append(quantidadeFilme);
    conteudoAdicionar.append(iconeDeletar);

    li.append(conteudoAdicionar);
}

// Se existir conteudo na lista de filmes resgatada, adiciona sacola
if (filmesAdicionadosNaSacola !== null) {
    for(filme of filmesAdicionadosNaSacola) {
        addFilmeNaSacola(filme);
    }
};

/** Atualiza a quantidade de um filme em específico */
const atualizarItemNaSacola = (filme) => {
    if (filme) {
        const filmesNoCarrinho = document.querySelectorAll('.films-bag');
        const posicao = filmesAdicionadosNaSacola.indexOf(filme);
        document.querySelectorAll('.films-bag .amount')[posicao].innerText = filme.quantidade;
    }
    totalDoCarrinho(filmesAdicionadosNaSacola);
}

/** Calcula o subtotal em compras do carrinho */
const totalDoCarrinho = (listaDeFilmeDoCarrinho) => {
    const valorSubtotal = document.querySelector('.bag .subtotal .value');

    let subtotal = 0;
    for(filme of filmesAdicionadosNaSacola) {
        subtotal += Number(filme.valor.replace(',', '.')) * filme.quantidade;
    }
    valorSubtotal.innerText = `R$ ${subtotal.toFixed(2)}`;

    const botaoVoltar = document.querySelector('.bag .initial-page');
    if(subtotal === 0) botaoVoltar.toggleAttribute('hidden');
}
//Verifica se existe filmes na sacola e informa o subtotal da compra
if(filmesAdicionadosNaSacola) totalDoCarrinho(filmesAdicionadosNaSacola);
else document.querySelector('.bag .initial-page').toggleAttribute('hidden')

/** Insere o botão de confirmar dados para efetuar o pagamento */
const calcularSubTotal = () => {
    const div = document.createElement('div');
    div.classList.add('confirm-bag');

    const textoBotao = document.createElement('span');
    textoBotao.innerText = 'Confirme seus dados';

    const totalDoCarrinho = document.createElement('span');
    totalDoCarrinho.classList.add('total-price');

    div.append(textoBotao);
    div.append(totalDoCarrinho);
    container.append(div);
}

let inputsPreenchido = 0;
// Tratando dados informados no formulário
// Adiciona evento blur. Quando o input do nome completo perder o focus, o nome será formatado
const inputNomeCompleto = document.querySelector('form .name');
inputNomeCompleto.addEventListener('blur', () => {
    if(inputNomeCompleto.value === '') return;
    formatar(inputNomeCompleto);
}) 

// Adiciona evento blur. Quando o input do telefone perder o focus, o número será formatado
const inputTelefone = document.querySelector('form .tel');
inputTelefone.addEventListener('blur', event => {
    const numero = inputTelefone.value;

    if(numero === '') return;
    const numeroTratado = tratarTelefone(numero);
    numeroTratado ? inputTelefone.value = numeroTratado : '';
}) 
/** Formata o numero do celular */
const tratarTelefone = (numero) => {
    const tel = numero;
    if(tel.length === 11) {
        const resultado = `(${tel.substr(0, 2)}) 9${tel.substr(3, 4)}-${tel.substr(7, 4)}`
        return resultado
    } else if(tel.length === 10) {
        const resultado = `(${tel.substr(0, 2)}) 9${tel.substr(2, 4)}-${tel.substr(6, 4)}`
        return resultado
    } else if (tel.length === 9) {
        const resultado = `${tel.substr(0, 5)}-${tel.substr(5, 4)}`
        return resultado
    } else if (tel.length === 8) {
        const resultado = `${tel.substr(0, 4)}-${tel.substr(4, 4)}`
        return resultado
    }
}

// Adiciona evento blur. Quando o input do cep perder o focus, o cep será formatado
const inputCep = document.querySelector('form .cep');
inputCep.addEventListener('blur', event => {
    const cep = inputCep.value;
    if(cep === '') return;

    const cepTratado = tratarCep(cep);
    cepTratado ? inputCep.value = cepTratado : '';
}) 
/** Formata o número do cep */
const tratarCep = (numero) => {
    const cep = numero;
    if(cep.length === 9 && cep[6] === '-') {
        const resultado = cep;
        return resultado
    } else if (cep.length === 8) {
        const resultado = `${cep.substr(0, 5)}-${cep.substr(5, 3)}`
        return resultado
    };
}

// Adiciona evento blur. Quando o input do nome do país perder o focus, o nome será formatado
const inputPais = document.querySelector('form .country');
inputPais.addEventListener('blur', () => {
    if(inputPais.value === '') return;
    formatar(inputPais);
}) 

// Adiciona evento blur. Quando o input do nome da cidade perder o focus, o nome será formatado
const inputCity = document.querySelector('form .city');
inputCity.addEventListener('blur', () => {
    if(inputCity.value === '') return;
    formatar(inputCity);
}) 

// Adiciona evento blur. Quando o input do nome bairro perder o focus, o nome será formatado
const inputBairro = document.querySelector('form .neighborhood');
inputBairro.addEventListener('blur', () => {    
    if(inputBairro.value === '') return;
    formatar(inputBairro);
}) 

// Adiciona evento blur. Quando o input do numero do cartão perder o focus, o cep será formatado
const inputNumeroCartao = document.querySelector('form .card-number');
inputNumeroCartao.addEventListener('blur', event => {
    const numeroCartao = inputNumeroCartao.value;
    if(numeroCartao === '') return;

    const numeroCartaoTratado = tratarnumeroCartao(numeroCartao);
    numeroCartaoTratado ? inputNumeroCartao.value = numeroCartaoTratado : '';
}) 

/** Formata o número do cartão */
const tratarnumeroCartao = (numero) => {
    const numeroCartao = numero;
    if(numeroCartao.length === 16) {
        const resultado = `${numeroCartao.substr(0, 4)}.${numeroCartao.substr(4, 4)}.${numeroCartao.substr(8, 4)}.${numeroCartao.substr(12, 4)}`
        return resultado
    };
}

// Trecho de código que se repete quando se trata de formatação de palavras
const formatar = (nomeInput) => {
    const variavel = nomeInput.value;
    if(variavel === '') return;
    
    const variavelTratado = todaPrimeiraLetraMaiuscula(variavel);
    variavelTratado ? nomeInput.value = variavelTratado : '';
}

/** Altera toda primeira letra da palavra para maiúsulo */
const todaPrimeiraLetraMaiuscula = (variavel) => {
    const nome = variavel.trim();
    const quebrado = nome.split(' ');
 
    quebrado.forEach((x, i) => {
        const maiusculo = x[0].toUpperCase();
        quebrado[i] = quebrado[i].replace(x[0], maiusculo);
    })    
    return quebrado.join(' ');
}

/** Adiciona evento de click no botao voltar para pagina inicial */
const addBotaoPaginaInicial = document.querySelector('.initial-page button');
addBotaoPaginaInicial.addEventListener('click', () => {
    location.href = '/index.html'
})

/** Adiciona evento de blur em todos os inputs */
const todosInputs = document.querySelectorAll('form input');
for(x of todosInputs) {
    x.addEventListener('blur', () => {
        verificarQtdInputsPreenchido()
    })
}

/** Verifica a quantidade de inputs preenchidos */
const verificarQtdInputsPreenchido = () => {
    inputsPreenchido = 0;
    for(x of todosInputs) {
        if (x.value !== '') inputsPreenchido++
    }

    if(inputsPreenchido === todosInputs.length) gerarBotaoConfirmarPagamento();
}

const gerarBotaoConfirmarPagamento = () => {
    
}