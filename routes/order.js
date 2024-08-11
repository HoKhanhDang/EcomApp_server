const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../controller/user");

const {
    createOrder,
    changeStatus,
    getOrders,
    getAllOrders,
    changeComplete,
    changeCancel,
} = require("../controller/order");

router.post("/create", verifyToken, createOrder);
router.put("/status/:orderId", verifyToken, changeStatus);
router.put("/complete/:orderId", [verifyToken, isAdmin], changeComplete);
router.put("/cancel/:orderId", [verifyToken, isAdmin], changeCancel);

router.get("/get", verifyToken, getOrders);
router.get("/getAllOrders", [verifyToken, isAdmin], getAllOrders);

module.exports = router;
