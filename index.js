const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI)
.then(()=>{console.log("Mongodb connected")})
.catch((err)=>{console.log('mongodb connection failed : ',err)})

app.use(express.json());

//Schema imports
const Menu = require('./menuSchema');


//Post an item
app.post('/menu', async(req,res)=>{
  const {name, description, price}= req.body;

  if(!name || !price){
    return res.status(400).json({msg:"Required to fill all fields"});
  }

  const newItem = new Menu({name, description, price});
  await newItem.save();

  res.status(201).json({msg:"New item added to Menu"})
})


//Update an item
app.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !price) {
      return res.status(400).json({ msg: "Required to fill all fields" });
  }

  try {
      const updatedItem = await Menu.findByIdAndUpdate(id, { name, description, price }, { new: true });

      if (!updatedItem) {
          return res.status(404).json({ msg: "Item not found" });
      }

      res.status(200).json({ msg: "Menu item updated", updatedItem });
  } catch (error) {
      res.status(500).json({ msg: "Server error", error });
  }
});


//To Delete an item
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deletedItem = await Menu.findByIdAndDelete(id);

      if (!deletedItem) {
          return res.status(404).json({ msg: "Item not found" });
      }

      res.status(200).json({ msg: "Menu item deleted" });
  } catch (error) {
      res.status(500).json({ msg: "Server error", error });
  }
});


//To get all items in the menuCard
app.get('/menu',async(req,res)=>{
  try{
    const menuCard = await Menu.find();
    res.json(menuCard)
  }catch(err){
    res.status(500).json({msg:"Server error",err});
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});