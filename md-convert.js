const showdown = require("showdown");
converter = new showdown.Converter({});

function convertMarkdown(md) {
  return converter.makeHtml(md);
}

module.exports = {
  convertMarkdown,
};
