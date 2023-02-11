const express = require("express");
const router = express.Router();
const { Feed, validate, validatePatch } = require("../models/feed");

router.get("/", async (req, res) => {
  // FEED FOUND
  const sortedFeed = await Feed.find({isDeleted:false}, { _id: 0 }).sort({ id: -1 }).limit(4);

  if (sortedFeed) return res.status(200).send(sortedFeed);

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Feeds not Found",
  });
});

router.post("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;
  const find = await Feed.find({}, { _id: 0 });
  let newFeed;
  if (find.length == 0) {
    newFeed = new Feed({
      id: 1,
      ...data,
    });
  } else {
    const latest = await Feed.find({}).sort({id:-1}).limit(1);
    console.log(latest)
    newFeed = new Feed({
      id: latest[0].id+1,
      ...data,
    });
  }

  //SAVE
  try {
    await newFeed.save();
  } catch (err) {
    return res.status(400).send({
      error: "400",
      message: `${err.message}`,
    });
  }

  // const found = await Feed.find({isDeleted:false}, { _id: 0 });
  // return res.status(200).send(found);

  // RETURN THE TOP-4 LATEST NEWS

  const sortedFeed = await Feed.find({}).sort({ id: -1 }).limit(4);

  return res.status(200).send(sortedFeed);
});

router.patch("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const { error } = validatePatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find the feed

  const updatedFind = await Feed.findOneAndUpdate(
    { id: req.body.id , isDeleted:false },
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "Feed not Found",
    });

  // send all documents

  const findAll = await Feed.find({isDeleted:false}, { _id: 0 }).sort({ id: -1 }).limit(4);
  return res.status(200).send(findAll);
});

// DELETE

router.post("/delete", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  const { id } = req.body;
  console.log(id)
  const deleted = await Feed.findOneAndUpdate({ id:id },{
    isDeleted: true
  });
  
  if (deleted == null)
    return res.status(404).send({
      error: "404",
      message: "Feed not Found",
    });

  // send all documents

  const findAll = await Feed.find({isDeleted:false}, { _id: 0 }).sort({id:-1}).limit(4);
  return res.status(200).send(findAll);
});


// GET FEED BY ID 

router.post('/getFeed',async (req,res)=>{

  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });


  const {id} = req.body;

  const found = await Feed.findOne({id,isDeleted:false});

  if(found ==null ) return res.status(404).send({
    error:"404",
    message: "Member not found",
  })

  return res.status(200).send(found);

});
module.exports = router;
