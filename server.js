'use strict';

const express = require('express');

const cors = require('cors');

const axios = require('axios');
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT;

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(`${mongoUrl}`);


const fruitSchema = new mongoose.Schema({
    name: {type: String},
    image: {type: String},
    price: {type: Number},
    email: {type: String},
})

const fruits = mongoose.model("fruits",fruitSchema);


app.get("/", (req, res)=> {
    res.send("hello from server")
});

// Routes
app.get("/fruits", getFruits);
app.post("/fruits", addFruits);
app.get("/fruits/:email", getUserFruits);
app.put("/fruits/:id", updateFruits);
app.delete("/fruits/:id", deleteFruits);






// Functions
function getFruits(req, res) {
    axios
    .get("https://fruit-api-301.herokuapp.com/getFruit")
    .then(result =>{
        res.json(result.data.fruits);
    })
};
function addFruits(req, res){
    const {name,image,price,email}=req.body;
    const newFruit = new fruits({name,image,price,email});
    newFruit.save();
    res.json(newFruit);
};
function getUserFruits(req, res){
    const email = req.params.email;
    fruits.find({email: email},(err,result)=>{
        res.json(result);
    })
}
function updateFruits(req, res){
    const id = req.params.id;
    const {name,image,price,email}=req.body;
    fruits.findByIdAndUpdate(id, {name,image,price}, (err,result)=>{
        fruits.find({email: email},(err,result)=>{
            res.json(result);
        })
    })
}
function deleteFruits(req, res){
    const id = req.params.id;
    const email=req.query.email;
    fruits.deleteOne({_id:id}, (err,result)=>{
        fruits.find({email: email},(err,result)=>{
            res.json(result);
        })
    })
}



app.listen(PORT, ()=> {
    console.log(`server is listening from ${PORT}`)
})



