const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tvsz3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
const bookCollection = client.db("book-store").collection("books");
const ordersCollection = client.db("book-store").collection("orders");
        
        app.get("/manageBook", (req, res) => {
            bookCollection.find({}).toArray((err, books) => {
            res.send(books);
            });
        });

        app.get('/books', (req,res)=>{
            bookCollection.find({})
            .toArray((err, items) => {
                res.send(items)
            })
        })
        
        app.get('/singlebook/:id', (req,res) => {
            bookCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, book) => {
                res.send(book[0])
            })
        })

        app.post('/addBook', (req, res) => {
            const newBook = req.body;
            bookCollection.insertOne(newBook)
            .then(result => {
                res.send (result.insertedCount > 0)
            })
        })
       

        app.delete("/delete/:id", (req, res) => {
            bookCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
              .then((result) => {
                res.send(result.deletedCount > 0);
              });
          });

          app.post('/addorder', (req, res) => {
            const newOrder = req.body;
            ordersCollection.insertOne(newOrder)
            .then(result => {
                console.log(result)
                res.send (result.insertedCount > 0)
            })
        })

        app.get('/showorder', (req,res)=>{
            ordersCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
        })
});



app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
