import React from 'react';
import WordBankEntry from '../WordBankEntry';

export default class extends React.Component {
    static displayName = 'FillInTheBlankWithWordBankEntry';

    static propTypes = {
		input: React.PropTypes.object.isRequired,
		onReset: React.PropTypes.func
	};

    onReset = (entry, cmp) => {
		const {onReset, input} = this.props;
		onReset && onReset(input, entry, cmp);
	};

    render() {
		return (
			<WordBankEntry {...this.props} onReset={this.onReset}/>
		);
	}
}
