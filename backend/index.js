const express = require("express");
const app=express();
const mainRouter=require("./routes/index");
const cors=require("cors");
const jwt=require("jsonwebtoken");


//to do: store hashed password in DB

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3000,()=>{console.log("started")});