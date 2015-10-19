import React from 'react';

export default React.createClass({
	displayName: 'SupportLinks',

	render () {
		return (
			<div className="links">
				<a href="http://nextthought.com" id="about" title="About" target="_blank" tabIndex="9">About</a>
				<a href="mailto:support@nextthought.com" id="help" title="Contact Support" target="_blank" tabIndex="10">Help</a>
				<a href="https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM" target="_blank" title="NextThought Terms of Service and User Agreements" tabIndex="11">Terms</a>
				<a href="https://docs.google.com/document/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM" target="_blank" title="Learn about your privacy and NextThought" className="privacy" tabIndex="12">Privacy</a>
			</div>
		);
	}
});
