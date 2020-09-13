/** Temporizador do cupom promocional */
const esconderBanner = document.querySelector('.hidden');
const tempo = document.querySelector('.content-time .time');
let segundos = Number(tempo.innerText.split(':')[2]);
let minutos = Number(tempo.innerText.split(':')[1]);

const temporizador = () => {
    if (minutos > 0 && segundos >= 0) {
        if(segundos != 0) {
            segundos--
            segundos <= 9 ? tempo.innerText = `00:0${minutos}:0${segundos}` : tempo.innerText = `00:0${minutos}:${segundos}`            
        }else {
            minutos--
            segundos = 59
            tempo.innerText = `00:0${minutos}:${segundos}`
        }             
    } else if (minutos === 0 && segundos != 0) {
        segundos--
        segundos <= 9 ? tempo.innerText = `00:0${minutos}:0${segundos}` : tempo.innerText = `00:0${minutos}:${segundos}`
    } else {
        esconderBanner.hidden = true;
        clearInterval(idTempo)
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

// Consumo de API dos filmes
/** Encontra os 20 filmes mais populares */
fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR')
    .then(resposta => {
        return resposta.json()
    })
        .then(respostaJson => {
            const resultado = respostaJson.results;

            criarListaFilmesPopulares(resultado);
            criarListaTop5();
            criarListaTop20();
        })

/** Cria a lista com o Top20 filmes mais populares*/
const filmesPopulares = [];
const criarListaFilmesPopulares = (lista) => {
    for (filme of lista) {
        filmesPopulares.push({
            id: filme.id,
            nomeFilme: filme.title,
            urlPoster: filme.poster_path,
            nota: filme.vote_average,
            valor: `${filme.price.toFixed(2)}`.replace('.', ',')
        })
    }
}

/** Cria lista Top5 filmes populares */
const criarListaTop5 = () => {
    const novaLista = filmesPopulares.slice(0, 5);
    criarCards(novaLista, '.top-films')
}

/** Cria lista Top20 filmes populares */
const criarListaTop20 = () => {
    criarCards(filmesPopulares, '.films')
}

/** Cria e implementa os cards no site*/ 
const criarCards = (lista, caminho) => { // caminho é o container onde quer inserir os cards
    const container = document.querySelector(caminho);
    const linhas = (lista.length / 5) === 0 ? 1 : Math.floor(lista.length / 5);

    for (let i = 0; i < linhas; i++) {
        const ul = document.createElement('ul');
        ul.classList.add('cards');
        ul.classList.add('cards-top-films');
        
        container.append(ul);
    }

    let ulsCriadas;   
    if (caminho === '.top-films') {
        ulsCriadas = document.querySelectorAll('.top-films .cards-top-films');
    } else if (caminho === '.films') {
        ulsCriadas = document.querySelectorAll('.films .cards-top-films');
    }

    let ulPosicao = 0;
    let quebra = 0;
    for(item of lista) {     
        if (quebra % 5 === 0 && quebra != 0) {
            ulPosicao++
        } 
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