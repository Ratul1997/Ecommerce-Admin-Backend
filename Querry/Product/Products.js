const PromiseModule = require("../../helpers/Promise/PromiseModule");
const Utils = require("../../Utils/Utils");

const LIMIT_THRESHOLD = 25;
const Products = {
  addProducts,
  addProductToCategories,
  addProductGallery,
  getProducts,
  getFeaturedProducts,
  getPopularProducts,
  addProductDetails,
  addProductToAttributes,
  addProductToVariants,
  getSingleProductDetails,
  getProductVariants,
  addProductToOptions,
  addProductToShipping,
  getProductsForUsers,
  getProductsByName,
  getSingleProductDetailsAdmin,
  updatePopularProducts,
  updateFeaturedProducts,
  getSingleProductDetailsBySlug,
  getProductVariantsBySlug,
  updateProductManageStockStatus,
  getProductPriceAndStockStatusById,
  getNewArivalProduct,
  popularProducts,
  featuredProducts,
  discountedProducts,
  getRelatedProductForUser,
  removeProductFromShipping,
  removeAllProductFromShippingById,
  updateProductShippingStatusById,
  updateProductBasicInfoById,
  updateProductDetailsInfoById,
  deleteProductFromCategoriesById,
  updateProductPriceById,
  updateProductSkuById,
  removeProduct,
  removeProductVariants,
  removeProductDetails
};

async function addProducts(productDetails) {
  const sqlInsert =
    "Insert Into product (sku,slug,parent_id,product_status_id, productType, view_on_website,featured_product,popular_product,isTaxable,hasFreeShipping,isDisableDiscount,manageStock,inventory_status,featured_img,regular_price,discount_price, inserted_at, updated_at) Values ?";

  return PromiseModule.createUpdateDelete(sqlInsert, productDetails);
}

async function addProductDetails(productDetails) {
  const sqlInsert =
    "Insert into product_details (product_id, product_name,short_description,long_description,product_gallery,inserted_at,updated_at) Values ?";

  return PromiseModule.createUpdateDelete(sqlInsert, productDetails);
}

async function addProductToCategories(categories) {
  const sqlInsert =
    "Insert into product_categories(category_id,product_id,inserted_at,	updated_at) Values ?";

  return PromiseModule.createUpdateDelete(sqlInsert, categories);
}

async function addProductToShipping(shipping) {
  const sqlInsert =
    "Insert into product_shipping(shipping_id,product_id) Values ?";

  return PromiseModule.createUpdateDelete(sqlInsert, shipping);
}

async function addProductToAttributes(attributes) {
  const sqlInsert =
    "Insert into product_attribute(product_id,attribute_id) Values ?";
  return PromiseModule.createUpdateDelete(sqlInsert, attributes);
}

async function addProductToOptions(options) {
  const sqlInsert =
    "Insert into product_options(product_id,option_id) Values ?";
  return PromiseModule.createUpdateDelete(sqlInsert, options);
}

async function addProductToVariants(product_variants) {
  const sqlInsert =
    "Insert into product_variants(product_variant_id,product_variant_combinations) Values ?";

  return PromiseModule.createUpdateDelete(sqlInsert, product_variants);
}

async function addProductGallery(product_gallery) {
  const sqlInsert =
    "Insert Into product_details (product_id,product_gallery) values (?,?)";

  return PromiseModule.createUpdateDelete(sqlInsert, product_gallery);
}

async function getProducts(pageNumber, productLimit) {
  let sqlSearch =
    "SELECT p.product_id,p.slug,p.sku,p.isTaxable,p.isDisableDiscount,p.hasFreeShipping,p.featured_img,p.view_on_website,p.regular_price,p.popular_product,p.featured_product, p.discount_price,p.product_status_id,p.updated_at,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY p.product_id";

  if (pageNumber) {
    // limit
    const page = parseInt(pageNumber);
    const limit = productLimit ? parseInt(productLimit) : LIMIT_THRESHOLD;
    const offset = (page - 1) * limit;
    sqlSearch = `${sqlSearch} LIMIT  ${limit} OFFSET  ${offset}`;
  }
  return PromiseModule.readData(sqlSearch);
}

// SELECT * FROM product,product_variants,prduct_inventory WHERE product_variants.product_variant_id = product.product_id And product.parent_id = 128 And prduct_inventory.product_id = product.product_id

