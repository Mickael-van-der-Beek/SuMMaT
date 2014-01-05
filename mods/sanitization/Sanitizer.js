var CajaHTMLSanitize = require('./CajaHTML');

function Sanitizer () {

	this.urlSAX = function () {
		return url.match(/^https?:\/\//) ? url : undefined;
	};

	this.sanitize = function (input) {
		return CajaHTMLSanitize(input, this.urlSAX);
	};

}

module.exports = new Sanitizer();