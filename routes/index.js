const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const adminRouter = require("./admin");

const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/category", categoryRouter);
    app.use("/api/brand", brandRouter);
    app.use("/api/coupon", couponRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/admin", adminRouter);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
