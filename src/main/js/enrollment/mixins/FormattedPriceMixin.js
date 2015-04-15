

var Price = require('format-price');

module.exports = {
	getFormattedPrice: function(currency, price) {
		return Price.format('en-US',currency,price);
	}
};