async function getSingleProductDetails(product_id) {
  const sqlSearch = `SELECT product.product_id,product.slug, product.parent_id,product.sku,product.product_status_id,product.featured_img,product.productType,product.isTaxable,product.hasFreeShipping,product.isDisableDiscount,product.inventory_status,product.regular_price,product.discount_price,product_details.product_name,product_details.short_description,product_details.long_description,product_details.product_gallery,prduct_inventory.inventory_id,prduct_inventory.allowBackOrders,prduct_inventory.quantity,Product_attribute.attribute_id,Product_attribute.attribute_name,Product_attribute.option_name,Product_attribute.option_id,pp.name as category_name, pp.category_id  FROM product INNER JOIN product_details ON product.product_id = product_details.product_id AND product.product_id = ${product_id} INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id ) as pp ON pp.product_id = product.product_id LEFT JOIN ( SELECT product_attribute.attribute_id, product_attribute.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute, attributes,options WHERE product_attribute.attribute_id = attributes.attribute_id AND options.attribute_id = attributes.attribute_id ) as Product_attribute On Product_attribute.product_id = product.product_id LEFT JOIN prduct_inventory ON prduct_inventory.product_id = product.product_id ORDER BY product.product_id`;

  return PromiseModule.readData(sqlSearch);
}
async function getSingleProductDetailsBySlug(productSlug) {
  const sqlSearch = `SELECT product.product_id,product.slug,product.featured_img, product.parent_id,product.sku,product.product_status_id,product.productType,product.isTaxable,product.hasFreeShipping,product.isDisableDiscount,product.inventory_status,product.regular_price,product.discount_price,product_details.product_name,product_details.short_description,product_details.long_description,product_details.product_gallery,prduct_inventory.inventory_id,prduct_inventory.allowBackOrders,prduct_inventory.quantity,Product_attribute.attribute_id,Product_attribute.attribute_name,Product_attribute.option_name,Product_attribute.option_id,pp.name as category_name, pp.category_id  FROM product INNER JOIN product_details ON product.product_id = product_details.product_id AND product.slug = '${productSlug}' INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id ) as pp ON pp.product_id = product.product_id LEFT JOIN ( SELECT product_attribute.attribute_id, product_attribute.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute, attributes,options WHERE product_attribute.attribute_id = attributes.attribute_id AND options.attribute_id = attributes.attribute_id ) as Product_attribute On Product_attribute.product_id = product.product_id LEFT JOIN prduct_inventory ON prduct_inventory.product_id = product.product_id ORDER BY product.product_id`;
  // console.log(sqlSearch);
  return PromiseModule.readData(sqlSearch);
}
async function getProductVariantsBySlug(slug) {
  console.log(slug);
  const sqlSearch = `SELECT * FROM product,product_variants,prduct_inventory WHERE product_variants.product_variant_id = product.product_id And product.slug = ${slug} And prduct_inventory.product_id = product.product_id`;

  return PromiseModule.readData(sqlSearch);
}
async function getProductsByName(productName) {
  const sqlSearch = `SELECT p.product_id,p.slug,p.isTaxable,p.isDisableDiscount,p.hasFreeShipping,p.featured_img,p.view_on_website,p.regular_price,p.discount_price,p.product_status_id,p.updated_at,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON  pd.product_name LIKE '${productName}%' AND p.product_id = pd.product_id INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY p.product_id`;

  return PromiseModule.readData(sqlSearch);
}

async function getProductsForUsers(pageNumber, productLimit, category) {
  console.log();
  let sqlSearch =
    category === "-1"
      ? "SELECT p.product_id,p.isTaxable,p.isDisableDiscount,p.slug,p.hasFreeShipping,p.featured_img,p.regular_price,p.discount_price,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id And p.product_status_id = 1 And p.view_on_website = 1  INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY p.product_id"
      : `SELECT p.product_id,p.isTaxable,p.isDisableDiscount,p.slug,p.hasFreeShipping,p.featured_img,p.regular_price,p.discount_price,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id And p.product_status_id = 1 And p.view_on_website = 1  INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id and pp.category_id = ${category} LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY p.product_id`;

  if (pageNumber) {
    // limit
    const page = parseInt(pageNumber);
    const limit = productLimit ? parseInt(productLimit) : LIMIT_THRESHOLD;
    const offset = (page - 1) * limit;
    sqlSearch = `${sqlSearch} LIMIT  ${limit} OFFSET  ${offset}`;
  }
  return PromiseModule.readData(sqlSearch);
}

