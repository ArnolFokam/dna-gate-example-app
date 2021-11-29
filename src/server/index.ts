import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import db from "./models";
import routes from "./routes";

const app: express.Application = express();

db.mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dna-gate-demo-app')
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// setup routes
routes(app);

// set client if production
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.resolve('build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('build/index.html'))
  });
}

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});