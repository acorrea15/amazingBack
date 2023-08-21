const router = require('express').Router();
const Professional = require('../models/professionalSchema');
const User = require('../models/userSchema');

//get Professional;
router.get('/', async(req, res)=> {
  try {
    const sort = {'_id': -1}
    const professionals = await Professional.find().sort(sort); 
    res.status(200).json(professionals);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


//create professional
router.post('/', async(req, res)=> {
  try {
    const {name, lastName, address, email, phone, specialty, admissionDate, picture} = req.body;
    const professional = await Professional.create({name, lastName, address, email, phone, specialty, admissionDate, picture});
    const professionals = await Professional.find();
    res.status(201).json(professionals);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


// update professional
router.patch('/:id', async(req, res)=> {
  const {id} = req.params;
  try {
    const {name, lastName, address, email, phone, specialty, admissionDate, picture} = req.body;
    const professional = await Professional.findByIdAndUpdate(id, {name, lastName, address, email, phone, specialty, admissionDate, picture});
    const professionals = await Professional.find();
    res.status(200).json(professionals);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


// delete professional
router.delete('/:id', async(req, res)=> {
  const {id} = req.params;
  const {user_id} = req.body;
  try {
    const user = await User.findById(user_id);
    if(!user.isAdmin) return res.status(401).json("NO TIENE PERMISO DE ADMIN!");
    await Professional.findByIdAndDelete(id);
    const professionals = await Professional.find();
    res.status(200).json(professionals);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


router.get('/:id', async(req, res)=> {
  const {id} = req.params;
  try {
    const professional = await Professional.findById(id);    
    res.status(200).json({professional})
  } catch (e) {
    res.status(400).send(e.message);
  }
});



module.exports = router;