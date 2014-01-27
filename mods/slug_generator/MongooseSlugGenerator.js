function MongooseSlugGenerator (options) {

	var options = options || {},
	  , field = options.field || 'username';

	return function MongooseSlugGenerator (schema) {
		schema.path(field).set(function (str) {
			this.slug = sluggify(str);
			return str;
		});
	};

}

function sluggify (str) {
	return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9]/g, '');
}

module.exports = MongooseSlugGenerator;