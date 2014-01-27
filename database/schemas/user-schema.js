var MongooseSlugGenerator = require('../../mods/slug_generator/MongooseSlugGenerator');

var UserSchema = new Schema({

	/*!
	* General user information
	*/
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	slug: {
		type: String
	},

	/*!
	* Miscellanious stored data
	*/
	avatar: {
		type: String,
		ref: 'File'
	},

	/*!
	* Authentication information
	*/
	password: {
		type: String
	},
	tokens: [{
		token: {
			type: String
		},
		expiration: {
			type: Date
		}
	}],
	state: {
		type: Number
	}

});

UserSchema.plugin(MongooseSlugGenerator());

module.exports = UserSchema;