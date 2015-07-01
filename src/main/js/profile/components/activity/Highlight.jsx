import React from 'react';

import Mixin from './Mixin';
import Breadcrumb from './Breadcrumb';
import cx from 'classnames';

export default React.createClass({
	displayName: 'Highlight',
	mixins: [Mixin],

	statics: {
		mimeType: /highlight/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		let css = cx('application-highlight', 'plain', item.presentationProperties.highlightColorName);

		return (
			<div>
				<Breadcrumb item={item} />
				<div className="body">
					<span className={css}>{item.selectedText}</span>
				</div>
			</div>
		);

	}
});
