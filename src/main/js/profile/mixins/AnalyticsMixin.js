import {
	Mixin as ResourceLoaded,
	getHistory
} from 'nti-analytics';

const startAnalyticsEvent = 'Profile:startAnalyticsEvent';
const getEntityId = 'Profile:getEntityId';

export default {
	mixins: [ResourceLoaded],

	componentDidMount () {
		this[startAnalyticsEvent](this.getAnalyticsMimeType());
	},

	componentWillUnmount () {
		if (!this.props.preview) {
			this.resourceUnloaded();
		}
	},

	[getEntityId] () {
		let {entity} = this.props;
		return entity && entity.getID();
	},

	[startAnalyticsEvent] (mimeType) {
		if (!this.props.preview) {
			this.resourceLoaded(this[getEntityId](), null, mimeType);
		}
	},

	analyticsContext () {
		let h = getHistory() || [];
		if (h.length > 0 && h[h.length - 1] === this[getEntityId]()) {
			h.length--; // don't include ourselves in the context
		}
		return Promise.resolve(h);
	},

	resumeAnalyticsEvents () {
		this[startAnalyticsEvent]();
	}
};
