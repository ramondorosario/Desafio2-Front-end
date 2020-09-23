// Resgata os itens que foram adicionados na sacola na página principal
const filmes = localStorage.getItem('filmes');
const filmesAdicionadosNaSacola = JSON.parse(filmes);

const cupom = localStorage.getItem('cupom');
// Verifica se a pessoa informou o cupom válido na página principal
if (cupom === 'HTMLNAOELINGUAGEM') {
    const inputCupom = document.querySelector('.bag .container-bag-input input');
    inputCupom.value = cupom;
}

/** Adiciona os filmes que foram adicionados na sacola */ 
const addFilmeNaSacola = (filme) => {
    const conteudoSacolaVazia = document.querySelector('.bag .empty-bag');
    conteudoSacolaVazia.setAttribute('hidden', '');

    const itemSacola = document.querySelector('.bag .films-bag');

    const li = document.createElement('li');
    itemSacola.append(li);

    li.innerHTML = `
    <div class="films-bag-content">
        <img src="${filme.urlPoster}" class="little-poster" alt="">
        <div class="name-price">
            <span>${filme.nomeFilme}</span>
            <span>R$ ${Number(filme.valor.replace(',', '.')).toFixed(2)}</span>
        </div>
    </div>
    <div class="content-add" id="id${filme.id}">
        <img src="../images/bag/add.png" class="add" alt="">
        <span class="amount">1</span>
        <img src="../images/bag/delete.png" class="delete" alt="">
    </div>
    `

    const iconeAdicionar = document.querySelector(`.films-bag #id${filme.id} .add`);
    // Adiciona o evento de click no icone de adicionar quantidade
    iconeAdicionar.addEventListener('click', () => {
        //Adiciona background color no iconeAdicionar e remove o background do iconeDeletar, caso ele tenha
        iconeAdicionar.style.background = 'linear-gradient(0deg, rgba(107, 107, 107, 0.37), rgba(107, 107, 107, 0.37))';
        iconeDeletar.style.removeProperty('background');

        const idFilme = filme.id;
        filmesAdicionadosNaSacola.forEach((item, i) => {
            if (item.id === idFilme) {
                filmesAdicionadosNaSacola[i].quantidade++
                atualizarItemNaSacola(filmesAdicionadosNaSacola[i])
            }
        })       
    })

    const iconeDeletar = document.querySelector(`.films-bag #id${filme.id} .delete`);

    // Adiciona o evento de click no icone de deletar, para diminuir a quantidade ou excluir o item da sacola
    iconeDeletar.addEventListener('click', () => {
        //Adiciona background colocar no iconeDeletar e remove o background do iconeAdicionar, caso ele tenha
        iconeDeletar.style.background = 'linear-gradient(0deg, rgba(107, 107, 107, 0.37), rgba(107, 107, 107, 0.37))';
        iconeAdicionar.style.removeProperty('background');

        const idFilme = filme.id;
        filmesAdicionadosNaSacola.forEach((item, i) => {
            if (item.id === idFilme) {
                filmesAdicionadosNaSacola[i].quantidade--
                if (filmesAdicionadosNaSacola[i].quantidade === 0) {
                    const filmesDaSacola = document.querySelectorAll('.films-bag li');
                    if(filmesDaSacola.length === 1) {
                        // Caso só exista um filme na sacola, ao ser removido, volta o layout da sacola vazia 
                        document.querySelector('.empty-bag').toggleAttribute('hidden');
                        document.querySelector('.films-bag li').remove();
                    }
                    // Remove o filme da sacola e da lista de filmes adicionados na sacola
                    filmesDaSacola[i].remove();
                    filmesAdicionadosNaSacola.splice(i, 1);
                }                
                atualizarItemNaSacola(filmesAdicionadosNaSacola[i]);                
            }
        })       
    })
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
        const posicao = filmesAdicionadosNaSacola.indexOf(filme);
        document.querySelectorAll('.films-bag .amount')[posicao].innerText = filme.quantidade;
    }
    totalDoCarrinho();
}

let subtotal = 0;
/** Calcula o subtotal em compras do carrinho */
const totalDoCarrinho = () => {
    subtotal = 0;
    const valorSubtotal = document.querySelector('.bag .subtotal .value');

    for(filme of filmesAdicionadosNaSacola) {
        subtotal += Number(filme.valor.replace(',', '.')) * filme.quantidade;
    }
    valorSubtotal.innerText = `R$ ${subtotal.toFixed(2)}`;
}
//Verifica se existe filmes na sacola e informa o subtotal da compra
if(filmesAdicionadosNaSacola) totalDoCarrinho();

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
const inputNomeCompleto = document.querySelector('form .name input');
inputNomeCompleto.addEventListener('blur', () => {
    if(inputNomeCompleto.value === '') return;
    formatar(inputNomeCompleto);
    limparErro('.name');
}) 

