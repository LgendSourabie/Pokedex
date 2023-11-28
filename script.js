"use strict";

let pokemon_api = `https://pokeapi.co/api/v2/pokemon/`;
let results = [];

async function getReferences() {
  let responseToJSON = await getPokemons(pokemon_api);
  console.log(responseToJSON);
  results = responseToJSON["results"];
  init(results);
}

async function init(results) {
  let container = document.getElementById("container");
  container.innerHTML = "";
  await render(results);
}

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

// let namePokemons = [];

async function render(results) {
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const name = result["name"];
    const url = result["url"];
    const pokemon = await getPokemons(url);
    // console.log(pokemon);
    const types = pokemon["types"];
    const stats = pokemon["stats"];
    const height = pokemon["height"];
    const weight = pokemon["weight"];
    const image = pokemon["sprites"]["other"]["home"]["front_shiny"];
    container.innerHTML += /*html*/ `
            <a class="link" href="#">
                <img class="pokemon-img" src="${image}" alt="">
                <div id="name${i}" class="infos">
                ${name} <br>
                <canvas id="myChart"></canvas>
            </div>
                <div class="stat" id='stat${i}'>
                   <span>Height: </span> ${height} cm<br>
                    <span>Weight: </span> ${weight} kg

                </div>
            </a>`;
    // pokemonType(types, i);
    statPokemon(stats, i);
  }
}

function pokemonType(types, index) {
  let elem = document.getElementById(`name${index}`);
  for (let j = 0; j < types.length; j++) {
    const type = types[j];
    const type_name = type["type"]["name"];
    elem.innerHTML += /*html*/ `<div>${type_name}</div>`;
  }
}

async function statPokemon(stats, index) {
  let elem = document.getElementById(`stat${index}`);
  for (let j = 0; j < stats.length; j++) {
    const stat = stats[j];
    const stat_value = stat["base_stat"];
    const stat_name = stat["stat"]["name"];
    // elem.innerHTML += /*html*/ `<div>${stat_name}</div>`;
  }
}

async function chart(x_stat, y_stat) {
  const ctx = document.getElementById("myChart");

  const data = {
    labels: x_stat,
    datasets: [
      {
        label: "Stat pokemon",
        data: y_stat,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  new Chart(ctx, data);
}

async function filter() {}

async function search() {
  let container = document.getElementById("container");
  let input = document.getElementById("input").value;
  let inputToLowerCase = input.toLowerCase();
  container.innerHTML = "";

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const name = result["name"];
    const url = result["url"];
    const pokemon = await getPokemons(url);
    const types = pokemon["types"];
    const stats = pokemon["stats"];
    const height = pokemon["height"];
    const weight = pokemon["weight"];
    const image = pokemon["sprites"]["other"]["home"]["front_shiny"];
    if (
      inputToLowerCase ===
      name.substring(0, inputToLowerCase.length).toLowerCase()
    ) {
      container.innerHTML += /*html*/ `
        <a class="link" href="#">
            <img class="pokemon-img" src="${image}" alt="">
            <div id="name${i}" class="infos">
            ${name} <br>
            <canvas id="myChart"></canvas>
        </div>
            <div class="stat" id='stat${i}'>
               <span>Height: </span> ${height} cm<br>
                <span>Weight: </span> ${weight} kg

            </div>
        </a>`;
      statPokemon(stats, i);
    }
  }
}
