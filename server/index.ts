import * as express from "express";
import * as path from "path";

const app = express();
app.use(express.json());

const port = 3000;

app.get("/test", (req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log("escuchando al puerto: ", port);
});

const relativeRoute = path.resolve(__dirname, "../dist");

app.use(express.static(relativeRoute));
app.get("*", (req, res) => {
  res.sendFile(relativeRoute, +"/index.html");
});
