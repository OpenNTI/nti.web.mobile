import React, {PropTypes} from 'react';
import CSS from 'fbjs/lib/CSSCore';
import cx from 'classnames';

const CONTEXT_KEY = 'content-background';

export default React.createClass({
	displayName: 'Background',

	propTypes: {
		className: PropTypes.any,
		imgUrl: PropTypes.string,
		children: PropTypes.any
	},

	childContextTypes: { [CONTEXT_KEY]: PropTypes.string },
	contextTypes: { [CONTEXT_KEY]: PropTypes.string },

	getChildContext () {
		return {
			[CONTEXT_KEY]: this.props.imgUrl || this.context[CONTEXT_KEY] || null
		};
	},


	getPreviousBackground () {
		return this.context[CONTEXT_KEY];
	},


	setBodyBackground (url) {
		const {body} = document;
		const {style} = body;

		const args = [body, 'content-background'];

		if (url) {
			CSS.addClass(...args);
		} else {
			CSS.removeClass(...args);
		}

		style.backgroundImage = url ? `url(${url})` : null;
	},


	componentDidMount () {
		const {props: {imgUrl}} = this;
		this.setBodyBackground(imgUrl);
	},


	componentWillUnmount () {
		const prev = this.getPreviousBackground();
		this.setBodyBackground(prev);
	},


	render () {
		const {props: {className, imgUrl, children}} = this;
		return (
			<div {...this.props} className={cx('background-cmp', className, {'no-image': !imgUrl})}>
				{children}
			</div>
		);
	}
});
