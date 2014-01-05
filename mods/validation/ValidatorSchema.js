var is = require('../../utils/type-checks/isType');

function ValidatorSchema (schema) {

	this.schema = handleSubSchema(schema, '');

}

//module.exports = ValidatorSchema;

console.log(
	new ValidatorSchema({
		value: 'value',
		other: {
			oki: 'oki',
			doki: {
				loko: 'doko'
			}
		},
		misc: ['one', 'two', 'three'],
		comb: [{
			hello: 'moto1',
			moto: 'hello1'
		}, {
			hello: 'moto2',
			moto: 'hello2'
		}]
	})
);

console.log(ValidatorSchema(flat));