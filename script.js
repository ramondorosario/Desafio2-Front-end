// Temporizador do cupom promocional
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

esconderBanner.addEventListener('click', () => {
    const preencherCupom = document.querySelector('.bag-footer input');
    const cupom = document.querySelector('.content-cupom span');

    const codigoCupom = cupom.innerText.split(': ')[1];

    clearInterval(idTempo);
    preencherCupom.value = codigoCupom;
    esconderBanner.hidden = true;
})
const idTempo = setInterval(temporizador, 1000);