async function getProductVariants(product_id) {
  const sqlSearch = `SELECT * FROM product,product_variants,prduct_inventory WHERE product_variants.product_variant_id = product.product_id And product.parent_id = ${product_id} And prduct_inventory.product_id = product.product_id`;

  return PromiseModule.readData(sqlSearch);
}

async function getFeaturedProducts(type, pageNumber, productLimit) {
  let sqlSearch = "";

  if (pageNumber) {
    // limit
    const page = parseInt(pageNumber);
    const limit = productLimit ? parseInt(productLimit) : LIMIT_THRESHOLD;
    const offset = (page - 1) * limit;
    sqlSearch = `Select * from product where featured_product = ${type} LIMIT  ${limit} OFFSET  ${offset}`;
  } else {
    sqlSearch = `Select * from product where featured_product = ${type}`;
  }
  return PromiseModule.readData(sqlSearch);
}

async function getSingleProductDetailsAdmin(id) {
  const sqlSearch = `Select * from product,product_details where product.product_id = product_details.product_id And product.product_id = ${id}`;
  return PromiseModule.readData(sqlSearch);
}

async function getPopularProducts(type, pageNumber, productLimit) {
  let sqlSearch = "";

  if (pageNumber) {
    // limit
    const page = parseInt(pageNumber);
    const limit = productLimit ? parseInt(productLimit) : LIMIT_THRESHOLD;
    const offset = (page - 1) * limit;
    sqlSearch = `Select * from product where popular_product = ${type} LIMIT  ${limit} OFFSET  ${offset}`;
  } else {
    sqlSearch = `Select * from product where popular_product = ${type}`;
  }
  return PromiseModule.readData(sqlSearch);
}

async function updatePopularProducts(id, params) {
  const sqlUpdate = `UPDATE product SET popular_product = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, [params, id]);
}

async function updateFeaturedProducts(id, params) {
  const sqlUpdate = `UPDATE product SET featured_product = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, [params, id]);
}

async function updateProductManageStockStatus(updatedData) {
  const sqlUpdate = `Update product Set manageStock = ?, inventory_status = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, updatedData);
}

async function getProductPriceAndStockStatusById(id) {
  const sqlSearch = `Select inventory_status, product_id,regular_price,discount_price from product where product_id in (${id})`;
  return PromiseModule.readData(sqlSearch);
}

async function getNewArivalProduct() {
  const sqlSearch = `SELECT p.product_id,p.slug,p.isTaxable,p.isDisableDiscount,p.hasFreeShipping,p.featured_img,p.view_on_website,p.regular_price,p.popular_product,p.featured_product, p.discount_price,p.product_status_id,p.updated_at,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY p.inserted_at  LIMIT 25`;
  return PromiseModule.readData(sqlSearch);
}
async function popularProducts() {
  const sqlSearch = `SELECT p.product_id,p.slug,p.isTaxable,p.isDisableDiscount,p.hasFreeShipping,p.featured_img,p.view_on_website,p.regular_price,p.popular_product,p.featured_product, p.discount_price,p.product_status_id,p.updated_at,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id and p.view_on_website  = 1 and p.product_status_id = 1 and p.popular_product=1 INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id `;
  return PromiseModule.readData(sqlSearch);
}

async function featuredProducts() {
  const sqlSearch = `SELECT p.product_id,p.slug,p.isTaxable,p.isDisableDiscount,p.hasFreeShipping,p.featured_img,p.view_on_website,p.regular_price,p.popular_product,p.featured_product, p.discount_price,p.product_status_id,p.updated_at,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id and p.view_on_website  = 1 and p.product_status_id = 1 and p.featured_product = 1 INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id`;
  return PromiseModule.readData(sqlSearch);
}

async function discountedProducts() {
  const sqlSearch = `SELECT p.product_id,p.slug,p.isTaxable,p.isDisableDiscount,p.hasFreeShipping,p.featured_img,p.view_on_website,p.regular_price,p.popular_product,p.featured_product, p.discount_price,p.product_status_id,p.updated_at,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id  and p.view_on_website  = 1 and p.product_status_id = 1 and p.discount_price is Not null and p.discount_price !=0 INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY p.discount_price  ASC `;
  return PromiseModule.readData(sqlSearch);
}

async function getRelatedProductForUser(categoryId, productId) {
  const sqlQuery = `SELECT p.product_id,p.isTaxable,p.isDisableDiscount,p.slug,p.hasFreeShipping,p.featured_img,p.regular_price,p.discount_price,p.inventory_status,pd.product_name,Product_attribute.attribute_id,Product_attribute.option_name,p.productType, Product_attribute.option_id, Product_attribute.attribute_name,pp.category_id,pp.name as category_name FROM product as p INNER JOIN product_details as pd ON p.product_id = pd.product_id And p.product_status_id = 1 And p.view_on_website = 1  INNER JOIN (SELECT categories.category_id,categories.name,product_categories.product_id from product_categories,categories WHERE product_categories.category_id = categories.category_id )  as pp ON pp.product_id = p.product_id and pp.category_id = ${categoryId} and pp.product_id != ${productId} LEFT JOIN ( SELECT pa.attribute_id, pa.product_id, attributes.attribute_name,options.option_id,options.option_name FROM product_attribute as pa, attributes,options,product_options WHERE pa.attribute_id = attributes.attribute_id AND options.option_id =product_options.option_id AND pa.product_id = product_options.product_id   ) as Product_attribute On Product_attribute.product_id = p.product_id ORDER BY RAND() LIMIT 4`;

  return PromiseModule.readData(sqlQuery);
}

async function removeProductFromShipping(deletedProductShippingId) {
  const sqlDelete = `Delete from product_shipping where shipping_id = ?`;
  return PromiseModule.createUpdateDelete(sqlDelete, deletedProductShippingId);
}

async function removeAllProductFromShippingById(id) {
  const sqlDelete = `Delete from product_shipping where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlDelete, id);
}

