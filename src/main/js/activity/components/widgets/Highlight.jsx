import React from 'react';
import cx from 'classnames';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'Highlight',
	mixins: [Mixin],

	statics: {
		mimeType: /highlight$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		let {presentationProperties} = item;
		let colorName = (presentationProperties || {}).highlightColorName;

		let css = cx('application-highlight', 'plain', colorName, {
			'colored': colorName
		});

		return (
			<div>
				<div className="body">
					<span className={css} dangerouslySetInnerHTML={{__html: item.selectedText}}/>
				</div>
			</div>
		);

	}
});
