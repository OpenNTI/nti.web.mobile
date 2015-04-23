import Price from 'format-price';

export default {
	getFormattedPrice (currency, price) {
		return Price.format('en-US', currency, price);
	}
};
