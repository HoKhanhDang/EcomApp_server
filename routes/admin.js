const router = require("express").Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../controller/user');
const {
    login,
    banUser,
    unbanUser,
    getTotalIncome,
    getTotalIncomeLastMonth,
    getTotalIncomeThisMonth,
    getTotalNumberOrders,
    getTotalNumberOrdersLastMonth,
    getTotalNumberOrdersThisMonth,
    getTotalNewUsers,
    getTotalNewUsersLastMonth,
    getTotalNewUsersThisMonth,
    getBestSellingProduct,
    getTotalImpressionCurrentMonth,
    getTotalImpressionLastMonth,
    getTop5BestSellingCategoriesCurrentMonth,
    getTop5BestSellingCategoriesLastMonth,
    getTop5BestSellingBrandsCurrentMonth,
    getTop5BestSellingBrandsLastMonth,
} = require("../controller/admin");

router.post("/login", login);
router.put("/ban/:_id",[verifyToken,isAdmin], banUser);
router.put("/unban/:_id",[verifyToken,isAdmin], unbanUser);
router.get("/totalIncome",[verifyToken,isAdmin], getTotalIncome);
router.get("/totalIncomeLastMonth",[verifyToken,isAdmin], getTotalIncomeLastMonth);
router.get("/totalIncomeThisMonth",[verifyToken,isAdmin], getTotalIncomeThisMonth);
router.get("/totalNumberOrders",[verifyToken,isAdmin], getTotalNumberOrders);
router.get("/totalNumberOrdersLastMonth",[verifyToken,isAdmin], getTotalNumberOrdersLastMonth);
router.get("/totalNumberOrdersThisMonth",[verifyToken,isAdmin], getTotalNumberOrdersThisMonth);
router.get("/totalNewUsers",[verifyToken,isAdmin], getTotalNewUsers);
router.get("/totalNewUsersLastMonth",[verifyToken,isAdmin], getTotalNewUsersLastMonth);
router.get("/totalNewUsersThisMonth",[verifyToken,isAdmin], getTotalNewUsersThisMonth);
router.get("/bestSellingProduct",[verifyToken,isAdmin], getBestSellingProduct);
router.get("/totalImpressionCurrentMonth",[verifyToken,isAdmin], getTotalImpressionCurrentMonth);
router.get("/totalImpressionLastMonth",[verifyToken,isAdmin], getTotalImpressionLastMonth);
router.get("/top5BestSellingCategoriesCurrentMonth",[verifyToken,isAdmin], getTop5BestSellingCategoriesCurrentMonth);
router.get("/top5BestSellingBrandsCurrentMonth",[verifyToken,isAdmin], getTop5BestSellingBrandsCurrentMonth);
router.get("/top5BestSellingCategoriesLastMonth",[verifyToken,isAdmin], getTop5BestSellingCategoriesLastMonth);
router.get("/top5BestSellingBrandsLastMonth",[verifyToken,isAdmin], getTop5BestSellingBrandsLastMonth);
module.exports = router;
