import express from "express";
import ejsMate from "ejs-mate";
import stationsRoute from "./routes/client/indexRoute.js";

const app = express();
const port = 3000;

// Middleware đọc form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Template
app.set("views", "./views");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

//static file
app.use(express.static("public"));

// route
app.use("/stations", stationsRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
