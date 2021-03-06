/** Temporizador do cupom promocional */
const esconderBanner = document.querySelector('.hidden');
const tempo = document.querySelector('.content-time .time');
let minutos = 5;
let segundos = 0;

const temporizador = () => {
    if (minutos > 0 && segundos >= 0) {
        if(segundos != 0) {
            segundos--;
            segundos <= 9 ? tempo.innerText = `00:0${minutos}:0${segundos}` : tempo.innerText = `00:0${minutos}:${segundos}`;           
        }else {
            minutos--
            segundos = 59;
            tempo.innerText = `00:0${minutos}:${segundos}`;
        }             
    } else if (minutos === 0 && segundos != 0) {
        segundos--
        segundos <= 9 ? tempo.innerText = `00:0${minutos}:0${segundos}` : tempo.innerText = `00:0${minutos}:${segundos}`;
    } else {
        esconderBanner.hidden = true;
        clearInterval(idTempo);
    }
}
const idTempo = setInterval(temporizador, 1000);

/** Evento de click no banner para autopreenchimento do cupom na sacola */
esconderBanner.addEventListener('click', () => {
    const preencherCupom = document.querySelector('.bag-footer input');
    const cupom = document.querySelector('.content-cupom span');

    const codigoCupom = cupom.innerText.split(': ')[1];

    clearInterval(idTempo);
    preencherCupom.value = codigoCupom;
    esconderBanner.hidden = true;
    totalDoCarrinho();
})

// Consumos de API
/** Lista os filmes mais populares */
const listarFilmesPopulares = fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR').then(res => res.json());
let listaGlobal = [];
let listaDos5Populares = [];

/** Cria os cards do top5 filmes populares */
const criarCardsTop5Filmes = () => {
    listarFilmesPopulares
        .then(res => {
            listaDos5Populares = []
            const top5 = res.results.slice(0, 5);
            criarListaFilmesPopulares(top5, listaDos5Populares);
            criarCards(listaDos5Populares, '.top-films');
        });
}
criarCardsTop5Filmes();

let top20DoGenero = [];
/** Cria os cards do top 20 filmes populares */
const criarCardsTop20Filmes = () => {
    top20DoGenero = [];
    listarFilmesPopulares
        .then(res => {
            top20DoGenero = [];
            listaGlobal = [];
            const top20 = res.results;
            criarListaFilmesPopulares(top20, top20DoGenero);
            criarCards(top20DoGenero, '.films');
        });
}
criarCardsTop20Filmes();

// Consome a api da lista de generos dos filmes com seus respectivos id
const listaIdGenero = fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/genre/movie/list?language=pt-BR').then(res => res.json());

// Adiciona evento de click nos botões de generos dos filmes e gera uma nova lista de filmes de acordo com o genero
let buttons = document.querySelectorAll('.buttons-genres button');
for (botao of buttons) {
    botao.addEventListener('click', event => {
        buttons = document.querySelectorAll('.buttons-genres button');
        // Remove a classe clicked do botao que não está selecionado
        for(botao of buttons) {
            if (botao.classList.contains('clicked')) {
                botao.classList.remove('clicked');
            }
        }
        const botaoClicado = event.target;
        // Adiciona a classe clicked no botão clicado
        botaoClicado.classList.add('clicked');
        if (botaoClicado.innerText === 'Todos') {
            apagarListaAnterior();
            criarCardsTop20Filmes();
        } else {
            listaIdGenero.then(res => {
                for(genero of res.genres) {
                    // Faz a busca dos 20 filmes populares de acordo com o genero escolhido
                    if (genero.name === botaoClicado.innerText) {
                        fetch(`https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?with_genres=${genero.id}&language=pt-BR`).then(res => res.json())
                            .then(res => {
                                apagarListaAnterior();
                                top20DoGenero = [];
                                criarListaFilmesPopulares(res.results, top20DoGenero);
                                criarCards(top20DoGenero, '.films');                      
                            })
                    }
                }
            })
        } 
    })
}

/** Apaga os cards da lista top20 do site, para receber uma nova lista de cards */
const apagarListaAnterior = () => {
    const listaAnterior = document.querySelectorAll('.films .cards');
    for(x of listaAnterior) {
        x.remove();
    }
}

/** Cria uma lista de filmes formatado para criação dos cards*/
const criarListaFilmesPopulares = (lista, listaDestino) => {
    for (filme of lista) {
        listaDestino.push({
            id: filme.id,
            nomeFilme: filme.title,
            urlPoster: filme.poster_path,
            nota: filme.vote_average,
            valor: `${filme.price.toFixed(2)}`.replace('.', ',')
        })
    }
}

/** Cria e imprime os cards na página */
const criarCards = (lista, caminho) => { // caminho é o container onde quer inserir os cards
    const container = document.querySelector(caminho);
    const linhas = (lista.length / 5) === 0 ? 1 : Math.floor(lista.length / 5);

    for (let i = 0; i < linhas; i++) {
        const ul = document.createElement('ul');
        ul.classList.add('cards');
        container.append(ul);
    }

    let ulsCriadas;   
    if (caminho === '.top-films') ulsCriadas = document.querySelectorAll('.top-films .cards');
    else if (caminho === '.films') ulsCriadas = document.querySelectorAll('.films .cards');

    let ulPosicao = 0;
    let quebra = 0;

    for(item of lista) {     
        if (quebra % 5 === 0 && quebra != 0) ulPosicao++ 
        const li = document.createElement('li');
        li.classList.add('card');

        ulsCriadas[ulPosicao].append(li);

        li.innerHTML = `
        <img src="${item.urlPoster}"  class="poster" alt="">
        <img src="images/cards/Star 2.png" class="icon-star" alt="estrela">
        <div class="texts">
            <div class="star">
                <span class="name-film">${item.nomeFilme}</span>
                <img src="images/cards/Star 1.svg" alt="estrela">
                <span class="nota">${item.nota}</span>
            </div>
            <div class="card-footer" id="id${item.id}">
                <div>Sacola</div>
                <div>R$ ${item.valor}</div>
            </div>
        </div>
        `

        const divFilho2 = document.querySelector(`${caminho} .card #id${item.id}`);
        const id = divFilho2.id.slice(2);
        divFilho2.addEventListener('click', () => {
            encontrarFilme(id);
        })
        quebra++
    }
}

