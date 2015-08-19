import React from 'react';
import {areYouSure} from 'prompts';
import {scoped} from 'common/locale';
import Navigatable from 'common/mixins/NavigatableMixin';
let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'ListDetailHeader',

	mixins: [Navigatable],
	
	propTypes: {
		list: React.PropTypes.object.isRequired
	},

	deleteList () {
		let {list} = this.props;
		areYouSure(t('deleteListPrompt')).then(() => {
			this.setState({
				loading: true
			});
			list.delete()
				.then(() => {
					this.navigate('/lists/');
				});
		});
	},

	render () {

		let {list} = this.props;

		return (
			<header className="item-detail-header">
				<h1>{list.displayName}</h1>
				<button className="delete-icon" onClick={this.deleteList}>Delete</button>
				<button className="rename" onClick={this.rename} >Rename</button>
			</header>
		);
	}
});
