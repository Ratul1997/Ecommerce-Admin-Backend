// const PromiseModule = require("../../helpers/Promise/PromiseModule");

// const BlogQuerry = {
//     getAllBlogs,
//     getAllCategories,
//     getAllParentCategories,
//     createNewCategory,
//     updateCategory,
//     deleteCategory
// }

// async function getAllCategories() {
//     const sqlQuerry = `SELECT * FROM blog_categories`;
//     return PromiseModule.readData(sqlQuerry);
// }

// async function getAllParentCategories() {
//     const sqlQuerry = `SELECT * FROM categories WHERE parent_id < 0`;
//     return PromiseModule.readData(sqlQuerry);
// }

// async function createNewCategory(inputCategory) {
//     const sqlQuerry = `INSERT INTO categories (name, parent_id, inserted_at, updated_at, description) VALUES ?`;
//     const inputArray = [inputCategory.name , inputCategory.parent_id,inputCategory.inserted_at,inputCategory.updated_at,inputCategory.description];
//     return PromiseModule.createUpdateDelete(sqlQuerry,inputArray);
// }

// async function updateCategory(inputCategory) {
//     const sqlQuerry = `UPDATE categories SET name = ? AND parent_id = ? AND updated_at = ? AND description = ? WHERE categories.category_id = ?`;
//     const inputArray = [inputCategory.name , inputCategory.parent_id, inputCategory.updated_at,inputCategory.description , inputCategory.id];
//     return PromiseModule.createUpdateDelete(sqlQuerry,inputArray);    
// }

// async function deleteCategory(inputdata) {
//     const sqlQuerry = `DELETE FROM categories WHERE categories.category_id = ?`;
//     const inputArray = [inputdata];
//     return PromiseModule.createUpdateDelete(sqlQuerry,inputArray);    
// }

// async function getAllBlogs() {
//     const sqlSearch = `SELECT * FROM blog `;
//     return PromiseModule.readData(sqlSearch);
// }

// module.exports = BlogQuerry