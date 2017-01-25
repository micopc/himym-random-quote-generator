const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost:27017/himym';

const app = express();

app.use(cors());

MongoClient.connect(MONGODB_URI, function(err, db) {

    if (err) {
        console.log(err);
        process.exit(1);
    }
    
    app.get('/quote', function(req, res) {
        db.collection('quotes').aggregate([{ $sample: { size: 1 } }]).toArray(function(err, docs) {
            if (err) {
                return;
            }
            res.json(docs[0]);
        });
    });

    app.all('*', function(req, res) {
        res.send('To get a quote be sure to use the method GET on the path: /quote');
    });

    app.listen(process.env.PORT || '3000', function() {
        console.log(`App listening on port: ${process.env.PORT || '3000'}`);
    });    
    
});



