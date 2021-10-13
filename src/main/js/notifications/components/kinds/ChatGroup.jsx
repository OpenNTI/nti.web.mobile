import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
// import {DateTime} from '@nti/web-commons';

// import Avatar from 'internal/common/components/Avatar';
// import DisplayName from 'internal/common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ChatGroup',
	mixins: [NoteableMixin],

	statics: {
		// 'meeting' should cover both cases, but it's be nice to have an explicit list of what we're looking for here
		noteableType: ['_meeting', 'meeting'],
	},

	propTypes: {
		item: PropTypes.object,
	},

	componentDidMount() {
		// console.debug('Group Chat:', this.props.item);
	},

	render() {
		return <li className="notification-item" />;
	},
});
