import express from "express";
import ejsMate from "ejs-mate";
import bodyParser from "body-parser";
import stationsRoute from "./routes/client/indexRoute.js";
import adminRoute from "./routes/admin/adminRoute.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

// Middleware đọc form-urlencoded
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//cookieParser
app.use(cookieParser());

//Template
app.set("views", "./views");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

//static file
app.use(express.static("public"));

// route
app.use("/stations", stationsRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