async function updateProductShippingStatusById(updatedShippingData) {
  const sqlDelete = `Update product set hasFreeShipping = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlDelete, updatedShippingData);
}

async function updateProductBasicInfoById(updatedBasicInfo) {
  const sqlUpdate = `Update product set sku = ?, slug = ?, product_status_id = ?, view_on_website = ?, featured_img = ?,updated_at = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, updatedBasicInfo);
}

async function updateProductDetailsInfoById(updatedProductDetailsInfo) {
  const sqlUpdate = `Update product_details set product_name = ?,short_description = ?, long_description = ?, product_gallery = ?, updated_at = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, updatedProductDetailsInfo);
}

async function deleteProductFromCategoriesById(deletedCategories) {
  const sqlDelete = `Delete from product_categories where (category_id, product_id) in (?)`;
  return PromiseModule.createUpdateDelete(sqlDelete, deletedCategories);
}

async function updateProductPriceById(updatedPriceData) {
  const sqlUpdate = `Update product set regular_price = ?, discount_price = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, updatedPriceData);
}

async function updateProductSkuById(updatedSku) {
  const sqlUpdate = `Update product set sku = ? where product_id = ?`;
  return PromiseModule.createUpdateDelete(sqlUpdate, updatedSku);
}

async function removeProduct(productId) {
  const sqlDeleteStatement = `Delete from product_categories where product_id = ${productId}; Delete from product_options where product_id = ${productId}; Delete from product_reviews where product_id = ${productId}; Delete from product_shipping where product_id = ${productId}; Delete from product_tags where product_id = ${productId}; Delete from product_attribute where product_id = ${productId}; Delete from prduct_inventory where product_id = ${productId};`;
  return PromiseModule.multipleQueryStatement(sqlDeleteStatement);
}

async function removeProductDetails(productId){
  const sqlDeleteStatement = `Delete from product where product_id = ${productId}; Delete from product_details where product_id = ${productId};`
  return PromiseModule.multipleQueryStatement(sqlDeleteStatement)
}

async function removeProductVariants(productId) {
  const sqlDeleteStatement = `Delete product,product_variants,prduct_inventory from product Inner Join product_variants On product_variants.product_variant_id = product.product_id Left Join prduct_inventory on product.product_id = prduct_inventory.product_id Where product.parent_id = ${productId}`;

  return PromiseModule.multipleQueryStatement(sqlDeleteStatement);
}

module.exports = Products;
