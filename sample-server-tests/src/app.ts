import express, { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import events from "./routes/events";


export const app = express();

app.use(express.json());

app.use("/v1/eventi", events);

app.listen(process.env.PORT || 3001, async () => {
  console.log("Server is running");
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`);
});

export default app;