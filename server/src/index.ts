import express from 'express';
import cors from "cors";
import usersRoute from './routes/users';

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

app.use('/api', usersRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
