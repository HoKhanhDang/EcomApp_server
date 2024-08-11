const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Order = require("../models/order");
const Impressions = require("../models/helper");
const { generateToken, generateRefreshToken } = require("../middlewares/jwt");

const date = new Date();
const startOfMonth = new Date(date.setDate(1));
const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const response = await User.findOne({ email });
    if (!response) {
        throw new Error("Account do not exist");
    }
    if (response.role !== "admin") {
        return res.status(200).json({
            status: "error",
            message: "You are not authorized to login",
        });
    }

    const accessToken = generateToken(response._id, response.role);
    const refreshToken = generateRefreshToken(response._id);

    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (response && (await response.matchPassword(password))) {
        const { password, ...rest } = response.toObject();
        console.log("success");
        return res.status(200).json({
            status: "success",
            accessToken,
            data: rest,
        });
    } else {
        console.log("failed");
        return res.status(200).json({
            status: "failed",
            message: "Invalid email or password",
        });
    }
});
const banUser = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log(_id);
    const user = await User.findById(_id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    user.status = "banned";
    await user.save();
    res.status(200).json({
        status: "success",
        data: user,
    });
});
const unbanUser = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log(_id);
    const user = await User.findById(_id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    user.status = "active";
    await user.save();
    res.status(200).json({
        status: "success",
        data: user,
    });
});

const getTotalIncome = asyncHandler(async (req, res) => {
    const income = await Order.aggregate([
        {
            $match: {
                status: "Completed",
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: income,
    });
});
const getTotalIncomeLastMonth = asyncHandler(async (req, res) => {
    const income = await Order.aggregate([
        {
            $match: {
                status: "Completed",
                createAt: {
                    $gte: lastMonth,
                    $lt: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: income,
    });
});
const getTotalIncomeThisMonth = asyncHandler(async (req, res) => {
    const income = await Order.aggregate([
        {
            $match: {
                status: "Completed",
                createAt: {
                    $gte: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        data: income,
    });
});

const getTotalNumberOrders = asyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: orders,
    });
});
const getTotalNumberOrdersLastMonth = asyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $match: {
                createAt: {
                    $gte: lastMonth,
                    $lt: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: orders,
    });
});
const getTotalNumberOrdersThisMonth = asyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $match: {
                createAt: {
                    $gte: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: orders,
    });
});

const getTotalNewUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                role: "user",
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: users,
    });
});
const getTotalNewUsersLastMonth = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                role: "user",
                createdAt: {
                    $gte: startOfMonth,
                    $lt: lastMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: users,
    });
});
const getTotalNewUsersThisMonth = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                role: "user",
                createdAt: {
                    $gte: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: users,
    });
});

const getBestSellingProduct = asyncHandler(async (req, res) => {
    const products = await Order.aggregate([
        {
            $unwind: "$products",
        },
        {
            $group: {
                _id: "$products.product",
                product: { $first: "$products.product" },
                total: { $sum: "$products.quantity" },
            },
        },
        {
            $sort: { total: -1 },
        },
        {
            $limit: 1,
        },
    ]);
    res.status(200).json({
        status: "success",
        data: products,
    });
});

const getTotalImpressionCurrentMonth = asyncHandler(async (req, res) => {
    const impressions = await Impressions.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: impressions,
    });
});
const getTotalImpressionLastMonth = asyncHandler(async (req, res) => {
    const impressions = await Impressions.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: lastMonth,
                    $lt: startOfMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: impressions,
    });
});

const getTop5BestSellingCategoriesCurrentMonth = asyncHandler(
    async (req, res) => {
        const products = await Order.aggregate([
            {
                $match: {
                    createAt: {
                        $gte: startOfMonth,
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "product",
                },
            },

            {
                $unwind: "$product",
            },

            {
                $group: {
                    _id: "$product.category",
                    title: { $first: "$product.category" },
                    total: { $sum: "$products.quantity" },
                    revenue: { $sum: "$totalPrice" },
                },
            },
            {
                $sort: { revenue: -1 },
            },
            {
                $limit: 5,
            },
        ]);
        res.status(200).json({
            status: "success",
            data: products,
        });
    }
);
const getTop5BestSellingCategoriesLastMonth = asyncHandler(async (req, res) => {
    const products = await Order.aggregate([
        {
            $match: {
                createAt: {
                    $gte: lastMonth,
                    $lt: startOfMonth,
                },
            },
        },
        {
            $unwind: "$products",
        },
        {
            $lookup: {
                from: "products",
                localField: "products.product",
                foreignField: "_id",
                as: "product",
            },
        },

        {
            $unwind: "$product",
        },

        {
            $group: {
                _id: "$product.category",
                title: { $first: "$product.category" },
                total: { $sum: "$products.quantity" },
                revenue: { $sum: "$totalPrice" },
            },
        },
        {
            $sort: { revenue: -1 },
        },
        {
            $limit: 5,
        },
    ]);
    res.status(200).json({
        status: "success",
        data: products,
    });
});
const getTop5BestSellingBrandsCurrentMonth = asyncHandler(async (req, res) => {
    const products = await Order.aggregate([
        {
            $match: {
                createAt: {
                    $gte: startOfMonth,
                },
            },
        },
        {
            $unwind: "$products",
        },

        {
            $lookup: {
                from: "products",
                localField: "products.product",
                foreignField: "_id",
                as: "product",
            },
        },

        {
            $unwind: "$product",
        },
        {
            $group: {
                _id: "$product.brand",
                title: { $first: "$product.brand" },
                total: { $sum: "$products.quantity" },
                revenue: { $sum: "$totalPrice" },
            },
        },
        {
            $sort: { revenue: -1 },
        },
        {
            $limit: 5,
        },
    ]);
    res.status(200).json({
        status: "success",
        data: products,
    });
});
const getTop5BestSellingBrandsLastMonth = asyncHandler(async (req, res) => {
    const products = await Order.aggregate([
        {
            $match: {
                createAt: {
                    $gte: lastMonth,
                    $lt: startOfMonth,
                },
            },
        },
        {
            $unwind: "$products",
        },

        {
            $lookup: {
                from: "products",
                localField: "products.product",
                foreignField: "_id",
                as: "product",
            },
        },

        {
            $unwind: "$product",
        },
        {
            $group: {
                _id: "$product.brand",
                title: { $first: "$product.brand" },
                total: { $sum: "$products.quantity" },
                revenue: { $sum: "$totalPrice" },
            },
        },
        {
            $sort: { revenue: -1 },
        },
        {
            $limit: 5,
        },
    ]);
    res.status(200).json({
        status: "success",
        data: products,
    });
});

module.exports = {
    banUser,
    login,
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
};
