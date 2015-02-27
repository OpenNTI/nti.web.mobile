import React from 'react';

function truncateText (el, measure) {
	let textProperty = (el.textContent != null) ? 'textContent' : 'innerText';

	let getText = () => el[textProperty];
	let setText = text => el[textProperty] = text;

	let setTitleOnce = () => {
		el.setAttribute('title', getText());
		setTitleOnce = ()=>{};
	};

	return setTimeout(() => {
		let box = el;
		if (measure === 'parent') {
			box = el.parentNode;
		}

		while (box.scrollHeight - (box.clientHeight || box.offsetHeight) >= 1) {
			if (getText() === '...') {
				break;
			}
			setTitleOnce();
			setText(getText().replace(/.(\.+)?$/, '...'));
		}

	}, 100);
}

export default {

	propTypes: {
		measureOverflow: React.PropTypes.oneOf(['self', 'parent']).isRequired
	},

	getDefaultProps () {
		return {
			measureOverflow: 'self'
		};
	},

	componentDidMount () {
		clearTimeout(this.tt);
		this.tt = truncateText(this.getDOMNode(), this.props.measureOverflow);
    },


    componentDidUpdate () {
		clearTimeout(this.tt);
		this.tt = truncateText(this.getDOMNode(), this.props.measureOverflow);
	}
};
