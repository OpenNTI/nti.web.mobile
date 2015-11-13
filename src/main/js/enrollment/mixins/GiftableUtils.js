import EnrollmentStore from '../Store';

export default {

	isGiftable (option) {
		return !!(option.getPurchasableForGifting && option.getPurchasableForGifting());
	},

	hasGiftableEnrollmentOption (catalogEntry) {
		return this.enrollmentOptions(catalogEntry, true).some(this.isGiftable);
	},

	isEnrolled (courseId) {
		return EnrollmentStore.isEnrolled(courseId);
	},

	enrollmentOptions (catalogEntry, includeUnavailable) {
		let result = [];

		if (!catalogEntry) {
			return result;
		}


		function showOption (op) {
			return op && op.available && !op.enrolled;
		}

		for (let option of catalogEntry.getEnrollmentOptions()) {
			if(includeUnavailable || showOption(option)) {
				result.push(option);
			}
		}

		return result;
	}

};
