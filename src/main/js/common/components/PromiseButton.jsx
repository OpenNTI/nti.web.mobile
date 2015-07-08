import React from 'react';
import TinyLoader from 'common/components/TinyLoader';
import cx from 'classnames';

const NORMAL = 'normal',
		PROCESSING = 'processing',
		FINISHED = 'finished';

export default React.createClass({
	displayName: 'PromiseButton',

	propTypes: {
		text: React.PropTypes.string,
		promise: React.PropTypes.func.isRequired,
		then: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			status: NORMAL
		};
	},

	reset() {
		this.setState(this.getInitialState());
	},

	go() {
		let {promise} = this.props;
		this.setState({
			status: PROCESSING
		});
		promise().then(result => {
			this.setState({
				status: FINISHED
			});
			let reset = this.reset.bind(this);
			let {then} = this.props;
			setTimeout(function() {
				reset();
				if (typeof then === 'function') {
					then(result);
				}
			}, 1000);
		});
	},

	render () {

		let css = cx('promise-button', this.state.status);

		return (
			<button className={css} onClick={this.go}>
				<ul>
					<li>{this.props.text || 'Go'}</li>
					<li className="processing"><TinyLoader /></li>
					<li className="finished">Result</li>
				</ul>
			</button>
		);
	}
});
