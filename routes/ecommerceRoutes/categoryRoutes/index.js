const express = require("express");
const HTTPStatus = require("../../../HTTPStatus");
const routes = express.Router();
const CategoriesQuery = require("../../../Querry/Product/Categories");
const Utils = require("../../../Utils/Utils");


routes.post("/category", async (req, res) => {
  const { categoryData } = req.body;
  const { name, description, parent_id } = categoryData;

  if (name.trim() === "" || !name)
    return res.status(400).json({ massage: "Category name cannot be empty" });
  try {
    const inserted_at = Utils.getTimeStamp();
    const response = await CategoriesQuery.addCategories(
      name,
      parent_id,
      description,
      inserted_at,
      inserted_at
    );
    const jsonData = {
      category_id: response.insertId,
      name: name,
      description: description,
      parent_id: parent_id,
    };
    return res.status(HTTPStatus.OK).json(jsonData);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});

routes.get("/categories", async (req, res) => {
  try {
    const response = await CategoriesQuery.getCategories();
    return res.status(HTTPStatus.OK).json({
      status: "success",
      data: {
        total_categories: response.length,
        categories: [...response],
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ msg: "Something Went Wrong" });
  }
});
routes.get("/categories/:id", async (req, res) => {
  const {id} = req.params
  if (!Utils.isIdValid(id))
  return res.status(404).json({ massage: "Product is not found" });

  try {
    const response = await CategoriesQuery.getCategoriesBy(id);
    return res.status(HTTPStatus.OK).json({
      status: "success",
      data: {
        total_categories: response.length,
        categories: [...response],
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ msg: "Something Went Wrong" });
  }
});
routes.patch("/categories/:id", async (req, res) => {
  const {id} = req.params
  const {categoryData } = req.body


  if (!Utils.isIdValid(id))
  return res.status(404).json({ massage: "Category is not found" });

  try {
    const response = await CategoriesQuery.updateCategory([categoryData.name,categoryData.parent_id,categoryData.description,Utils.getTimeStamp(),id]);
    return res.status(HTTPStatus.OK).json({
      status: "success",
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ msg: "Something Went Wrong" });
  }
});

routes.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const response = await CategoriesQuery.removeACategory(id);
    return res.status(HTTPStatus.OK).json({
      status: "success",
      msg: "Successfully remove item",
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ msg: "Something Went Wrong" });
  }
});

module.exports = routes;
