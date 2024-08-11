const Brand = require("../models/brand");

const addBrand = async (req, res) => {
    const { title } = req.body;
    if (!title)
        return res.status(400).json({ message: "Please provide title" });

    const rs = await Brand.create({ title });

    return res.status(201).json({
        status: "success",
        res: rs,
    });
};

const getBrand = async (req, res) => {
    const brand = await Brand.find();
    return res.status(200).json({
        status: "success",
        res: brand,
    });
};

const updateBrand = async (req, res) => {
    const { title } = req.body;
    if (!title)
        return res.status(400).json({ message: "Please provide title" });
    const rs = await Brand.findByIdAndUpdate(
        req.params._brandId,
        { title },
        { new: true }
    );
    return res.status(200).json({
        status: "success",
        res: rs,
    });
};

const deleteBrand = async (req, res) => {
    const { id } = req.params;
    const rs = await Brand.findByIdAndDelete(id);
    return res.status(200).json({
        status: "success",
        res: rs,
    });
};

module.exports = {
    addBrand,
    getBrand,
    updateBrand,
    deleteBrand,
};
