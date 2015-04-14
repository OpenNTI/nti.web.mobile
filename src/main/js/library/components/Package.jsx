import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Package',
	mixins: [BasePathAware],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentWillMount () {
		this.props.item.addListener('changed', this.onChange);
	},


	componentWillUnmount () {
		this.props.item.removeListener('changed', this.onChange);
	},


	onChange () {
		this.forceUpdate();
	},


	render () {
		let p = this.props.item;
		let id = encodeForURI(p.getID());
		let {icon} = p || {};

		return (
			<div className="library-item package">
				<a href={this.getBasePath() + 'content/' + id + '/'}>
					<img src={icon}/>
					<label>
						<h3>{p.title}</h3>
						<address className="author">{p.author}</address>
					</label>
				</a>
			</div>
		);
	}
});
