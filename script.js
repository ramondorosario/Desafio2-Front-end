/** Temporizador do cupom promocional */
const esconderBanner = document.querySelector('.hidden');
const tempo = document.querySelector('.content-time .time');
let segundos = Number(tempo.innerText.split(':')[2]);
let minutos = Number(tempo.innerText.split(':')[1]);

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

/** Cria os cardst do top 20 filmes populares */
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
        // Remove a classe clicked do botao que a tiver
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

/** Apaga a lista de filmes anterior para receber uma nova lista */
const apagarListaAnterior = () => {
    const listaAnterior = document.querySelectorAll('.films .cards');
    for(x of listaAnterior) {
        x.remove();
    }
}

/** Cria uma lista de filmes formatado*/
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

// Adicionando itens na sacola
let filmesAdicionados = [];
const encontrarFilme = (id) => {
    const idFilme = Number(id);
    const listaGlobal = listaDos5Populares.concat(top20DoGenero);

    const filme = listaGlobal.filter(item => idFilme === item.id);

    if (!filmesAdicionados.length) {
        filmesAdicionados.push(filme[0]);
        addFilmeNaSacola(filme[0])
    } else {
        const condicao = filmesAdicionados.filter(item => item.id === filme[0].id);
        if(!condicao.length) {
            filmesAdicionados.push(filme[0]);
            addFilmeNaSacola(filme[0])
        };
    }
    console.log(filmesAdicionados)
}

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

    const quantidadeFilme = document.createElement('span');
    quantidadeFilme.classList.add('amount');
    quantidadeFilme.innerText = 1;

    const iconeDeletar = document.createElement('img');
    iconeDeletar.setAttribute('src', 'images/bag/delete.png');
    iconeDeletar.classList.add('delete');
    
    conteudoAdicionar.append(iconeAdicionar);
    conteudoAdicionar.append(quantidadeFilme);
    conteudoAdicionar.append(iconeDeletar);

    li.append(conteudoAdicionar);
}