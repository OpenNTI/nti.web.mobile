import React from 'react';
import EducationItem from './EducationItem';
import Mixin from './Mixin';
import AddEntryButton from './AddEntryButton';

const MimeType = 'application/vnd.nextthought.profile.educationalexperience';

export default React.createClass({
	displayName: 'Education:Edit',

	mixins: [Mixin],

	getMimeType() {
		return MimeType;
	},

	render () {
		let {items} = this.state;
		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div className="entry">
							<div className="remove icon-bold-x" onClick={this.removeEntry.bind(this, index)}></div>
							<EducationItem item={item} key={`ed-item-${index}`} onChange={this.itemChanged.bind(this, item)} />
						</div>
					);
				})}
				<div className="controls buttons">
					<AddEntryButton onClick={this.addEntry} />
				</div>
			</div>

		);
	}
});
