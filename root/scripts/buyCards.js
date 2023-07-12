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
const loadCharacters = async (actualPosition = initial, limit = loadCards) => {

    try {
        pokemones = localStorage.getItem("pokemones");

        //if (!pokemones) {
            //const res = await fetch(url);
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
                    types: [],
                    base_experience: pokemon.base_experience,
                    id: pokemon.id,
                })
            );
            
            let misPokemones = localStorage.getItem("pokemones");
            if (!misPokemones) {
                misPokemones = [];
            } else {
                misPokemones = JSON.parse(misPokemones);
            }
            const newPokemones = misPokemones.concat(pokemones);

            //Se convierte en información local
            localStorage.setItem("pokemones", JSON.stringify(newPokemones));
        // } else {
        //     pokemones = JSON.parse(pokemones);
        // }

        showFirstLoad(pokemones.slice(initial, loadCards));

    } catch (err) {
        console.log(err)
    }
}

loadCharacters();


//Para mostrar más cartas
const siguiente = document.querySelector(".Siguiente");
siguiente.addEventListener("click", function(){
    const misPokemones = JSON.parse(localStorage.getItem("pokemones"));
    loadCharacters(misPokemones.length, loadCards);
});




