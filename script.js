"use strict";

let results = [];

async function getReferences() {
  let responseToJSON = await getPokemons(pokemon_api);
  // console.log(responseToJSON);
  results = responseToJSON["results"];
  init(results);
  renderLinks();
}

async function init(results) {
  let container = document.getElementById("container");
  container.innerHTML = "";
  await render(results);
}

/**
 * get the data from the pokedex API
 * @param {string} url - url of the pokemon API
 * @returns the fetched data in JSON format
 */

async function getPokemons(url) {
  let response = await fetch(url);
  let responseToJSON = await response.json();
  return responseToJSON;
}

async function loadMore() {
  let responseToJSON = await getPokemons(pokemon_api);
  let next = responseToJSON["next"];
  let nextPokemon = await getPokemons(next);
  let responses = nextPokemon["results"];
  results.push(...responses);
  await render(responses);
  pokemon_api = next;
}

async function render(results) {
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const name = result["name"];
    const url = result["url"];
    const pokemon = await getPokemons(url);
    const types = pokemon["types"];
    const stats = pokemon["stats"];
    const height = pokemon["height"];
    const weight = pokemon["weight"];
    const id = pokemon["id"];
    const image = pokemon["sprites"]["other"]["home"]["front_shiny"];
    container.innerHTML += markupRender(name, id, height, weight, image, i);
    // pokemonType(types, i);
    statPokemon(stats, i);
  }
}

/**
 *
 * @param {string} name - name of current pokemon
 * @param {Number} id - ID of current Pokemon
 * @param {Number} height - Height of current Pokemon
 * @param {Number} weight - Weight of current Pokemon
 * @param {string} image - path of the image of current Pokemon
 * @param {Number} index - index of current Pokemon in Array
 * @returns HTML template
 */
function markupRender(name, id, height, weight, image, index) {
  const idToString = String(id);
  return ` <a class="link" href="#" onclick="showPokemon(${id})">
  <img class="pokemon-img" src="${image}" alt=${name}>
  <div id="name${index}" class="infos">
      ${name}
  </div>
  <div id="ID${index}" class="infos">
      #${idToString.padStart(3, "0")}
  </div>
</a>`;
}

// function markupRender(name, height, weight, image, index) {
//   return ` <a class="link" href="#">
//   <img class="pokemon-img" src="${image}" alt="">
//   <div id="name${index}" class="infos">
//   ${name} <br>
//   <canvas id="myCharts"></canvas>
// </div>
//   <div class="state" id='stat${index}'>
//      <span>Height: </span> ${height} cm<br>
//       <span>Weight: </span> ${weight} kg

//   </div>
// </a>`;
// }

/**
 *
 * @param {Array} types - Array of types of the pokemon
 * @param {number} index - index of the current Pokemon
 */
function pokemonType(types, index) {
  let elem = document.getElementById(`name${index}`);
  for (let j = 0; j < types.length; j++) {
    const type = types[j];
    const type_name = type["type"]["name"];
    elem.innerHTML += /*html*/ `<div>${type_name}</div>`;
  }
}

function displayPokemonInfos() {
  return `<div></div>`;
}

async function search() {
  let container = document.getElementById("container");
  let input = document.getElementById("input").value;
  let inputToLowerCase = typeof input === "string" ? input.toLowerCase() : input;
  container.innerHTML = "";

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const name = result["name"];
    const url = result["url"];
    const pokemon = await getPokemons(url);
    const stats = pokemon["stats"];
    const height = pokemon["height"];
    const weight = pokemon["weight"];
    const id = pokemon["id"];
    const image = pokemon["sprites"]["other"]["home"]["front_shiny"];

    if (inputToLowerCase === name.substring(0, inputToLowerCase.length).toLowerCase() || inputToLowerCase === String(id)) {
      container.innerHTML += /*html*/ `
        <a class="link" href="#">
            <img class="pokemon-img" src="${image}" alt="">
            <div id="name${i}" class="infos">
                ${name}
            </div>
            <div id="ID${i}" class="infos">
                #${String(id).padStart(3, "0")}
          </div>
        </a>`;
      statPokemon(stats, i);
    }
  }
}
let flag = 1;

async function showPokemon(id) {
  const glideSlide = document.getElementById("glideSlide");
  const glideArrows = document.getElementById("glideArrows");
  const btnExit = document.getElementById("btn-exit");
  const overlay = document.getElementById("overlay");
  document.documentElement.classList.add("html-overflow");
  overlay.style.display = "block";
  glideSlide.style.display = "flex";
  glideArrows.style.display = "block";
  btnExit.style.display = "block";

  const glideEl = document.getElementById("glideId");
  glideEl.classList.remove("d-none");
  const currentPokemon = results.filter((result, index) => id === index + 1).pop();
  const url = currentPokemon["url"];
  const name = currentPokemon["name"];
  const pokemon = await getPokemons(url);
  const image = pokemon["sprites"]["other"]["home"]["front_shiny"];
  const stats = pokemon["stats"];
  const types = pokemon["types"];
  const pokemonHeight = pokemon["height"];
  const pokemonWeight = pokemon["weight"];
  const abilities = pokemon["abilities"];
  const imageEl = document.getElementById("img-current-pokemon");
  const heightEl = document.getElementById("height");
  const weightEl = document.getElementById("weight");
  const typesEl = document.getElementById("types");
  const abilitiesEl = document.getElementById("abilities");
  imageEl.setAttribute("src", image);
  heightEl.innerHTML = pokemonHeight;
  weightEl.innerHTML = pokemonWeight;
  typesEl.innerHTML = formatPokemonTypes(types);
  abilitiesEl.innerHTML = formatPokemonAbilities(abilities);
  const statistics = generateArray(stats);
  chart(statistics[2], statistics[0], name);
  flag = id;
}

