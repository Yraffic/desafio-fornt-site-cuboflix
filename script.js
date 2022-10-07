const movies = document.querySelector('.movies')
const movie = document.querySelectorAll('.movie')
const next = document.querySelector('.btn-next')
const prev = document.querySelector('.btn-prev')
const input = document.querySelector('.input')
const highligthVideo = document.querySelector('.highlight__video')
const highligthVideoLink = document.querySelector('.highlight__video-link')
const highligthTitle = document.querySelector('.highlight__title')
const highligthRating = document.querySelector('.highlight__rating')
const highligthGenres = document.querySelector('.highlight__genres')
const highligthLaunch = document.querySelector('.highlight__launch')
const highligthDiscription = document.querySelector('.highlight__description')
const modal = document.querySelector('.modal')
const modalTitle = document.querySelector('.modal__title')
const modalImg = document.querySelector('.modal__img')
const modalDescription = document.querySelector('.modal__description')
const modalAverage = document.querySelector('.modal__average')
const modalGenres = document.querySelector('.modal__genres')
const modalClose = document.querySelector('.modal__close')
const genresAverage = document.querySelector('.modal__genre-average')
const btnTheme = document.querySelector('.btn-theme')
const body = document.querySelector('body')

const dadosFilmes = []
let pesquisa = []
let pag = 0;

localStorage.setItem('tema', 'claro')

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json()

    promiseBody.then((body) => {
        let arrayTemporario = []
        body.results.forEach((filme) => {
            arrayTemporario.push(filme)
            if (arrayTemporario.length === 5) {
                dadosFilmes.push(arrayTemporario)
                arrayTemporario = []
            }
        });
        pesquisa = dadosFilmes
        redenrizar(pag)
    })


})

next.addEventListener('click', () => {
    pag++
    if (pag >= 4) {
        pag = 0
    }
    apagar()
    redenrizar(pag)
})

prev.addEventListener('click', () => {
    pag--
    if (pag <= 0) {
        pag = 4
    }
    apagar()
    redenrizar(pag)
})

function redenrizar(indice) {
    indice = pag
    pesquisa[indice].forEach((informacoes) => {

        let imagem = document.createElement('div')
        imagem.classList.add('movie')
        imagem.style.backgroundImage = `url("${informacoes.poster_path}")`

        imagem.addEventListener('click', () => {
            modal.classList.remove('hidden')
            fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/' + informacoes.id + '?language=pt-BR').then((resposta) => {
                const promiseBody = resposta.json()

                promiseBody.then((body) => {

                    modalTitle.textContent = body.title
                    modalImg.src = body.backdrop_path
                    modalDescription.textContent = body.overview
                    modalAverage.textContent = body.vote_average

                })

                promiseBody.then((body) => {
                    body.genres.forEach((nome) => {
                        const modalGenre = document.querySelector('span')
                        modalGenre.classList.add('modal__genre')
                        modalGenre.textContent = nome.name

                        modalGenres.append(modalGenre)
                    })
                })
            })

        })

        const filmeInfo = document.createElement('div')
        filmeInfo.classList.add('movie_info')
        const tituloDoFilme = document.createElement('span')
        tituloDoFilme.classList.add('movie_title')
        tituloDoFilme.textContent = informacoes.title
        const avaliacaoDoFilme = document.createElement('span')
        avaliacaoDoFilme.classList.add('movie_rating')
        avaliacaoDoFilme.textContent = informacoes.vote_average
        const imgEstrela = document.createElement('img')
        imgEstrela.src = './assets/estrela.svg'
        imgEstrela.alt = 'estrela'

        avaliacaoDoFilme.append(imgEstrela)
        imagem.append(filmeInfo, tituloDoFilme, avaliacaoDoFilme)
        movies.append(imagem)

    })
}

function apagar() {
    const movie = document.querySelectorAll('.movie')
    movie.forEach((filme) => {
        filme.parentNode.removeChild(filme)
    })
}

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value === '') {
        pesquisa = dadosFilmes
        pag = 0
        apagar()
        redenrizar(pag)
        return
    }

    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=' + input.value).then((resposta) => {
        const promise = resposta.json()
        promise.then((body) => {
            pesquisa = []
            let arrayTemporario = []
            body.results.forEach((filme) => {
                arrayTemporario.push(filme)
                if (arrayTemporario.length === 5) {
                    pesquisa.push(arrayTemporario)
                    arrayTemporario = []
                }
            });
            pag = 0
            apagar()
            redenrizar(pag)
        })
    })

})

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json()
    promiseBody.then((body) => {
        highligthVideo.style.backgroundImage = `url("${body.backdrop_path}")`
        highligthTitle.textContent = body.title
        highligthRating.textContent = body.vote_average
        highligthGenres.textContent = `${body.genres[0].name}, ${body.genres[1].name}, ${body.genres[2].name}`
        highligthLaunch.textContent = new Date(body.release_date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC"
        })
        highligthDiscription.textContent = body.overview
    })
})

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json()
    promiseBody.then((body) => {
        highligthVideoLink.href = 'https://www.youtube.com/watch?v=' + body.results[0].key
    })
})
function apagarGenres() {
    const genero = document.querySelectorAll('.modal__genre')
    genero.forEach((genre) => {
        genre.parentNode.removeChild(genre)
    })

}
modalClose.addEventListener('click', () => {
    modal.classList.add('hidden')
    apagarGenres()
})

btnTheme.addEventListener('click', () => {
    const tema = localStorage.getItem('tema')
    if (tema === 'claro') {
        localStorage.setItem('tema', 'escuro')
        btnTheme.src = "./assets/dark-mode.svg"
        next.src = "./assets/seta-direita-branca.svg"
        prev.src = "./assets/seta-esquerda-branca.svg"
        body.style.setProperty('--background-color', '#242424')
        body.style.setProperty('--highlight-background', '#454545')
        body.style.setProperty('--color', '#FFF')
        body.style.setProperty('--highlight-color', '#FFF')
        body.style.setProperty('--highlight-description', '#FFF')
    } else {
        localStorage.setItem('tema', 'claro')
        btnTheme.src = "./assets/light-mode.svg"
        next.src = "./assets/seta-direita-preta.svg"
        prev.src = "./assets/seta-esquerda-preta.svg"
        body.style.setProperty('--background-color', '#FFF')
        body.style.setProperty('--highlight-background', '#FFF')
        body.style.setProperty('--color', '#000')
        body.style.setProperty('--highlight-color', '#000')
        body.style.setProperty('--highlight-description', '#000')
    }
})