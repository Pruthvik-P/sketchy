import express from "express";
import cors from "cors";
import {userRouter} from "./routes/userRouter";
import {roomRouter} from "./routes/roomRouter"

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRouter);
app.use("/", roomRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
