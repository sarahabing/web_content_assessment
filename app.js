const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

    //Getting Database info, which I used Azure for
    //because it was quick and easy.
    const config =
        {
            options: {
                database: 'Assessment',
                encrypt: true
            },
            authentication: {
                type: "default",
                options: {
                    userName: "abingsa",
                    password: "Sceptile321!",
                }
            },
            server: 'assessmentsaraha.database.windows.net',
        };

    //Establishing the Connection...
    const connection = new Connection(config);

    connection.on('connect', (err) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Connected to ' + config.server);
        }
    });


