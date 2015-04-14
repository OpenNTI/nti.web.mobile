import React from 'react';

import Editor from './FeedbackEditor';

import {scoped} from 'common/locale';

const t = scoped('ASSESSMENT.ASSIGNMENTS.FEEDBACK');



export default React.createClass({
	displayName: 'FeedbackEntry',

	propTypes: {
		feedback: React.PropTypes.object.isRequired,
		onSubmit: React.PropTypes.func.isRequired
	},

	getInitialState () {
		return {
			active: false
		};
	},


	toggleEditor (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({ active: !this.state.active });
	},


	render () {
		let {feedback} = this.props;
		if (!feedback || !feedback.getLink('edit')) {
			return null;
		}

		return (
			<div className="feedback entry">
				<div className="input-area">
				{this.state.active ?
					<Editor onSubmit={this.onSubmit} onCancel={this.toggleEditor}/>
					:
					<a href="#" className="placeholder" onClick={this.toggleEditor}>{t('entryPlaceholder')}</a>
				}
				</div>
			</div>
		);
	},


	onSubmit (value) {
		let thenable = this.props.onSubmit(value);
		if (!thenable) {
			return;
		}

		return thenable.then(
			()=>{//success, close editor
				if (this.isMounted()) {
					this.setState({active: false});
				}
			});
	}
});
