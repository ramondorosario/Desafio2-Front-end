/** Temporizador do cupom promocional */
const esconderBanner = document.querySelector('.hidden');
const tempo = document.querySelector('.content-time .time');
let segundos = Number(tempo.innerText.split(':')[2]);
let minutos = Number(tempo.innerText.split(':')[1]);

const temporizador = () => {
    if (minutos > 0 && segundos >= 0) {
        if(segundos != 0) {
            segundos--;
            segundos <= 9 ? tempo.innerText = `00:0${minutos}:0${segundos}` : tempo.innerText = `00:0${minutos}:${segundos}` ;           
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

let listaDos5Populares = [];
/** Cria os cards do top5 filmes populares */
const criarCardsTop5Filmes = () => {
    listarFilmesPopulares
        .then(res => {
            listaDos5Populares = []
            const top5 = res.results.slice(0, 5);
            criarListaFilmesPopulares(top5, listaDos5Populares);
            criarCards(listaDos5Populares, '.top-films')
        });
}
criarCardsTop5Filmes();

let listaDos20Populares = [];

/** Cria os cardst do top 20 filmes populares */
const criarCardsTop20Filmes = () => {
    listarFilmesPopulares
        .then(res => {
            listaDos20Populares = [];
            const top20 = res.results;
            criarListaFilmesPopulares(top20, listaDos20Populares);
            criarCards(listaDos20Populares, '.films')
        });
}
criarCardsTop20Filmes();

// Consome a api da lista de generos dos filmes com seus respectivos id
const listaIdGenero = fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/genre/movie/list?language=pt-BR').then(res => res.json());
let top20DoGenero = [];

// Adiciona evento de click nos botões de generos dos filmes e gera uma nova lista de filmes de acordo com o genero
const buttons = document.querySelectorAll('.buttons-genres')
for (botao of buttons) {
    botao.addEventListener('click', event => {
        const botaoClicado = event.target;

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
    
        const imgPoster = document.createElement('img');
        imgPoster.setAttribute('src', item.urlPoster);
        imgPoster.classList.add('poster')
    
        const imgIcon = document.createElement('img');
        imgIcon.setAttribute('src', 'images/cards/Star 2.png');
        imgIcon.classList.add('icon-star')
    
        const divPai = document.createElement('div');
        divPai.classList.add('texts');
    
        const divFilho1 = document.createElement('div');
        divFilho1.classList.add('star');
    
        const nomeFilme = document.createElement('span');
        nomeFilme.classList.add('name-film');
        nomeFilme.innerText = item.nomeFilme;
    
        const iconeEstrelaNota = document.createElement('img');
        iconeEstrelaNota.setAttribute('src','images/cards/Star 1.svg');
    
        const notaFilme = document.createElement('span');
        notaFilme.classList.add('nota');
        notaFilme.innerText = item.nota;   
        
        const divFilho2 = document.createElement('div');
        divFilho2.classList.add('card-footer');
    
        const botaoAddSacola = document.createElement('button');
        botaoAddSacola.classList.add('bag-button');
        botaoAddSacola.innerText = 'Sacola'
    
        const precoFilme = document.createElement('span');
        const valor = `R$ ${item.valor}`
        precoFilme.innerText = valor;
    
        divFilho1.append(nomeFilme);
        divFilho1.append(iconeEstrelaNota);
        divFilho1.append(notaFilme);
    
        divFilho2.append(botaoAddSacola);
        divFilho2.append(precoFilme);
        
        divPai.append(divFilho1);
        divPai.append(divFilho2);
    
        li.append(imgPoster);
        li.append(imgIcon);
        li.append(divPai);

        ulsCriadas[ulPosicao].append(li);
        quebra++
    }
}