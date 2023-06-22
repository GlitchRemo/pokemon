const fs = require("fs");

const createCard = ([
  id,
  name,
  types,
  speed,
  hp,
  xp,
  attack,
  defense,
  weight,
]) => {
  const pokemonTypes = types.split(",");
  const firstType = `<div class="poke-type ${pokemonTypes[0]}">${pokemonTypes[0]}</div>`;
  const secondType = pokemonTypes[1]
    ? `<div class="poke-type ${pokemonTypes[1]}">${pokemonTypes[1]}</div>`
    : "";

  return `<div class="card">
    <div class="avatar-container">
      <img
        src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.padStart(
          3,
          0
        )}.png"
        class="avatar"
      />
    </div>
    <div class="pokemon-name">${name}</div>
    <div class="pokemon-types">
      ${firstType}${secondType}
    </div>
    <div class="stats">
      <div class="pokemon-property">
        <div class="pokemon-property-type">Weight</div>
        <div class="pokemon-property-value">${weight}</div>
      </div>
      <div class="pokemon-property">
        <div class="pokemon-property-type">HP</div>
        <div class="pokemon-property-value">${hp}</div>
      </div>
      <div class="pokemon-property">
        <div class="pokemon-property-type">XP</div>
        <div class="pokemon-property-value">${xp}</div>
      </div>
      <div class="pokemon-property">
        <div class="pokemon-property-type">Attack</div>
        <div class="pokemon-property-value">${attack}</div>
      </div>
      <div class="pokemon-property">
        <div class="pokemon-property-type">Defense</div>
        <div class="pokemon-property-value">${defense}</div>
      </div>
    </div>
  </div>`;
};

const main = (fileToRead, seperator) => {
  fs.readFile(fileToRead, "utf-8", (err, content) => {
    const cards = content
      .split("\n")
      .slice(1)
      .map((pokemon) => createCard(pokemon.split(seperator)))
      .join("\n");
    console.log(`<div class="cards">${cards}</div>`);
  });
};

main(process.argv[2], "|");

/*
1|bulbasaur|grass,poison|45|45|64|49|49|69
*/
