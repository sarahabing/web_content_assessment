const sql = require("mssql");

//Getting Database info, which I used Azure for
//because it was quick and easy.
const config =
    {
        options: {
            encrypt: true
        },
        user: "abingsa",
        password: "Sceptile321!",
        database: 'Assessment',
        server: 'assessmentsaraha.database.windows.net',
    };


module.exports = config;
