const tutorialRouter = require("./routers/tutorial");
const productRouter = require("./routers/products");
const memberRouter = require("./routers/member");
const companyRouter = require("./routers/company");
const teamRouter = require("./routers/team");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const cartRouter = require("./routers/cart");
const orderRouter = require("./routers/order");
const paymentDetailsRouter = require("./routers/paymentDetails");
const subscriptionRouter = require("./routers/subscription");
const dbConn = require("./config/dbConn");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const decodeAuthToken = require("./middlewares/decodeAuthToken");
const adminRouter = require("./routers/admins"); 

const express = require("express");
const CompensationPlan = require("./model/CompensationPlan");
const seedAdmin = require("./seeds/seedAdmin");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

dbConn();

app.use(decodeAuthToken);


// app.use routers for different routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/company", companyRouter);
app.use("/member", memberRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/paymentDetails", paymentDetailsRouter);
app.use("/tutorial", tutorialRouter);
app.use("/subscription", subscriptionRouter);
app.use("/admin", adminRouter); 

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB\nListening on port 3001");
  app.listen(3001);
});

module.exports = app; 



