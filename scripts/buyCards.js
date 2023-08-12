const containerCharacters = document.querySelector(".ContainerCards");
const tarjetaCompleta = document.querySelector(".tarjetaCompleta");

//Inicialización de variables
let url = 'https://pokeapi.co/api/v2/pokemon';
let template = "";
let initial = 0;
let loadCards = 20;

let pokemones = [];

//Crea la carta
const showFirstLoad = (pokemones) => {
    
    pokemones.forEach(async (pokemon) => {
        let Carta = document.createElement("div")
        Carta.className = "TarjetaIndividual";
        Carta.innerHTML = `
                <div>
                    <p>${pokemon.name}</p>
                    <i class="fa-sharp fa-regular fa-heart"></i>
                </div>
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}" class="ImagenPokemon"></img>
                <div>
                    <p><b>Exp ${pokemon.base_experience} </b></p>
                    <button class="BotonCompra">Buy</button>
                </div>
            `;
            containerCharacters.appendChild(Carta); //El div de Carta se pone al contenedor de caracteres

        //Para conteo de cartas
        let misPokemones = JSON.parse(localStorage.getItem("pokemones"));
        const numberCards =document.querySelector('.number');  //capturo la parte del conteo
        numberCards.textContent= `${misPokemones.length} Cards`;  //muestro las cartas que se están mostrando en el momento
    });

    
}

//Carga la información para la tarjeta
const loadCharacters = async (actualPosition = initial, limit = loadCards, firstLoad = true) => {

    try {
        
        if(firstLoad) {
            localStorage.setItem("pokemones", JSON.stringify([]));
        }
        pokemones = localStorage.getItem("pokemones");

        //Se crean las posiciones desde las cuales se va a cargar la pagina
        const res = await fetch(url + '?offset='+actualPosition+'&limit='+limit);
        const data = await res.json();

        const pokemonData = await Promise.all(
            //Recorrido para extraer la información
            data.results.map(async (pokemon) => {
                const urlPokemon = await fetch(pokemon.url);
                return urlPokemon.json();
            })
        );

        //Se almacena la información (nombre, tipo, experiencia y sprites) de pokemonData en pokemones
        pokemones = pokemonData.map((pokemon) => ({
                name: pokemon.name,
                sprites: pokemon.sprites,
                types: pokemon.types.map(objeto => objeto.type.name),
                base_experience: pokemon.base_experience,
                id: pokemon.id,
            })
        );
        
        //Se almacena la información del local storage en una nueva variable para hacer concatenación 
        let misPokemones = localStorage.getItem("pokemones");
        if (!misPokemones) {
            misPokemones = [];
        } else {
            misPokemones = JSON.parse(misPokemones);
        }
        const newPokemones = misPokemones.concat(pokemones);

        //Se convierte en información local
        localStorage.setItem("pokemones", JSON.stringify(newPokemones));

        showFirstLoad(pokemones.slice(initial, loadCards));

    } catch (err) {
        console.log(err)
    }
}

loadCharacters();


//Para mostrar más cartas, se capturan cartas, se convierten los strings en objetos
const siguiente = document.querySelector(".Siguiente");
siguiente.addEventListener("click", function(){
    const misPokemones = JSON.parse(localStorage.getItem("pokemones"));
    loadCharacters(misPokemones.length, loadCards, false);
});

//Para filtrar 

async function seleccionFiltro(type){
    //Obtengo los pokemones de la localstorage
    let misPokemones = localStorage.getItem("pokemones");
    if (!misPokemones) {
        misPokemones = [];
    } else {
        misPokemones = JSON.parse(misPokemones);
    }

    //Limpio html
    containerCharacters.innerHTML = ''
    
    // Filtro dependiendo el tipo
    switch(type){
        case 'All':
            console.log('Soy All');
            await loadCharacters();
        break;
        case 'Air':
            //Filtro el tipo
            const filterTwo = await misPokemones.filter(pokemones => pokemones.types.includes('flying'));
            //Refresco localstorage
            localStorage.setItem("pokemones", JSON.stringify(filterTwo));
            //Refresco HTML
            await showFirstLoad(filterTwo);

        break;
        case 'Fire':
            //Filtro el tipo
            const filterThree = await misPokemones.filter(pokemones => pokemones.types.includes('fire'));
            //Refresco localstorage
            localStorage.setItem("pokemones", JSON.stringify(filterThree));
            //Refresco HTML
            await showFirstLoad(filterThree);

        break;
        case 'Water':
            //Filtro el tipo
            const filterFour = await misPokemones.filter(pokemones => pokemones.types.includes('water'));
            //Refresco localstorage
            localStorage.setItem("pokemones", JSON.stringify(filterFour));
            //Refresco HTML
            await showFirstLoad(filterFour);
        break;
        
    }

}





