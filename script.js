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

/** Cria e implementa os cards no site*/ 
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
    
        const imgPoster = document.createElement('img');
        imgPoster.setAttribute('src', item.urlPoster);
        imgPoster.classList.add('poster')
    
        const imgIcon = document.createElement('img');
        imgIcon.setAttribute('src', 'images/cards/Star 2.png');
        imgIcon.classList.add('icon-star')
    
        const divPai = document.createElement('div');
        divPai.classList.add('texts');

        li.append(imgPoster);
        li.append(imgIcon);
        li.append(divPai);
    
        const divFilho1 = document.createElement('div');
        divFilho1.classList.add('star');
        
        divPai.append(divFilho1);
        
        const nomeFilme = document.createElement('span');
        nomeFilme.classList.add('name-film');
        nomeFilme.innerText = item.nomeFilme;
    
        const iconeEstrelaNota = document.createElement('img');
        iconeEstrelaNota.setAttribute('src','images/cards/Star 1.svg');
    
        const notaFilme = document.createElement('span');
        notaFilme.classList.add('nota');
        notaFilme.innerText = item.nota;   

        divFilho1.append(nomeFilme);
        divFilho1.append(iconeEstrelaNota);
        divFilho1.append(notaFilme);
        
        const divFilho2 = document.createElement('div');
        divFilho2.classList.add('card-footer');
        
        divFilho2.id = item.id;
        divFilho2.addEventListener('click', () => {
            encontrarFilme(divFilho2.id);
        })
        
        divPai.append(divFilho2);
    
        const addSacola = document.createElement('div');
        addSacola.innerText = 'Sacola'
    
        const precoFilme = document.createElement('div');
        const valor = `R$ ${item.valor}`
        precoFilme.innerText = valor;

        divFilho2.append(addSacola);
        divFilho2.append(precoFilme);

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

    totalDoCarrinho(filmesAdicionadosNaSacola);
}

/** Adiciona o filme que o usuario gostaria de add na sacola */
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
    iconeAdicionar.setAttribute('src', 'images/bag/add.png');
    iconeAdicionar.classList.add('add');

    li.id = filme.id; //Adiciona id no container do filme que gostaria de mudar a quantidade na sacola
    // Adiciona o evento de click no icone de adicionar quantidade
    iconeAdicionar.addEventListener('click', () => {
        //Adiciona background colocar no iconeAdicionar e remove o background do iconeDeletar, caso ele tenha
        iconeAdicionar.style.background = 'linear-gradient(0deg, rgba(107, 107, 107, 0.37), rgba(107, 107, 107, 0.37))';
        iconeDeletar.style.removeProperty('background');

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
    quantidadeFilme.innerText = 1;

    const iconeDeletar = document.createElement('img');
    iconeDeletar.setAttribute('src', 'images/bag/delete.png');
    iconeDeletar.classList.add('delete');

    // Adiciona o evento de click no icone de deletar, para diminuir a quantidade ou excluir o item da sacola
    iconeDeletar.addEventListener('click', () => {
        //Adiciona background colocar no iconeDeletar e remove o background do iconeAdicionar, caso ele tenha
        iconeDeletar.style.background = 'linear-gradient(0deg, rgba(107, 107, 107, 0.37), rgba(107, 107, 107, 0.37))';
        iconeAdicionar.style.removeProperty('background');

        const idFilme = Number(li.id);

        filmesAdicionadosNaSacola.forEach((item, i) => {
            if (item.id === idFilme) {
                filmesAdicionadosNaSacola[i].quantidade--
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
    
    conteudoAdicionar.append(iconeAdicionar);
    conteudoAdicionar.append(quantidadeFilme);
    conteudoAdicionar.append(iconeDeletar);

    li.append(conteudoAdicionar);
}

/** Atualiza a quantidade de um filme em específico */
const atualizarItemNaSacola = (filme) => {
    const filmesNoCarrinho = document.querySelectorAll('.films-bag');

    const posicao = filmesAdicionadosNaSacola.indexOf(filme);   
    document.querySelectorAll('.films-bag .amount')[posicao].innerText = filme.quantidade;
    totalDoCarrinho(filmesAdicionadosNaSacola);
}

/** Calcula o total em compras do carrinho */
const totalDoCarrinho = (listaDeFilmeDoCarrinho) => {
    const addTotalDoCarrinho = document.querySelector('.confirm-bag .total-price');
    
    let total = 0;
    for(filme of filmesAdicionadosNaSacola) {
        total += Number(filme.valor.replace(',', '.')) * filme.quantidade;
    }

    addTotalDoCarrinho.innerText = `R$ ${total.toFixed(2)}`
}

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