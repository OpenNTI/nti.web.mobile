import React from 'react';
import {scoped} from '../locale';

const t = scoped('LISTS');

export default React.createClass({
	displayName: 'NoMatches',

	render () {
		return (
			<div className="notice nomatches">
				{t('noMatches')}
			</div>
		);
	}

});
