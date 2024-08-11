const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../controller/user");

const {
    addBrand,
    getBrand,
    updateBrand,
    deleteBrand,
} = require("../controller/brand");


router.post("/add", [verifyToken, isAdmin], addBrand);
router.get("/get", getBrand);
router.put("/update/:title", [verifyToken, isAdmin], updateBrand);
router.delete("/delete/:id", [verifyToken, isAdmin], deleteBrand);

module.exports = router;
