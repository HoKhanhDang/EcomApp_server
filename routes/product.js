const router = require('express').Router();
const { verifyToken } = require('../middlewares/verifyToken');
const uploadCloud = require('../config/cloudinary.config');

const {
    addProduct,
    getProducts,
    getProductBySlug,
    getProductByID,
    updateProduct,
    deleteProduct,
    ratingProduct,
    uploadImage,
    getAllProducts
} =  require('../controller/product');
const {isAdmin} = require('../controller/user');    

const {insertProduct} = require('../controller/insertProduct');

//admin
router.post('/addProduct',[verifyToken,isAdmin], addProduct);
router.get('/getProducts', getProducts);
router.get('/getProductBySlug/:_id', getProductBySlug);
router.get('/getProductByID/:_id', getProductByID);
router.get('/getAll',[verifyToken,isAdmin],getAllProducts)

router.put('/updateProduct/:_id',[verifyToken,isAdmin], updateProduct);
router.delete('/deleteProduct/:_id',[verifyToken,isAdmin], deleteProduct);
router.put('/ratingProduct', verifyToken, ratingProduct);

router.put('/uploadImage', uploadCloud.array('images'), uploadImage)

router.post('/insertProduct', insertProduct);

module.exports = router;