/** Encontra as id referente aos diferentes generos */
// const buttons = document.querySelectorAll('.buttons-films');

// for(button of buttons) {
//     button.addEventListener('click', event => {
//         const botaoClicado = event.target;
        
//         if(botaoClicado.innerText === 'Todos') {
//             filmesTodosOsGeneros();
//         } else {
//             // Faz a busca da lista de generos com seus respectivos id
//             fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/genre/movie/list?language=pt-BR')
//                 .then(resposta => {
//                     return resposta.json()
//             })
//                 .then(respostaJson => {
//                     console.log(respostaJson)
//                     let idGenero;
//                     for(item of respostaJson.genres) {                        
//                         if (item.name === botaoClicado.innerText) {                            
//                             fetch(`https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?with_genres=${item.id}&language=pt-BR`)
//                                 .then(resposta => {
//                                     return resposta.json();
//                                 })
//                                     .then(respostaJson => {
//                                         const resultadoGenero = respostaJson.results;                                        
//                                         const listaAnterior = document.querySelectorAll('.films .cards-top-films');

//                                         for(apagar of listaAnterior) {
//                                             apagar.remove();
//                                         }

//                                         filmesPopulares = [];
//                                         criarListaFilmesPopulares(resultadoGenero);
//                                         criarListaTop20();
//                                     })
//                         }
//                     }
//                 })
//             }
        
//     })
// }