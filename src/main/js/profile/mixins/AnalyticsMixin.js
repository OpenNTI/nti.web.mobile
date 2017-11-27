import { getHistory } from 'nti-analytics';

const getEntityId = 'Profile:getEntityId';

export default {

	[getEntityId] () {
		let {entity} = this.props;
		return entity && entity.getID();
	},

	getAnalyticsData () {
		const analyticsContext = () => {
			let h = getHistory() || [];
			if (h.length > 0 && h[h.length - 1] === this[getEntityId]()) {
				h.length--; // don't include ourselves in the context
			}
			return h;
		};

		return {
			context: analyticsContext(),
			resourceId: this[getEntityId](),
			type: this.getAnalyticsType()
		};
	}

};
