const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();



// Middelware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrjhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // connect
    await client.connect();

    const database = client.db("Pacific_Travel_Agency");
    const destinationCollection = database.collection("Tour_Destination");
    const blogCollection = database.collection("Blog");
    const userCollection = database.collection("User_Info");

    //GET api to get Tour Destination
    app.get('/destinations', async (req, res) => {
      const result = await destinationCollection.find({}).toArray();
      res.json(result);
    });


    //GET api to get Signle Tour Destination 
    app.get('/destination/:id', async (req, res) => {
      const id = req.params.id;
      
      const query = {_id:ObjectId(id)};
      const result = await destinationCollection.findOne(query);
      
      res.json(result);
    });


    //GET api to get My Booking
    app.get('/mybooking/:email', async (req, res) => {
      const result = await userCollection.find({email:req.params.email}).toArray();
      console.log(result);
      
      res.json(result);
    });


    //GET api to get Blogs
    app.get('/blogs', async (req, res) => {
      const result = await blogCollection.find({}).toArray();
      res.json(result);
    });

    // Get all User info
    app.get('/manageallorder', async (req,res)=>{
      const result = await userCollection.find({}).toArray();
      res.json(result);
    });

    
   


    // POST api to inset service on destinationCollection
    app.post('/addaservice', async(req,res)=>{
      const serviceData = req.body;
      const result = await destinationCollection.insertOne(serviceData);
      res.json(result.acknowledged);

    })

    // POST api to store User info
    app.post('/userinfo', async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.json(result.acknowledged);
    });

     // PUT/update api for status change
    
     app.put('/status/:id', async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      const result = await userCollection.updateOne({_id:ObjectId(id)},{
        $set:{
          status : updatedInfo.statu
        },
      });
      res.json(result.acknowledged);
    });

    // Put/update api for update service info
     app.put('/updateservice/:id', async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      const result = await destinationCollection.updateOne({_id:ObjectId(id)},{
        $set:{
          name: updatedInfo.name,
          duration: updatedInfo.duration,
          place: updatedInfo.place,
          price: updatedInfo.price
        },
      });
      
      res.json(result.acknowledged);
    });



    // Delete Api for user info
    app.delete('/delete/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.json(result.acknowledged)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("I am now in Pacific Travel Agency Server")
});
app.listen(port, () => {
  console.log("Pacific Travel Agency listening at port ", port);

})