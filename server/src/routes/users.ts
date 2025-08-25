import express, { Router } from 'express';
import { db } from '../data';
import { body, param, validationResult } from "express-validator";

const router = Router();

const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  const errors = validationResult(req); //checks if the data in the request (req) has passed the validation rules you've set up

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET ALL USERS
router.get('/', (req, res) => {
  res.json(db.users);
});

// GET USER BASED ON ID (url)
router.get('/:id', (req, res) => {   // GET /users/:id
  const { id } = req.params;
  const user = db.users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.post("/", 
  [
    //if name not empty
    body("name").notEmpty().withMessage("Name is required"),
    //if its actually a mail structure
    body("email").isEmail().withMessage("Invalid email format"), 
  ],
  validate, //validate helper function above
  
    (req: express.Request, res: express.Response) => {
  const newUser = { id: Date.now(), ...req.body };
    db.users.push(newUser);
  res.status(201).json(newUser);
});

router.put("/:id",
  [
    param("id").isInt().withMessage("ID must be a number"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
  ],
  validate,

  (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const userId = Number(id);

  // Check if the user exists
  const userExists = db.users.some(u => u.id === userId);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  // Update the user when it matches the id
  db.users = db.users.map(u =>
    u.id === userId ? { ...u, ...req.body } : u
  );

  // find the updated user and send in response
  const updatedUser = db.users.find(u => u.id === userId);
  res.json(updatedUser);
});

router.delete("/:id",
  //validation: if id:number only
  [param("id").isInt().withMessage("ID must be a number")],
  validate,

  (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  db.users = db.users.filter(u => u.id !== Number(id)); //filtra fuori il soggetto
  res.json({ message: "User deleted" });
});

export default router;
