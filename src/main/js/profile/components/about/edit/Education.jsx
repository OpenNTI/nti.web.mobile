import React from 'react';
import EducationItem from './EducationItem';
import Mixin from './Mixin';
import AddEntryButton from './AddEntryButton';

const MimeType = 'application/vnd.nextthought.profile.educationalexperience';

export default React.createClass({
	displayName: 'Education:Edit',
	mixins: [Mixin],

	propTypes: {
		items: React.PropTypes.array,

		field: React.PropTypes.string.isRequired
	},

	render () {
		let {items} = this.state || {};

		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div className="entry" key={`item-${index}`}>
							<div className="remove icon-bold-x" onClick={this.removeEntry.bind(this, index)}/>
							<EducationItem item={item} ref={`item-${index}`} />
						</div>
					);
				})}
				<div className="controls buttons">
					<AddEntryButton onClick={this.addEntry.bind(this, MimeType)} />
				</div>
			</div>

		);
	}
});
