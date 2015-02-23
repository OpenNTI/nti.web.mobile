import React from 'react';

import IconBar from './IconBar';

import List from './List';

const mapping = {
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
