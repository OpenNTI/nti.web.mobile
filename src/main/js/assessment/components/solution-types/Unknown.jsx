import React from 'react';
import t from 'common/locale';


export default React.createClass({
	displayName: 'Unknown',

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		console.debug('Input Type Missing: %s', this.props.item.MimeType);
		return (
			<div className="unknown solution">

				<h4>{t('COMING_SOON.singular', {subject: 'This solution type'})}</h4>

			</div>
		);
	}
});
