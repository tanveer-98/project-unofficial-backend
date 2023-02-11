const express = require("express");
const router = express.Router();
const { Members, validate, validatePatch } = require("../models/members");

router.get("/", async (req, res) => {

  // Members FOUND
  const sortedMembers = await Members.find({isDeleted:false}, { _id: 0 });

  if (sortedMembers) return res.status(200).send(sortedMembers);

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Memberss not Found",
  });
});

router.post("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const { error } = validate({...req.body});
  if (error) return res.status(400).send({
    error: "400",
    message : error.details[0].message
  });

  const data = req.body;
  const find = await Members.find({}, { _id: 0 });
  let newMembers;
  if (find.length == 0) {
    newMembers = new Members({
      id: 1,
      ...data,
    });
  } else {
    const latest = await Members.find({}).sort({id:-1}).limit(1);
    console.log("LATEST: "+latest)
    newMembers = new Members({
      id: latest[0].id+1,
      ...data,
    });
  }

  //SAVE
  try {
    // console.log("CALLED POST REQ SAVE")
    await Members.create(newMembers)
  } catch (err) {
    return res.status(400).send({
      error: "400",
      message: `${err.message}`,
    });
  }

  const found = await Members.find({isDeleted:false}, { _id: 0 });
  return res.status(200).send(found);

  // RETURN THE TOP-4 LATEST NEWS

  const sortedMembers = await Members.find({}).sort({ id: -1 }).limit(4);

  return res.status(200).send(sortedMembers);
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

  // find the Members

  const updatedFind = await Members.findOneAndUpdate(
    { id: req.body.id },
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "Members not Found",
    });

  // send all documents

  const findAll = await Members.find({isDeleted:false}, { _id: 0 });
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

  const deleted = await Members.findOneAndUpdate({ id:id,isDeleted:false },{
    isDeleted:true
  });
  
  if (deleted == null)
    return res.status(404).send({
      error: "404",
      message: "Members not Found",
    });

  // send all documents

  const findAll = await Members.find({isDeleted:false}, { _id: 0 });
  return res.status(200).send(findAll);
});

router.post('/getMember',async (req,res)=>{

  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });


  const {id} = req.body;

  const found = await Members.findOne({id,isDeleted:false});

  if(found ==null ) return res.status(404).send({
    error:"404",
    message: "Member not found",
  })

  return res.status(200).send(found);

});

module.exports = router;
