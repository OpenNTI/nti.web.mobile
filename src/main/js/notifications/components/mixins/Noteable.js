import Logger from 'nti-util-logger';
import {isNTIID, encodeForURI} from 'nti-lib-ntiids';
import {Mixins} from 'nti-web-commons';

const logger = Logger.get('notifications:mixin');

export default {
	mixins: [Mixins.BasePath],

	statics: {
		handles (item) {
			let change = item;
			item = change.Item || change;
			item = item.MimeType.replace('application/vnd.nextthought.', '');

			if (!Array.isArray(this.noteableType)) {
				this.noteableType = [this.noteableType];
			}

			return (this.noteableType.indexOf(item) !== -1);
		}
	},

	getInitialState () { return {}; },

	componentWillMount () {
		let change = this.props.item;
		let item = change.Item || change;
		let username = item.creator || item.Creator;
		let url;

		try {
			let id = item.getID();

			id = isNTIID(id) ? encodeForURI(id) : encodeURIComponent(id);

			url = `${this.getBasePath()}object/${id}/`;
		} catch(e) {
			logger.warn('Notable has no url: ', item);
		}

		this.setState({ username, change, item, url });
	},

	getEventTime (other) {
		let {item, change} = this.state;
		//Get the time from the item, if not found, use the change.
		return getTime(other) || getTime(item) || getTime(change);
	}
};


function getTime (o) {
	try {
		let lm = o && o.getLastModified();
		//Return the Last Modified, unless its not set
		return o && !lm ? o.getCreatedTime() : lm;
	} catch	(e) {
		logger.warn('No Date for object:', o);
		return new Date(0);
	}
}
