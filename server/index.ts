import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";

// INIT APP AND CFG
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
// app.use(cors());
console.log(__dirname);
const relativeRoute = path.resolve(__dirname, "../dist");
const universalRoute = path.resolve(relativeRoute, "index.html");
console.log(relativeRoute);
app.use(express.static(relativeRoute));

app.listen(port, () => {
  console.log(`listen the port: ${port}`);
});
