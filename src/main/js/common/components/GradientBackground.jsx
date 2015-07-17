import React from 'react';

import cx from 'classnames';

export default React.createClass({
	displayName: 'GradientBackground',

	propTypes: {
		className: React.PropTypes.any,
		imgUrl: React.PropTypes.string,
		children: React.PropTypes.any
	},

	componentDidMount () {
		this.setBackground();
	},

	componentWillReceiveProps (nextProps) {
		this.setBackground(nextProps);
	},

	componentWillUnmount () {
		this.removeBackground();
	},

	setBackground (props=this.props) {
		if (props.imgUrl) {
			document.body.style.background = `url('${props.imgUrl}') 0px 100vh fixed`;
		}
		else {
			this.removeBackground();
		}
	},

	removeBackground () {
		document.body.style.background = '';
	},

	render () {
		let {className} = this.props;
		return (
			<div {...this.props} className={cx('gradient-bg', className)} />
		);
	}
});
