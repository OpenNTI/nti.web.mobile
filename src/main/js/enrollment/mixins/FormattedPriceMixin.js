import Price from 'format-price';

export default {
	getFormattedPrice: function(currency, price) {
		return Price.format('en-US', currency, price);
	}
};