// Adiciona evento blur. Quando o input email perder o focus, será verificado se o email é valido
const inputEmail= document.querySelector('form .email input');
inputEmail.addEventListener('blur', () => {
    if(inputEmail.value === '') return;
    verificarEmail(inputEmail.value);
}) 

const verificarEmail = (email) => {
    if (!email.includes('@')) {            
        return imprimirErro('.email');
    } else if (email.indexOf('.') === -1) {
        return imprimirErro('.email');
    } else if (email.includes('@')) {
        const conteudoPosArroba = email.slice(email.indexOf('0'), -1);
        if (!email.includes('.')) {
            return imprimirErro('.email');
        }
    }
    
    limparErro('.email')
    return inputEmail.value.trim();
}


// Adiciona evento blur. Quando o input do telefone perder o focus, o número será formatado
const inputTelefone = document.querySelector('form .tel input');
inputTelefone.addEventListener('blur', event => {
    const numero = inputTelefone.value;

    if(numero === '') return;
    const numeroTratado = tratarTelefone(numero);
    numeroTratado ? inputTelefone.value = numeroTratado : '';
}) 
/** Formata o numero do celular */
const tratarTelefone = (numero) => {
    let resultado;
    const tel = numero;
    if(tel.includes('-')) {
        const hifenPosicao = tel.slice(-5);
        if (hifenPosicao[0] === '-' && tel.length === 9) return;
        return imprimirErro('.tel');        
    }else if(tel.length === 11) {
        resultado = `(${tel.substr(0, 2)}) 9${tel.substr(3, 4)}-${tel.substr(7, 4)}`;
    } else if(tel.length === 10) {
        resultado = `(${tel.substr(0, 2)}) 9${tel.substr(2, 4)}-${tel.substr(6, 4)}`;
    } else if (tel.length === 9) {
        resultado = `${tel.substr(0, 5)}-${tel.substr(5, 4)}`;
    } else if (tel.length === 8) {
        resultado = `${tel.substr(0, 4)}-${tel.substr(4, 4)}`;
    } else {
        imprimirErro('.tel');
        return;
    }

    limparErro('.tel')
    return resultado
}

// Adiciona evento blur. Quando o input do cep perder o focus, o cep será formatado
const inputCep = document.querySelector('form .cep input');
inputCep.addEventListener('blur', event => {
    const cep = inputCep.value;
    if(cep === '') return;

    const cepTratado = tratarCep(cep);
    cepTratado ? inputCep.value = cepTratado : '';
}) 
/** Formata o número do cep */
const tratarCep = (numero) => {
    let resultado;
    const cep = numero;
    if(cep.length === 9 && cep.indexOf('-') === 5) {
        resultado = cep;
    } else if (cep.length === 8) {
        resultado = `${cep.substr(0, 5)}-${cep.substr(5, 3)}`
    } else {
        imprimirErro('.cep')
        return;
    }

    const erro = document.querySelectorAll('.cep span');
   
    limparErro('.cep')
    return resultado
}

// Adiciona evento blur. Quando o input do nome do país perder o focus, o nome será formatado
const inputPais = document.querySelector('form .country input');
inputPais.addEventListener('blur', () => {
    if(inputPais.value === '') return;
    formatar(inputPais);
    limparErro('.country')
}) 

// Adiciona evento blur. Quando o input do nome da cidade perder o focus, o nome será formatado
const inputCity = document.querySelector('form .city input');
inputCity.addEventListener('blur', () => {
    if(inputCity.value === '') return;
    formatar(inputCity);
    limparErro('.city');
}) 

// Adiciona evento blur. Quando o input do nome bairro perder o focus, o nome será formatado
const inputBairro = document.querySelector('form .neighborhood input');
inputBairro.addEventListener('blur', () => {    
    if(inputBairro.value === '') return;
    formatar(inputBairro);
    limparErro('.neighborhood');
}) 

// Adiciona evento blur no input da casa para fazer a limpeza da formatação do erro caso exista
const inputNumeroCasa = document.querySelector('form .number-house input');
inputNumeroCasa.addEventListener('blur', () => {    
    if(inputNumeroCasa.value === '') return;
    formatar(inputNumeroCasa);
    limparErro('.numberHouse');
}) 

