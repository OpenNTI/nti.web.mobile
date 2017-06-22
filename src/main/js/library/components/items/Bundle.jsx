import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from 'nti-web-commons';
import {encodeForURI} from 'nti-lib-ntiids';

import Icon from './shared/Icon';

export default createReactClass({
	displayName: 'Bundle',
	mixins: [Mixins.BasePath],

	statics: {
		handles (item) {
			return item.isBundle;
		}
	},

	propTypes: {
		item: PropTypes.object.isRequired
	},


	getItem () {return this.props.item; },

	itemChanged () { this.forceUpdate(); },

	componentWillMount () {
		this.getItem().addListener('change', this.itemChanged);
	},

	componentWillUnmount () {
		this.getItem().removeListener('change', this.itemChanged);
	},


	render () {
		let item = this.getItem();
		let id = encodeForURI(item.getID());
		let {author, icon, title} = item || {};

		return (
			<div className="library-item bundle">
				<a href={this.getBasePath() + 'content/' + id + '/'}>
					<Icon src={icon}/>
					<label>
						<h3>{title}</h3>
						<address className="author">{author}</address>
					</label>
				</a>
			</div>
		);
	}
});
