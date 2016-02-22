import React from 'react';

export default React.createClass({
	displayName: 'GlossaryEntry',

	propTypes: {
		entryid: React.PropTypes.string
	},

	componentDidMount () {
		let entryEl = document.getElementById(this.props.entryid);
		// console.debug('didmount, %O', entryEl);
		if (entryEl) {
			this.content.innerHTML = entryEl.innerHTML;
		}
	},

	render () {
		return (
			<div {...this.props} className="glossary-entry">
				<div ref={x => this.content = x} className="def small-9 columns small-centered"/>
			</div>
		);
	}

});
