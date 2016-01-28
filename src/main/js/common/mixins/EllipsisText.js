import React from 'react';
import ReactDOM from 'react-dom';
import setTextContent from 'react/lib/setTextContent';

import SharedExecution from '../utils/SharedExecution';


export function trim (value, len, word) {
	if (value && value.length > len) {
		if (word) {
			const vs = value.substr(0, len - 2);
			const index = Math.max(
					vs.lastIndexOf(' '),
					vs.lastIndexOf('.'),
					vs.lastIndexOf('!'),
					vs.lastIndexOf('?')
				);

			if (index !== -1 && index >= (len - 15)) {
				return vs.substr(0, index) + '...';
			}
		}
		return value.substr(0, len - 3) + '...';
	}

	return value;
}



function truncateText (el, measure) {
	let textProperty = (el.textContent != null) ? 'textContent' : 'innerText';

	let getText = () => el[textProperty];
	let setText = text => setTextContent(el, text);


	let setTitleOnce = () => {
		el.setAttribute('title', getText());
		setTitleOnce = () => {};
	};

	//if the element only has text nodes as children querySelector will return null.
	if (el.querySelector('*')) {
		console.error('EllipsisText is not safe on markup. Terminating.'); //eslint-disable-line
		return;
	}


	return SharedExecution.schedual(() => {
		const box = (measure === 'parent') ? el.parentNode : el;
		const tooBig = () => box.scrollHeight - (box.clientHeight || box.offsetHeight) >= 1;


		function trimStep () {
			if (tooBig()) {
				if (getText() !== '...') {
					setTitleOnce();

					setText(getText().replace(/[^\.](\.*)$/, '...'));

					return SharedExecution.schedual(trimStep);
				}
			}
		}


		return trimStep();
	});
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
		SharedExecution.clear(this.tt);
		this.tt = truncateText(ReactDOM.findDOMNode(this), this.props.measureOverflow);
	},


	componentDidUpdate () {
		SharedExecution.clear(this.tt);
		this.tt = truncateText(ReactDOM.findDOMNode(this), this.props.measureOverflow);
	}
};
