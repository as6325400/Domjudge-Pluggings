import express from "express";
import router from "./routes/index.route";

const app : express.Application = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("The server is working!");
});

// load router

for (const route of router){
  app.use(route.getPrefix(), route.getRouter());
}

app.listen(port, () => {
  if (port === 3000) {
    console.log("true");
  }
  console.log(`server is listening on ${port} !!!`);
});
