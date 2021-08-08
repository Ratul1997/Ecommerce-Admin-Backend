const PromiseModule = require("../../dbModel/Promise/PromiseModule");

const Attributes = {
	getAttributes,
	addAttribute,
	removeAttribute
};

async function getAttributes() {
	const sqlSearch =
		"Select attributes.attribute_id,attributes.attribute_name,options.option_name, options.option_id From attributes,options where options.attribute_id = attributes.attribute_id";
	return PromiseModule.readData(sqlSearch);
}

async function addAttribute(attribute_name, inserted_at, updated_at) {
	const sqlInsert =
		"Insert into attributes (attribute_name, inserted_at, updated_at) values (?,?,?)";
	const attributeData = [attribute_name, inserted_at, updated_at];
	console.log(attributeData);
	return PromiseModule.createUpdateDelete(sqlInsert, attributeData);
}

async function removeAttribute(attribute_id) {
	const sqlDelete = "Delete From attributes where attribute_id = ?";

	const deleted_data = [attribute_id];
	return PromiseModule.createUpdateDelete(sqlDelete, deleted_data);
}

module.exports = Attributes;
