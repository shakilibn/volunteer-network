const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llhcr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error", err);
  const eventsCollection = client.db("volunteer").collection("events");
  console.log("database connected successfully");

  app.get('/events', (req, res) => {
    eventsCollection.find()
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addEvents', (req, res) => {
    const newEvents = req.body;
    eventsCollection.insertOne(newEvents)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  app.delete('/deleteEvent/:id', (req, res) => {
    const id = ObjectID(req.params.id);
      eventsCollection.findOneAndDelete({_id: id})
      .then(documents => res.send(!!documents.value))
  })
  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})