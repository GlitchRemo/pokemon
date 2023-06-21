const fs = require("fs");

const chunk = function (list, size, overlap) {
  if (list.length === 0) return list;

  if (list.length <= overlap) return [list];

  const currentChunk = list.slice(0, size);
  const remaining = list.slice(size - overlap);
  return [currentChunk].concat(chunk(remaining, size, overlap));
};

const parseRow = (headings, rowData) => {
  return Object.fromEntries(rowData.map((data, i) => [headings[i], data]));
};

const createElement = (content, attributes = {}, tag = "div") => {
  const classAttribute = attributes.className
    ? `class="${attributes.className}"`
    : "";
  const styleAttribute = attributes.style ? `style="${attributes.style}"` : "";

  return `<${tag} ${classAttribute} ${styleAttribute}>${content}</${tag}>`;
};

const createTable = (rows) => createElement(rows, {}, "table");

const generatePokemonImage = (id) => {
  const urlId = id.toString().padStart(3, 0);
  const url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${urlId}.png`;
  const className = "avatar";
  const style = `background-image: url(${url})`;

  return createElement("", { className, style });
};

const createFeature = (name, value) => {
  let featureValue = value;

  if (name === "Types") {
    featureValue = value
      .split(",")
      .map((type) =>
        createElement(type, { className: `poketype ${type}` }, "span")
      )
      .join("");
  }

  const tableHeading = createElement(name, {}, "th");
  const tableData = createElement(featureValue, {}, "td");

  return createElement(tableHeading + tableData, {}, "tr");
};

const createCard = ({
  id,
  name,
  types,
  weight,
  hp,
  base_experience,
  attack,
  defense,
}) => {
  const pokemonImage = generatePokemonImage(id);
  const imageContainer = createElement(pokemonImage, {
    className: "image-container",
  });
  const avatarName = createElement(name, { className: "name" });

  let features = createFeature("Types", types);
  features += createFeature("Weight", weight);
  features += createFeature("HP", hp);
  features += createFeature("XP", base_experience);
  features += createFeature("Attack", attack);
  features += createFeature("defense", defense);

  const information = createTable(features);
  const informationContainer = createElement(information, {
    className: "information",
  });

  return createElement(imageContainer + avatarName + informationContainer, {
    className: "card",
  });
};

const transformCsv = (content, seperator) => {
  const [headings, ...properties] = content.split("\n");

  const pokemons = properties.map((property) =>
    parseRow(headings.split(seperator), property.split(seperator))
  );

  return pokemons;
};

const generateHtml = (pokemons) => {
  const cards = pokemons.map((cardContent) => createCard(cardContent)).join("");

  return createElement(cards, { className: "card-collection" });
};

const main = () => {
  const csvFilePath = process.argv[2];
  const htmlFilePath = process.argv[3];
  const seperator = "|";

  fs.readFile(csvFilePath, "utf-8", (err, content) => {
    if (err) {
      console.log(err.message);
    }

    const pokemons = transformCsv(content, seperator);
    const cards = generateHtml(pokemons);

    fs.writeFile(htmlFilePath, cards, () => {});
  });
};

main();
