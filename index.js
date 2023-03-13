const http = require('http');
const fs = require('fs');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

const tempCard = fs.readFileSync(
    `${__dirname}/templates/temp_card.html`,
    'utf-8'
);

const tempHome = fs.readFileSync(
    `${__dirname}/templates/temp_home.html`,
    'utf-8'
);

const tempArticle = fs.readFileSync(
    `${__dirname}/templates/temp_article.html`,
    'utf-8'
);

const replace = (template, article) => {
    let temp = template.replace(/{%TITLE%}/g, article.title);
    temp = temp.replace(/{%AUTHOR%}/g, article.author);
    temp = temp.replace(/{%PUBLISHED%}/g, article.published);
    temp = temp.replace(/{%READINGTIME%}/g, article.readingtime);
    temp = temp.replace(/{%TOPIC%}/g, article.topics);
    temp = temp.replace(/{%SUMMARY%}/g, article.summary);
    temp = temp.replace(/{%ARTICLE%}/g, article.article);
    temp = temp.replace(/{%URL%}/g, article.coverimage);
    temp = temp.replace(/{%ID%}/g, article.id);

    return temp;
};

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    console.log();
    if (pathname === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cards = dataObj.map((el) => replace(tempCard, el)).join('');
        const replacedTemp = tempHome.replace('{%CARDS%}', cards);

        res.end(replacedTemp);
    } else if (pathname === '/article') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const article = replace(tempArticle, dataObj[query.id]);
        res.end(article);
    } else if (pathname === '/about') {
        res.end('about page.');
    } else if (pathname === '/api') {
        console.log(typeof dataObj);
        res.end(data);
    } else {
        res.end('page not found.');
    }
});

server.listen(8000, () => {
    console.log('Server is running... ');
});
