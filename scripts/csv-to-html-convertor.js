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

const createElement = (content, tag, attributes = {}) => {
  const classAttribute = attributes.className
    ? `class="${attributes.className}"`
    : "";
  const styleAttribute = attributes.style ? `style="${attributes.style}"` : "";

  return `<${tag} ${classAttribute} ${styleAttribute}>${content}</${tag}>`;
};

const generatePokemonImage = (id) => {
  const urlId = id.toString().padStart(3, 0);
  const url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${urlId}.png`;
  const className = "avatar";
  const style = `background-image: url(${url})`;

  return createElement("", "div", { className, style });
};

const transformAttributes = (attributes, headings) => {
  const features = headings.map((heading) => {
    const th = createElement(heading, "th");
    const td = createElement(attributes[heading], "td");
    return createElement(th + td, "tr");
  });

  const tabulatedFeatures = createElement(features.join(""), "table");
  return createElement(tabulatedFeatures, "div", { className: "information" });
};

const createCard = ({ id, name, ...attributes }) => {
  const attributesNames = [
    "types",
    "weight",
    "hp",
    "base_experience",
    "attack",
    "defense",
  ];
  const pokemonImage = generatePokemonImage(id);

  const imageContainer = createElement(pokemonImage, "div", {
    className: "image-container",
  });
  const avatarName = createElement(name, "div", { className: "name" });
  const features = transformAttributes(attributes, attributesNames);

  const card = createElement(imageContainer + avatarName + features, "div", {
    className: "card",
  });

  return card;
};

const transformCsv = (content, seperator) => {
  const [headings, ...properties] = content.split("\n");

  const pokemons = properties.map((property) =>
    parseRow(headings.split(seperator), property.split(seperator))
  );

  return chunk(pokemons, 4, 0);
};

const generateHtml = (pokemons) => {
  const cards = pokemons.map((quadrat) => {
    const cardRow = quadrat
      .map((cardContent) => createCard(cardContent))
      .join("");

    return createElement(cardRow, "div", { className: "card-row" });
  });

  return createElement(cards.join(""), "div", { className: "card-collection" });
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
