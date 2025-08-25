import express from 'express';
import cors from "cors";
import usersRoute from './routes/users';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
    })); 

app.use(express.json());

app.use('/users', usersRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
