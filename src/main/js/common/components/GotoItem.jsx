import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import ObjectLink from '../mixins/ObjectLink';

export default createReactClass({
	displayName: 'GotoItem',
	mixins: [ObjectLink],

	propTypes: {
		item: PropTypes.object.isRequired,
	},

	render() {
		const { item } = this.props;
		return <a href={this.objectLink(item)} {...this.props} />;
	},
});
