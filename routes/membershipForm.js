const express = require("express");
const router = express.Router();
const { MembershipForm } = require("../models/membershipForms");
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin');
const { MembershipSubmission } = require("../models/membershipSubmission");

router.get("/", async (req, res) => {
  // FEED FOUND
  const found = await MembershipForm.findOne();

  if (found) return res.status(200).send({ membershipForm: found.fields });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "MembershipForm not Found",
  });
});

router.get("/submissions", [auth, admin],  async (req, res) => {
  // FEED FOUND
  const submissions = await MembershipSubmission.find();

  if (submissions) return res.status(200).send({ membershipSubmissions: submissions });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Membership Submissions not Found",
  });
});


router.post("/submitForm", async (req, res) => {
  
  const {fields} = await MembershipForm.findOne();
  for(let i=0; i<fields.length; i++){
    //Perform checks for text(and editor), email, imageUrl types and then validation requirements 
    // console.log(fields[i])
  }
  // console.log(req.body)
  const submitNew = new MembershipSubmission({values: req.body});
  
  await submitNew.save();
  return res.status(200).send({membershipSubmission: submitNew.values});
})


router.patch("/editForm", [auth, admin], async (req, res) => {
  // console.log(req.body)
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const found = await MembershipForm.findOne();
  if (!found) {
    const {fields} = req.body;
    let newMembershipForm = new MembershipForm({fields});
    await newMembershipForm.save();
    return res.status(200).send({membershipForm: newMembershipForm.fields});
  }

  const updatedFind = await MembershipForm.findOneAndUpdate(
    {},
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "MembershipForm not Found",
    });

  return res.status(200).send({membershipForm: updatedFind.fields});
});


module.exports = router;
