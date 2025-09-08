import express, { Router } from 'express';
import { body, param, validationResult } from "express-validator";

import User from '../models/userModel';

const router = Router();

const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  const errors = validationResult(req); //checks if the data in the request (req) has passed the validation rules you've set up

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET USER BASED ON name (url)
router.get('/by-name/:name', async (req, res) => {   // GET /users/:name

  const { name } = req.params;
  const searchName = String(name).toLowerCase();

  try {
    const matches = await User.find({
      name: { $regex: searchName, $options: 'i' }, // Case-insensitive includes (alex, Alex, ALEX)
    });

    if (matches.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    console.log(matches)
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL USERS
router.get('/', async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



router.post("/", 
  [
    //if name not empty
    body("name").notEmpty().withMessage("Name is required"),
    //if its actually an email structure
    body("email").isEmail().withMessage("Invalid email format"), 
  ],
  validate, //validate helper function above
  
    async (req: express.Request, res: express.Response) => {
      try {
        const newUser = new User(req.body);
        await newUser.save(); // adds newuser in db
        res.status(201).json(newUser);
      } catch (err) {
        res.status(500).json({ error: "Could not create user" });
      }
});

router.put("/:id",
  [
    param("id").isMongoId().withMessage("Invalid mongodb ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
  ],
  validate,

  async (req: express.Request, res: express.Response) => {
  try {                            //Mongoose function
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return updated version of the user
    });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Could not update user" });
    }
});

router.delete("/:id",
  //validation: if id:number only
  [param("id").isMongoId().withMessage("Invalid mongodb ID")],
  validate,

  async (req: express.Request, res: express.Response) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: "Could not delete user" });
    }
});

export default router;
