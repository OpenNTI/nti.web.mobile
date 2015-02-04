import React from 'react/addons';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';
import {BLANK_IMAGE} from 'common/constants/DataURIs';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'Entry',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getItem () {return this.props.item;},
	itemChanged () {this.forceUpdate(); },

	componentWillMount () { this.getItem().addListener('changed', this.itemChanged); },
	componentWillUnmount () { this.getItem().removeListener('changed', this.itemChanged); },

	render () {
		var item = this.getItem();
		if (!item) {return;}

		var courseId = encodeForURI(item.getID());

		var style = {
			backgroundImage: item && item.icon && 'url(' + item.icon + ')'
		};

		var href = '/item/' + courseId + '/';

		return (
			<li className="grid-item">
				<Link href={href}>
					<img style={style} src={BLANK_IMAGE}/>
					<div className="metadata">
						<h3>{item.Title}</h3>
						<h5>{item.ProviderUniqueID}</h5>
					</div>
				</Link>
			</li>
		);
	}
});
