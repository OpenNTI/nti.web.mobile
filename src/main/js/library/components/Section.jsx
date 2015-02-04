import React from 'react/addons';

import IconBar from './IconBar';

import List from './List';
import Catalog from '../catalog/components/View';


const mapping = {
	'catalog': Catalog
};


export default React.createClass({
	displayName: 'Section',

	render () {
		var SelectedList = mapping[this.props.section] || List;
		return (
			<div>
				<IconBar {...this.props}/>
				<SelectedList {...this.props}/>
			</div>
		);
	}

});
