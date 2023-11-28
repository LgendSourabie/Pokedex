"use strict";

async function loadPokemon() {
  let url = `https://pokeapi.co/api/v2/pokemon/bulbasaur`;

  let response = await fetch(url);
  let responseAsJson = await response.json();
  console.log(responseAsJson);
  render(responseAsJson);
}

function render(ele) {
  document.getElementById("name").innerHTML = `${ele["name"]}`;
  let image = ele["sprites"]["front_shiny"];
  document.getElementById("pokedex").innerHTML += `<img src='${image}'>`;
}
