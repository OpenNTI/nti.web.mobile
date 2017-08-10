import {Currency} from 'nti-web-commons';

export default {
	getFormattedPrice (currency, price) {
		return Currency.format(price, false, 'en-US', currency);
	}
};
