import * as express from "express";
import * as path from "path";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
console.log(port);

app.get("/test", (req, res) => {
  res.send("ok");
});

const relativeRoute = path.resolve(__dirname, "../dist");

app.use(express.static(relativeRoute));
app.get("*", (req, res) => {
  res.sendFile(relativeRoute, +"/index.html");
});

app.listen(port, () => {
  console.log(`listen the port: ${port}`);
});
