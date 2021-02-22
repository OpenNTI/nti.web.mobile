import React from 'react';

import GlossaryEntry from '../GlossaryEntry';

export default {
	getGlossaryId() {
		return this.state.glossaryId;
	},

	onDismissGlossary() {
		this.setState({
			glossaryId: null,
		});
	},

	renderGlossaryEntry() {
		let id = this.getGlossaryId();
		if (id) {
			return React.createElement(GlossaryEntry, {
				entryid: id,
				onClick: this.onDismissGlossary,
			});
		}
	},
};
