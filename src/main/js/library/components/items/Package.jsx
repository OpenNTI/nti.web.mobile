import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {getModel} from 'nti.lib.interfaces';

import BasePathAware from 'common/mixins/BasePath';

import Icon from './Icon';
const PackageClass = getModel('ContentPackage');

export default React.createClass({
	displayName: 'Package',
	mixins: [BasePathAware],

	statics: {
		handles (item) {
			return item instanceof PackageClass;
		}
	},

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
		let {author, icon, title} = item;

		return (
			<div className="library-item package">
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
