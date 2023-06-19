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

const createElement = (content, tag, className) => {
  const classAttribute = className ? `class="${className}"` : "";
  return `<${tag} ${classAttribute}>${content}</${tag}>`;
};

const transpileProperties = (properties, headings) => {
  const rows = headings.map((heading) => {
    const th = createElement(heading, "th");
    const td = createElement(properties[heading], "td");
    return createElement(th + td, "tr");
  });

  const table = createElement(rows.join(""), "table");
  return table;
};

const transpileCard = ({ id, name, ...attributes }) => {
  const attributesNames = ["types", "weight", "HP", "XP", "attack", "defense"];
  const image = createElement("", "div", "image");
  const title = createElement(name, "div", "name");
  const properties = transpileProperties(attributes, attributesNames);
  const information = createElement(properties, "div", "information");

  const card = createElement(image + title + information, "div", "card");

  return card;
};

const transpileCollection = (content, seperator) => {
  const [headings, ...properties] = content.split("\n");

  const cardsData = properties.map((property) =>
    parseRow(headings.split(seperator), property.split(seperator))
  );

  const cardsQuadrets = chunk(cardsData, 4, 0);

  const cards = cardsQuadrets.map((quadrat) => {
    const cardRow = quadrat
      .map((cardContent) => transpileCard(cardContent))
      .join("");

    return createElement(cardRow, "div", "card-row");
  });

  const cardCollection = createElement(
    cards.join(""),
    "div",
    "card-collection"
  );

  return cardCollection;
};

const main = () => {
  const csvFilePath = process.argv[2];
  const htmlFilePath = process.argv[3];

  fs.readFile(csvFilePath, "utf-8", (err, content) => {
    if (err) {
      console.log(err.message);
    }

    const cardCollection = transpileCollection(content, "|");
    fs.writeFile(htmlFilePath, cardCollection, () => {});
  });
};

main();
