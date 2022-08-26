const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const route = require('./src/routes')
const {testRender} = require('./src/services')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(route);

//testRender();

app.listen(port, '0.0.0.0', () => {
    console.log(`Render is running at http://localhost:${port}`)
});