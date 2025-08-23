import { Router } from 'express';
import { db } from '../data';

const router = Router();

router.get('/users', (req, res) => {
    const allUsers = db.users;
  res.json(allUsers);
});

router.post("/users", (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
    db.users.push(newUser);
  res.status(201).json(newUser);
});


router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const userId = Number(id);

  // Check if the user exists
  const userExists = db.users.some(u => u.id === userId);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  // Update the user using .map and spread operator
  db.users = db.users.map(u =>
    u.id === userId ? { ...u, ...req.body } : u
  );

  // Send back the updated user
  const updatedUser = db.users.find(u => u.id === userId);
  res.json(updatedUser);
});

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.users = db.users.filter(u => u.id !== Number(id)); //filtra fuori il soggetto
  res.json({ message: "User deleted" });
});

export default router;
