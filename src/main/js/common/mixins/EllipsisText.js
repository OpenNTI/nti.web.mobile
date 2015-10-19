import React from 'react';
import ReactDOM from 'react-dom';
import setTextContent from 'react/lib/setTextContent';

import SharedExecution from '../utils/SharedExecution';




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
		console.error('EllipsisText is not safe on markup. Terminating.');
		return;
	}

	return SharedExecution.schedual(() => {
		let box = el;
		if (measure === 'parent') {
			box = el.parentNode;
		}

		function work () {
			if (box.scrollHeight - (box.clientHeight || box.offsetHeight) >= 1) {
				if (getText() !== '...') {
					setTitleOnce();
					setText(getText().replace(/[^\.](\.*)$/, '...'));
					return SharedExecution.schedual(work);
				}
			}
		}

		return work();
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
