const express = require("express");
const fs = require("fs");
const { convertMarkdown } = require("./md-convert");
const path = require("path");

var app = express();

const base = "./articles";

app.get("/", function (req, res) {
  let md =
    '<head><link rel="stylesheet" href="/index.css" type="text/css"></link></head><body>';
  if (fs.existsSync(`${base}/header.md`)) {
    md += convertMarkdown(
      fs.readFileSync(`${base}/header.md`, { encoding: "utf-8" })
    );
  }

  if (fs.existsSync(base)) {
    for (const dirName of fs.readdirSync(base)) {
      const directory = `${base}/${dirName}`;
      md += "<article>";
      if (fs.lstatSync(directory).isDirectory()) {
        if (fs.existsSync(`${directory}/title.md`)) {
          md += `<a href='/${dirName}'>${convertMarkdown(
            fs.readFileSync(`${directory}/title.md`, { encoding: "utf-8" })
          )}</a>`;

          if (fs.existsSync(`${directory}/summary.md`)) {
            md += convertMarkdown(
              fs.readFileSync(`${directory}/summary.md`, { encoding: "utf-8" })
            );
          }
        }
      }
      md += "</article>";
    }
  }

  if (fs.existsSync(`${base}/footer.md`)) {
    md += convertMarkdown(
      fs.readFileSync(`${base}/footer.md`, { encoding: "utf-8" })
    );
  }

  md += "</body>";

  res.contentType = "text/html";
  res.send(md);
});

app.get("*", function (req, res, next) {
  const extension = path.extname(req.url);
  if (!extension) {
    let url = `${base}${req.url}`;
    const titleUrl = `${url}/title.md`;
    if (!extension) {
      url += "/index.md";
    }
    res.contentType = "text/html";

    let cssUrl = fs.existsSync(`${base}${req.url}/index.css`)
      ? `${req.url}/index.css`
      : "/index.css";

    let md = `<head><link rel="stylesheet" href="${cssUrl}" type="text/css"></head><body>`;
    if (fs.existsSync(titleUrl)) {
      md += convertMarkdown(fs.readFileSync(titleUrl, { encoding: "utf-8" }));
    }

    if (fs.existsSync(url)) {
      md += convertMarkdown(fs.readFileSync(url, { encoding: "utf-8" }));
    } else {
      res.sendStatus(404).send();
      return;
    }
    md += '<a href="/">Home</a>';
    md += "</body>";

    md = md.replace(/src="\.\/(.*)"/gi, `src="${path.basename(req.url)}/$1"`);
    res.send(md);

    return;
  }

  next();
});

app.use(express.static(base));

app.listen(8080, function () {
  console.log("Server running on http://localhost:8080");
});
