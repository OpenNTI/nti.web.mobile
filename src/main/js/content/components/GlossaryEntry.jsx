import React from 'react/addons';

export default React.createClass({
	displayName: 'GlossaryEntry',

	componentDidMount () {
		var entryEl = document.getElementById(this.props.entryid);
		console.debug('didmount, %O',entryEl);
		if (entryEl) {
			this.refs.content.getDOMNode().innerHTML = entryEl.innerHTML;
		}
	},

	render () {
		return (
			<div {...this.props} className="glossary-entry">
				<div ref="content" className="def small-9 columns small-centered"/>
			</div>
		);
	}

});
