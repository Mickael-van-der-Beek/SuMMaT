var FileSchema = new Schema({

	// _id redefinition hack to embed the path in links
	// Physicall filename (randomly generated) to the file
	_id: {
		type: String
	},
	// Original filename on the user's filesystem
	filename: {
		type: String
	},

	/*!
	* Meta-data on the file that coul be useful
	*/
	creation_date: {
		type: Date,
		default: Date.now
	},
	extension: {
		type: String
	},
	file_size: {
		type: Number
	}

});

module.exports = FileSchema;