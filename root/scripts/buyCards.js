const containerCharacters = document.querySelector(".ContainerCards");
const tarjetaCompleta = document.querySelector(".tarjetaCompleta");
const moreCards = document.querySelector(".moreCardsButton");
//const numberCards =document.querySelector('.number');


let url = 'https://pokeapi.co/api/v2/pokemon';
let template = "";
let initial = 0;
let loadCards = 16;
let number = 16;
//numberCards.textContent=`${number} cards`;

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
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="ImagenPokemon"></img>
                <div>
                    <p><b>Exp ${pokemon.base_experience} </b></p>
                    <button>Buy</button>
                </div>
            `;
            containerCharacters.appendChild(Carta); //El div de Carta se pone al contenedor de caracteres
    });

    
}

//Carga la información para la tarjeta
const loadCharacters = async () => {

    try {
        pokemones = localStorage.getItem("pokemones");

        if (!pokemones) {
            const res = await fetch(url);
            const data = await res.json();

            const pokemonData = await Promise.all(
                //Recorrido para extraer la información
                data.results.map(async (link) => {
                    const urlPokemon = await fetch(link.url);
                    console.log(urlPokemon);
                    return urlPokemon.json();
                })
            );

            //Se almacena la información (nombre, tipo, experiencia y sprites) de pokemonData en pokemones
            pokemones = pokemonData.map(
                ({ name, sprites, types, base_experience, }) => ({
                    name,
                    sprites: sprites.other.home,
                    types,
                    base_experience,
                })
            );

            //Se convierte en información local
            localStorage.setItem("pokemones", JSON.stringify(pokemones));
        } else {
            pokemones = JSON.parse(pokemones);
        }

        showFirstLoad(pokemones.slice(initial, loadCards));

    } catch (err) {
        console.log(err)
    }
}

loadCharacters();

moreCards.addEventListener("click", (event) =>{
    initial += 16;
    number += 16;
    showFirstLoad();
    //numberCards.textContent=`${number} cards`;
    event.preventDefault();
});



