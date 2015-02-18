import React from 'react';
import {setCourse} from 'course/Actions';

import BasePathAware from '../mixins/BasePath';

export default React.createClass({
	mixins: [BasePathAware],

	_onClick: function() {
		setCourse(null);
	},

	render: function() {
		return (
			<a href={this.getBasePath()} onClick={this._onClick}>Home</a>
		);
	}

});
