const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const route = require('./src/routes')
const fs = require("fs");
const domainsFile = fs.readFileSync(process.env.DOMAINS_DICT_PATH || 'domains.json');
const domainsMap = JSON.parse(domainsFile);
let domains = Object.keys( domainsMap );
console.log(domains);

app.use(cors({
    origin: domains
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(route);

app.listen(port, '0.0.0.0', () => {
    console.log(`Render is running at http://localhost:${port}`)
});