import React from 'react';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Package',
	mixins: [BasePathAware],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentWillMount () {
		this.props.item.addListener('changed', this._onChange);
	},


	componentWillUnmount () {
		this.props.item.removeListener('changed', this._onChange);
	},


	_onChange () {
		this.forceUpdate();
	},


	render () {
		var p = this.props.item;
		var id = encodeForURI(p.getID());
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
