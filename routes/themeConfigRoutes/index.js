const express = require("express");
const routes = express.Router();
const adminInfo = require('../../Querry/AdminInfo')
const Utils = require("../../Utils/Utils");

routes.get("/slider-image", async (req, res, next) => {
    try{
        const sliderdata = await adminInfo.getSliderImg()
        const sliderImages=JSON.parse(sliderdata[0].value)
    
        // console.log(sliderdata[0].value)
        res.status(200).json({
            message:'Successfull',
            totalImage:sliderImages.length,
            images:sliderImages,})
    }
    catch(err){
        next(err)
    }
    
});
module.exports = routes;