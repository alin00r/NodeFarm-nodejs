const fs = require('fs');
const http = require('http');
const slugify = require('slugify');
const hostname = '127.0.0.1';
const port = 2020;
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');
//FILES
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName), { lower: true });
console.log(slugs);

//SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathname = req.url;

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    // console.log(query);
    res.end(output);

    //product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);

    //ERORR
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello world',
    });
    res.end('<h1>Page not found !</h1>');
  }
});

server.listen(port || 3000, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
