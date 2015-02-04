import React from 'react/addons';
import {BLANK_IMAGE} from 'common/constants/DataURIs';
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
		var style = {
			backgroundImage: p && p.icon && 'url(' + p.icon + ')'
		};

		var id = encodeForURI(p.getID());

		return (
			<li className="grid-item">
				<a href={this.getBasePath() + 'content/' + id + '/'}>
					<img style={style} src={BLANK_IMAGE}/>
					<div className="metadata">
						<h3>{p.title}</h3>
						<h5>{p.author}</h5>
					</div>
				</a>
			</li>
		);
	}
});
