import express from "express";
import cors from "cors";
import "dotenv/config"

const PORT = process.env.PORT || 5000;
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//ROUTER
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
