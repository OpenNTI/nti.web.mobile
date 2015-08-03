import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Bundle',
	mixins: [BasePathAware],

	propTypes: {
		item: React.PropTypes.object.isRequired
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
					<img src={icon}/>
					<label>
						<h3>{title}</h3>
						<address className="author">{author}</address>
					</label>
				</a>
			</div>
		);
	}
});
