const filmes = localStorage.getItem('filmes');
const filmesAdicionadosNaSacola = JSON.parse(filmes);

const cupom = localStorage.getItem('cupom');

if (cupom === 'HTMLNAOELINGUAGEM') {
    const inputCupom = document.querySelector('.bag .container-bag-input input');
    inputCupom.value = cupom;
}

/** Adiciona o filme que o usuario gostaria de add na sacola */
// Encontra toda informação de um filme quando o botao de add na sacola for clicado e o adiciona na sacola

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
    // totalDoCarrinho(filmesAdicionadosNaSacola);
}

/** Calcula o total em compras do carrinho */
// const totalDoCarrinho = (listaDeFilmeDoCarrinho) => {
//     const addTotalDoCarrinho = document.querySelector('.confirm-bag .total-price');
    
//     let total = 0;
//     for(filme of filmesAdicionadosNaSacola) {
//         total += Number(filme.valor.replace(',', '.')) * filme.quantidade;
//     }

//     addTotalDoCarrinho.innerText = `R$ ${total.toFixed(2)}`
// }

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