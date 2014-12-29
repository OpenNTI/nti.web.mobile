'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ASSESSMENT.ASSIGNMENTS.FEEDBACK');

module.exports = React.createClass({
	displayName: 'FeedbackEntry',

	getInitialState: function() {
		return {
			active: false
		};
	},


	onOpenEditor: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({ active: true });
	},


	render: function() {
		return (
			<div className="feedback entry">
				<div className="input-area">
				{this.state.active ? this.renderEditor() : (
					<a href="#" className="placeholder" onClick={this.onOpenEditor}>{_t('entryPlaceholder')}</a>
				)}
				</div>
			</div>
		);
	},


	renderEditor: function () {
		return (<div className="text-center disabled faded">Editor Under Construction</div>);
	}
});
