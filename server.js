const express = require("express");
const cron = require('node-cron');
const bodyParser = require("body-parser");
const path = require('path');
const api = require("./route/api");
const swaggerJSDocExpress = require("swagger-jsdoc-express");
const db = require("./db");

const app = express();

cron.schedule('* * * * *', function() {
    console.log('running a task every minute');
    db.clearDiscounts();
});

// create a '/swagger' endpoint ...
swaggerJSDocExpress.setupSwaggerUIFromSourceFiles(
    {
        cwd: './route',
        files: [ '**/*.ts', '**/*.js' ],
    },
    app
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api);
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
