import AnalyticsStore from 'analytics/Store';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';

const startAnalyticsEvent = 'Profile:startAnalyticsEvent';
const getEntityId = 'Profile:getEntityId';

export default {
	mixins: [ResourceLoaded],

	componentDidMount () {
		this[startAnalyticsEvent](this.getAnalyticsMimeType());
	},

	componentWillUnmount () {
		// let {entity} = this.props;
		// AnalyticsStore.pushHistory(entity.getID());
		this.resourceUnloaded();
	},

	[getEntityId] () {
		let {entity} = this.props;
		return entity && entity.getID();
	},

	[startAnalyticsEvent] (mimeType) {
		console.debug('Begin profile viewed event.');
		this.resourceLoaded(this[getEntityId](), null, mimeType);
	},

	analyticsContext () {
		let h = AnalyticsStore.getHistory() || [];
		if (h.length > 0 && h[h.length - 1] === this[getEntityId]()) {
			h.length--; // don't include ourselves in the context
		}
		return Promise.resolve(h);
	},

	resumeAnalyticsEvents() {
		this[startAnalyticsEvent]();
	}
};
