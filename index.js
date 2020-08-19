const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemp = require('./replaceTemp');
// const { dirname } = require('path');

/////////////////////////////////////////////////////////////////
// const readingFiles = (filePath) => {
// 	return {
// 		async readingFile() {
// 			fs.readFile(filePath, 'utf-8', (err, data) => {
// 				console.log(data);
// 			});
// 		},
// 	};
// };
//
// const controller = async () => {
// 	await readingFiles('./node-farm/txt/final.txt').readingFile();
// 	await readingFiles('./node-farm/txt/input.txt').readingFile();
// };
//
// controller();
/////////////////////////////////////////////////////////////////


// Reading Files
const data = fs.readFileSync(`${__dirname}/node-farm/dev-data/data.json`,'utf-8');
const objData = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/node-farm/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/node-farm/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/node-farm/templates/template-product.html`, 'utf-8');

let test = [{}];
const slugs = objData.map(el => slugify(el.productName, {replacement:'-', lower: true}));
const check = objData.forEach((curr, index) => {
    test[index] = curr.id[index] = slugs[index];

})


// SERVER
const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);

    

    // Overview Page
	if (pathname === '/overview' || pathname === '/') {

        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = objData.map((el) => replaceTemp(tempCard, el)).join('');

        const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
        res.end(output);
        

        // Product Page
	} else if (pathname === '/product') {

        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = objData[query.id];
        const output = replaceTemp(tempProduct, product)

        res.end(output);
    
        // API page
	} else if (pathname === '/api') {

        res.writeHead(200, {
            'Content-type': 'application/json',
        });

        res.end(data);

        // Not Found Page
    } else {

        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Created By @HarrisK'
        });

        res.end(`<h1>404 Page Not Found</h1>`)
    }



});

server.listen(3000, '127.0.0.1', () => {
	console.log('listening');
});