// Adiciona evento blur. Quando o input do numero do cartão perder o focus, o cep será formatado
const inputNumeroCartao = document.querySelector('form .card-number input');
inputNumeroCartao.addEventListener('blur', event => {
    const numeroCartao = inputNumeroCartao.value;
    if(numeroCartao === '') return;

    if(numeroCartao.length !== 16) return imprimirErro('.card-number')

    limparErro('.card-number');
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

// Adiciona evento blur. Quando o input da data de expiração do cartao perder o focus verificar se foi digitado a quantidade de digitos corretos
const inputValidadeCartao = document.querySelector('form .expiration-card input');
inputValidadeCartao.addEventListener('blur', () => {    
    if(inputValidadeCartao.value === '') return;
    verificar(inputValidadeCartao.value);
}) 

const verificar = (conteudo) => {
    const data = new Date();;
    const mes = data.getMonth();
    const ano = data.getFullYear();
    const quebrado = conteudo.split('/');

    let resultado;

    if (conteudo.length === 7) {
        if (!isNaN(quebrado[0]) && !isNaN(quebrado[1])) {  
            if (quebrado[0] >= mes + 1 && quebrado[1] >= ano) {
                limparErro('.expiration-card');
                return;
            } else return imprimirErro('.expiration-card'); 
        }  
    } else if (conteudo.length === 6) {
        const parte1 = conteudo.substr(0, 2);
        const parte2 = conteudo.slice(-4);

        if (!isNaN(parte1) && !isNaN(parte2)) {  
            if (parte1 >= mes && parte2 >= ano) {
                resultado = `${conteudo.substr(0, 2)}/${conteudo.substr(2, 4)}`
            } else {
                inputValidadeCartao.value = `${conteudo.substr(0, 2)}/${conteudo.substr(2, 4)}`
                return imprimirErro('.expiration-card'); 
            }
        }        
    } else return imprimirErro('.expiration-card');

    limparErro('.expiration-card');
    return inputValidadeCartao.value = resultado;
}

// Adiciona evento blur. Quando o input do cvv perder o focus verifica se foi digitado a quantidade de digitos corretos
const inputCvv = document.querySelector('form .cvv input');
inputCvv.addEventListener('blur', () => {    
    if(inputCvv.value === '') return;
    verificarCvv(inputCvv.value);
}) 

const verificarCvv = (numero) => {
    if(numero.length !== 3 || isNaN(numero)) return imprimirErro('.cvv');   
    limparErro('.cvv');
    verificarInputVazio();
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

/** Cria o botão para confirmar o pagamento */
const gerarBotaoConfirmarPagamento = () => {
    // Se o usuario deletar todos os filmes antes de preencher os dados, não será gerado o botão para pagamento do valor R$ 0,00
    if(subtotal === 0) return;
    // Se o botão ja foi gerado, e por um acaso o usuario deletar um dos dados, e preencher novamente, o botão não será duplicado
    const jaExisteOBotaoConfirmarPagamento = document.querySelector('.bag .payment-button');
    if(jaExisteOBotaoConfirmarPagamento) return;

    const container = document.querySelector('.bag .bag-container');

    const div = document.createElement('div');
    div.classList.add('payment-button');

    const texto = document.createElement('span');
    texto.innerText = 'Confirmar agora';

    const total = document.createElement('span');
    total.classList.add('total-price');

    div.append(texto);
    div.append(total);
    container.append(div);

    calcularValorFinal();

    div.addEventListener('click', () => {
        if(inputsPreenchido !== todosInputs.length) alert('[erro]: Todos os dados do formulário devem ser preenchido');
        localStorage.clear();
        location.href = '../Page03/index3.html';
    })
}

/* Adiciona evento de blur no input da sacola, para quando o usuario clicar ou digitar algum cupom, recalcular o total da compra */
const inputSacola = document.querySelector('.container-bag-input input');
inputSacola.addEventListener('blur', () => {
    calcularValorFinal();
})

let totalAPagar = 0;
/** Calcula o valor final da compra. Caso haja um cupom valido, haverá um desconto de 50% */
const calcularValorFinal = () => {    
    const conferirInputCupom = document.querySelector('.container-bag-input input');
    const textoCupom = conferirInputCupom.value;
    totalAPagar = textoCupom === 'HTMLNAOELINGUAGEM' ? totalAPagar = subtotal / 2 : totalAPagar = subtotal;

    const addValorFinal = document.querySelector('.payment-button .total-price');
    addValorFinal.innerText = `R$ ${totalAPagar.toFixed(2)}`;
}

/** Imprime o erro no formulário */
const imprimirErro = (caminho) => {
    const erro = document.querySelectorAll(`${caminho} span`);
    erro[0].classList.add('color-err');
    if (erro[1].hasAttribute('hidden')) erro[1].removeAttribute('hidden');
}

/** Limpa a formatação de erro do formulário */
const limparErro = (caminho) => {
    const erro = document.querySelectorAll(`${caminho} span`);
    if(erro) {
        erro[0].classList.remove('color-err');
        erro[1].setAttribute('hidden', '');
    }
}

const verificarInputVazio = () => {
    const todosOsLabel = document.querySelectorAll('form label')

    todosOsLabel.forEach((x, i) => {
        const input = document.querySelectorAll('form input')[i];
        if(input.value === '') {
            const label = document.querySelectorAll('form label')[i];
            const span = label.querySelectorAll('span');
            span[0].classList.add('color-err');
            if (span[1].hasAttribute('hidden')) span[1].removeAttribute('hidden');
        }
    })
}
 