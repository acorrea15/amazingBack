console.log("Eliminar cuando se configure Users Rutas")
const router = require('express').Router();
const User = require('../models/userSchema');


// signup
router.post('/signup', async(req, res)=> {
    const {name, lastName, email, password, phone} = req.body;
  
    try {
      const user = await User.create({name, lastName, email, password, phone}); 
      res.json(user);
    } catch (e) {
      if(e.code === 11000) return res.status(400).send('El usuario ya existe!');
      res.status(400).send(e.message)
    }
  })
  
  // login  
router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
      const user = await User.findByCredentials(email, password);
      console.log(user,user.isEnabled, "<<<---user")
      if(!user.isEnabled) return res.status(400).send('Usuario no habilitado!');
      res.json(user)
    } catch (e) {
      res.status(400).send(e.message)
    }
  })
  
  // get users;
router.get('/', async(req, res)=> {
    try {
      const users = await User.find({ isAdmin: true });
      res.json(users);
    } catch (e) {
      res.status(400).send(e.message);
    }
  })

  //Disabled users
router.patch('/:id/mark-disabled', async(req, res)=> {
    const {id} = req.params;
    try {
      const user    = await User.findByIdAndUpdate(id, {isEnabled: false});
      const users = await User.findById(id);
      res.status(200).json(users)
    } catch (e) {
      res.status(400).json(e.message);
    }
  })

module.exports = router;