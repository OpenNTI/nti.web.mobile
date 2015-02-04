import React from 'react/addons';

import IconBar from './IconBar';
import List from './List';
import Catalog from '../catalog/components/View';

export default React.createClass({
	displayName: 'Section',


	_contentView (section) {
		switch (section) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case 'courses':
			case 'books':
				return (<List {...this.props} section={section}/>);

			case 'catalog':
				return (<Catalog {...this.props}/>);

			default:
				return (<div {...this.props}>Unknown section</div>);
		}
	},

	render () {
		return (
			<div>
				<IconBar {...this.props}/>
				{this._contentView(this.props.section)}
			</div>
		);
	}

});
