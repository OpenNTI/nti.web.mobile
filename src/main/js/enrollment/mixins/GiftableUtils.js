export default {
	isGiftable(option) {
		return !!(
			option.getPurchasableForGifting && option.getPurchasableForGifting()
		);
	},

	isRedeemable(option) {
		return !!(
			option.getPurchasableForRedeeming &&
			option.getPurchasableForRedeeming()
		);
	},

	hasGiftableEnrollmentOption(catalogEntry) {
		return this.enrollmentOptions(catalogEntry, true).some(this.isGiftable);
	},

	hasRedeemableEnrollmentOption(catalogEntry) {
		return this.enrollmentOptions(catalogEntry, true).some(
			this.isRedeemable
		);
	},

	isEnrolled(catalogEntry) {
		return this.enrollmentOptions(catalogEntry, true).some(
			entry => (entry || {}).enrolled
		);
	},

	enrollmentOptions(catalogEntry, includeUnavailable) {
		let result = [];

		if (!catalogEntry) {
			return result;
		}

		function showOption(op) {
			return op && op.available && !op.enrolled;
		}

		for (let option of catalogEntry.getEnrollmentOptions()) {
			if (includeUnavailable || showOption(option)) {
				result.push(option);
			}
		}

		return result;
	},
};