async function previousPokemon() {
  flag = flag <= 1 ? results.length : flag;
  const currentPokemon = results.filter((result, index) => flag - 1 === index + 1).pop();
  const url = currentPokemon["url"];
  const name = currentPokemon["name"];
  const pokemon = await getPokemons(url);
  const image = pokemon["sprites"]["other"]["home"]["front_shiny"];
  const stats = pokemon["stats"];
  const types = pokemon["types"];
  const pokemonHeight = pokemon["height"];
  const pokemonWeight = pokemon["weight"];
  const abilities = pokemon["abilities"];
  const heightEl = document.getElementById("height");
  const weightEl = document.getElementById("weight");
  const typesEl = document.getElementById("types");
  const abilitiesEl = document.getElementById("abilities");
  const imageEl = document.getElementById("img-current-pokemon");
  imageEl.setAttribute("src", image);
  heightEl.innerHTML = pokemonHeight;
  weightEl.innerHTML = pokemonWeight;
  typesEl.innerHTML = formatPokemonTypes(types);
  abilitiesEl.innerHTML = formatPokemonAbilities(abilities);
  const statistics = generateArray(stats);
  chart(statistics[2], statistics[0], name);
  flag--;
}

async function nextPokemon() {
  flag = flag >= results.length ? 1 : flag;
  const currentPokemon = results.filter((result, index) => flag + 1 === index + 1).pop();
  const url = currentPokemon["url"];
  const name = currentPokemon["name"];
  const pokemon = await getPokemons(url);
  const image = pokemon["sprites"]["other"]["home"]["front_shiny"];
  const stats = pokemon["stats"];
  const abilities = pokemon["abilities"];
  const types = pokemon["types"];
  const pokemonHeight = pokemon["height"];
  const pokemonWeight = pokemon["weight"];
  const heightEl = document.getElementById("height");
  const weightEl = document.getElementById("weight");
  const typesEl = document.getElementById("types");
  const abilitiesEl = document.getElementById("abilities");

  const imageEl = document.getElementById("img-current-pokemon");
  imageEl.setAttribute("src", image);
  const statistics = generateArray(stats);

  chart(statistics[2], statistics[0], name);
  heightEl.innerHTML = pokemonHeight;
  weightEl.innerHTML = pokemonWeight;
  typesEl.innerHTML = formatPokemonTypes(types);
  abilitiesEl.innerHTML = formatPokemonAbilities(abilities);
  flag++;
}

function formatPokemonTypes(types) {
  return types.map((type) => type["type"]["name"]).join(" | ");
}
function formatPokemonAbilities(abilities) {
  return abilities.map((ability) => ability["ability"]["name"]).join(" | ");
}

function exitView() {
  const glideSlide = document.getElementById("glideSlide");
  const glideArrows = document.getElementById("glideArrows");
  const btnExit = document.getElementById("btn-exit");
  const overlay = document.getElementById("overlay");
  document.documentElement.classList.remove("html-overflow");
  overlay.style.display = "none";
  glideSlide.style.display = "none";
  glideArrows.style.display = "none";
  btnExit.style.display = "none";
}

function generateArray(objArray) {
  const base_stat = objArray.map((obj) => obj["base_stat"]);
  const effort = objArray.map((obj) => obj["effort"]);
  const stat_name = objArray.map((obj) => obj["stat"]["name"]);
  return [base_stat, effort, stat_name];
}

async function getAbilities(abilities) {
  let container = document.getElementById("canvas-container");
  container.innerHTML = "";
  for (let i = 0; i < abilities.length; i++) {
    const ability = abilities[i];
    const abilityName = ability["ability"]["name"];
    const abilityUrl = ability["ability"]["url"];
    const pokemon = await getPokemons(abilityUrl);
    const effect_entries = pokemon["effect_entries"][1];
    const short_effect = effect_entries["short_effect"];
    container.innerHTML += /*html*/ `
<div>
  <h2>${abilityName}</h2>
  <p>${short_effect}</p>
</div>
`;
  }
}

async function statPokemon(stats, index) {
  let elem = document.getElementById(`stat${index}`);
  for (let j = 0; j < stats.length; j++) {
    const stat = stats[j];
    const stat_value = stat["base_stat"];
    const stat_name = stat["stat"]["name"];
  }
}

function chart(x_stat, y_stat, pokemon_name = "") {
  document.getElementById("canvas-container").innerHTML = `<canvas id="myChart" height="300" width="300"></canvas>`;
  const ctx = document.getElementById("myChart");

  const myData = {
    type: "bar",
    data: {
      labels: x_stat,
      datasets: [
        {
          label: "Value of statistics",
          data: y_stat,
          backgroundColor: generateColor(y_stat, 0.4),
          borderColor: generateColor(y_stat),
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "white",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Statistics of ${pokemon_name ? pokemon_name.toUpperCase() : "Pokémon"}`,
          color: "white",
          font: {
            size: 18,
          },
        },
        legend: {
          labels: {
            color: "whitesmoke",
            font: {
              size: 14,
            },
          },
        },
      },
    },
  };

  new Chart(ctx, myData);
}

function generateColor(array, opacity = 1) {
  return array.map(() => `rgba(${generateValue()},${generateValue()},${generateValue()},${opacity})`);
}

function generateValue() {
  return Math.random() * 255 + 1;
}

async function renderLinks() {
  let linkId = document.getElementById("links");
  linkId.innerHTML = "";
  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    linkId.innerHTML += /*html*/ `
      <a class='removeBorder' href=${link.url} target="_blank">
      <img class="link-icon" src=${link.icon} alt=${link.name} />
      </a>`;
  }
}
