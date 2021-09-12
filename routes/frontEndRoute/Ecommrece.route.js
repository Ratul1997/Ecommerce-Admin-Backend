const express = require("express");
const authQuerry = require("../../Querry/authQuerry/authQuerry");
const orderQuerry = require("../../Querry/ecommerceQuery/orderQuerry");
const createError = require("http-errors");
const { json } = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Ecommerce Route");
});

router.post("/order", async (req, res, next) => {
  try {
    const {
      email,
      fullName,
      phoneNumber,
      division,
      city,
      houseNo,
      landMark,
      postCode,
      payOption,
      payMedium,
      message,
      payPhnNumber,
      transId,
      orderedItems,
      totalCost,
      shippingCost,
    } = req.body;
    console.log(req.body);
    // check user exist
    let itemsId = [];
    orderedItems && orderedItems.length>0 && orderedItems.map(item => {
      itemsId.push(item.productId);
    });
    const productId = JSON.stringify(itemsId);
    const orderStored = await orderQuerry.saveOrder(
      email,
      fullName,
      phoneNumber,
      productId,
      division,
      city,
      houseNo,
      landMark,
      postCode,
      payOption,
      payMedium,
      message,
      payPhnNumber,
      transId,
      totalCost,
      shippingCost
    );
    // get order Id
    const orderId = orderStored.insertId;
    // now save each ordered product
    orderedItems.map(async item => {
      const variants = item.variants ? item.variants : "";
      const saveItem = await orderQuerry.saveOrderedItems(
        orderId,
        item.productId,
        item.name,
        variants,
        item.qty,
        item.price
      );
      // console.log(saveItem)
    });

    res.status(200).json({
      status: "successfull",
      message: "Thanks for order",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/user-order/all/:userId", async (req, res, next) => {
  const email = req.params.userId;
  const allOrders = await orderQuerry.userAllOrder(email);
  res.status(200).json(allOrders);
});
router.get("/user-order/pending/:userId", async (req, res, next) => {
  const email = req.params.userId;
  const allOrders = await orderQuerry.userPendingOrder(email);
  res.status(200).json({ allOrders });
});
router.get("/pre-order/pending/:userId", async (req, res, next) => {
  const email = req.params.userId;
  console.log(email);
  const pandingPreOrders = await orderQuerry.pandingPreOrders(email);
  console.log(pandingPreOrders);
  res.status(200).json({ pandingPreOrders });
});
router.post("/pre-order", async (req, res, next) => {
  try {
    const {
      email,
      productName,
      productDetails,
      brand,
      qty,
      phoneNumber,
      productType,
    } = req.body;
    const userExist = await authQuerry.isUserExist(email);
    if (userExist.length > 0) {
      // need to check token and valid data send buy client

      // save preorder
      const preOrdersaved = orderQuerry.savePreOrder(
        email,
        productName,
        productType,
        productDetails,
        brand,
        qty,
        phoneNumber
      );
      if (preOrdersaved) {
        res.status(200).json({
          status: "successfull",
          message: "Thanks for order",
        });
      }
    } else {
      throw createError.NotFound("Invalid User");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
