import React from 'react';
import PropTypes from 'prop-types';

import WordBankEntry from '../WordBankEntry';

export default class extends React.Component {
	static displayName = 'FillInTheBlankWithWordBankEntry';

	static propTypes = {
		input: PropTypes.object.isRequired,
		onReset: PropTypes.func
	};

	onReset = (entry, cmp) => {
		const {onReset, input} = this.props;
		onReset && onReset(input, entry, cmp);
	};

	render () {
		return (
			<WordBankEntry {...this.props} onReset={this.onReset}/>
		);
	}
}
