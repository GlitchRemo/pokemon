const fs = require("fs");

const td = (data) => `<td>${data}</td>`;
const th = (data) => `<th>${data}</th>`;
const tr = (data) => `<tr>${data}</tr>`;
const thead = (data) => `<thead>${data}</thead>`;
const tbody = (data) => `<tbody>${data}</tbody>`;
const table = (data) => `<table>${data}</table>`;

const parseRow = (rowData, cellTag) => {
  const row = rowData.map((data) => cellTag(data)).join("");
  return tr(row);
};

const generateTable = (lines, seperator) => {
  const [header, ...body] = lines.split("\n");

  const headerRow = parseRow(header.split(seperator), th);

  const bodyRows = body
    .map((row) => parseRow(row.split(seperator), td))
    .join("");

  const htmlTable = table(thead(headerRow) + tbody(bodyRows));

  return htmlTable;
};

const main = () => {
  const pathToRead = process.argv[2];
  const pathToWrite = process.argv[3];
  const seperator = process.argv[4];

  fs.readFile(pathToRead, "utf-8", (err, content) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const htmlTable = generateTable(content, seperator);
    fs.writeFile(pathToWrite, htmlTable, () => {});
  });
};

main();