let filmesAdicionadosNaSacola = [];
// Encontra toda informação de um filme quando o botao de add na sacola for clicado e o adiciona na sacola
const encontrarFilme = (id) => {
    const idFilme = Number(id);
    const listaGlobal = listaDos5Populares.concat(top20DoGenero);

    const filme = listaGlobal.filter(item => idFilme === item.id);

    if (!filmesAdicionadosNaSacola.length) {
        filme[0].quantidade = 1;
        filmesAdicionadosNaSacola.push(filme[0]);
        addFilmeNaSacola(filme[0]);
    } else {
        const condicao = filmesAdicionadosNaSacola.filter(item => item.id === filme[0].id);

        if (condicao.length) {
            filme[0].quantidade++;
            atualizarItemNaSacola(filme[0]);
        }
        if(!condicao.length) {
            filme[0].quantidade = 1;
            filmesAdicionadosNaSacola.push(filme[0]);
            addFilmeNaSacola(filme[0]);
        };
    }

    const temBotao = document.querySelector('.confirm-bag');
    if(temBotao === null) inserirBotaoConfirmarDados();

    totalDoCarrinho();
}

/** Adiciona o filme que o usuario gostaria de add na sacola */
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
        <img src="./images/bag/add.png" class="add" alt="">
        <span class="amount">1</span>
        <img src="./images/bag/delete.png" class="delete" alt="">
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
            }
            if (filmesAdicionadosNaSacola[i].quantidade > 1) {
                const iconeDeletar = document.querySelector(`.films-bag #id${filme.id} .delete`);
                iconeDeletar.setAttribute('src', './images/bag/menos.png');
            }
            atualizarItemNaSacola(filmesAdicionadosNaSacola[i]);
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
                if (filmesAdicionadosNaSacola[i].quantidade === 1) {
                    iconeDeletar.setAttribute('src', './images/bag/delete.png');
                }  
                if (filmesAdicionadosNaSacola[i].quantidade === 0) {
                    const filmesDaSacola = document.querySelectorAll('.films-bag li');
                    if(filmesDaSacola.length === 1) {
                        // Caso só exista um filme na sacola, ao ser removido, volta o layout da sacola vazia 
                        document.querySelector('.empty-bag').toggleAttribute('hidden');
                        document.querySelector('.confirm-bag').remove();
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

/** Atualiza a quantidade de um filme em específico */
const atualizarItemNaSacola = (filme) => {
    const posicao = filmesAdicionadosNaSacola.indexOf(filme);   
    if(posicao !== -1) document.querySelectorAll('.films-bag .amount')[posicao].innerText = filme.quantidade;
    totalDoCarrinho();
}

/** Calcula o total em compras do carrinho */
const totalDoCarrinho = () => {
    const addTotalDoCarrinho = document.querySelector('.confirm-bag .total-price');
    const inputCupom = document.querySelector('.bag-container input');
    const cupomValido = inputCupom.value === 'HTMLNAOELINGUAGEM' ? true : false;
    
    let total = 0;
    for(filme of filmesAdicionadosNaSacola) {
        total += Number(filme.valor.replace(',', '.')) * filme.quantidade;
    }
    
    if(total) {
        if (cupomValido) return addTotalDoCarrinho.innerText = `R$ ${(total / 2).toFixed(2)}`
        addTotalDoCarrinho.innerText = `R$ ${total.toFixed(2)}`
    }
}

// Adociona evento de blur para quando for inserido algum cupom recaulcular o total do carrinho
const inputCupom = document.querySelector('.bag-container input');
inputCupom.addEventListener('blur', () => {
    totalDoCarrinho();
})

/** Insere o botão de confirmar dados para efetuar o pagamento */
const inserirBotaoConfirmarDados = () => {
    const container = document.querySelector('.bag .bag-container');

    const div = document.createElement('div');
    div.classList.add('confirm-bag');

    const textoBotao = document.createElement('span');
    textoBotao.innerText = 'Confirme seus dados';

    const totalDoCarrinho = document.createElement('span');
    totalDoCarrinho.classList.add('total-price');

    div.append(textoBotao);
    div.append(totalDoCarrinho);
    container.append(div);

    const botaoConfirmar = document.querySelector('.bag .confirm-bag');
   // Adiciona evento de click no botão confirmar dados e redireciona para pagina de informações
    botaoConfirmar.addEventListener('click', () => {
        // Converte a lista de filmes da sacola em JSON e armazena no localStorage
        const filmes = JSON.stringify(filmesAdicionadosNaSacola);
        localStorage.setItem('filmes', filmes);
        
        const texto = document.querySelector('.bag .container-bag-input input');
        const cupomInserido = texto.value;
        // Verifica se a pessoa informou o cupom de desconto, se sim, armazena no localStorage
        if (cupomInserido === 'HTMLNAOELINGUAGEM') {
            localStorage.setItem('cupom', cupomInserido);
        }
        location.href = './Page02/index2.html';
    })
}