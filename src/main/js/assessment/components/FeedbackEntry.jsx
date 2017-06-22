import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import Editor from './FeedbackEditor';

const t = scoped('ASSESSMENT.ASSIGNMENTS.FEEDBACK');



export default class FeedbackEntry extends React.Component {

	static propTypes = {
		feedback: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired
	};

	state = {
		active: false
	};

	toggleEditor = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({ active: !this.state.active });
	};

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
	}

	onSubmit = (value) => {
		let thenable = this.props.onSubmit(value);
		if (!thenable) {
			return;
		}

		return thenable.then(
			()=> {//success, close editor
				this.setState({active: false});
			});
	};
}
