const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3001;

const cache = {};

app.use(express.json());

app.all('/*', (req, res) => {
    const {originalUrl, method, body} = req;

    console.log('originalUrl: ', originalUrl);
    console.log('method: ', method);
    console.log('body: ', body);

    const recipient = originalUrl.split('/')[1];
    console.log('recipient: ', recipient);

    const recipientUrl = process.env[recipient];
    console.log('recipientURL: ', recipientUrl);

    if (recipientUrl) {
        const axiosConfig = {
            method,
            url: `${recipientUrl}${originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: body})
        };

        console.log('axiosConfig: ', axiosConfig);

        if (recipient === 'products') {
            if (cache[recipient] && cache[recipient].timeForDeleting > Date.now()) {
                console.log(`cache work`);
                res.json(cache[recipient].data);
                return;
            }
            console.log(`cache not work`);
        }


        axios(axiosConfig)
            .then(response => {
                console.log('response from recipient: ', response.data)

                if (recipient === 'products') {
                    cache[recipient] = {
                        data: response.data,
                        timeForDeleting: Date.now() + 120000
                    }
                }
                res.json(response.data)
            })
            .catch(error => {
                console.log('Error: ', JSON.stringify(error));

                if (error.response) {
                    const {status, data} = error.response;

                    res.status(status).json(data);
                } else {
                    res.status(500).json({error: error.message});
                }
            });
    } else {
        res.status(502).json({error: 'Cannot process the request'});
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
