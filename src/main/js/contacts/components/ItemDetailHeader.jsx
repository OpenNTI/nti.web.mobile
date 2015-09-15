import React from 'react';
import {areYouSure} from 'prompts';
import {scoped} from 'common/locale';
import Navigatable from 'common/mixins/NavigatableMixin';
import cx from 'classnames';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'ItemDetailHeader',

	mixins: [Navigatable],

	propTypes: {
		list: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			renaming: false
		};
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

	nameIsValid (name) {
		return (name || '').trim().length > 0;
	},

	nameInputChanged (event) {
		let value = event.target.value;
		this.setState({
			saveDisabled: !this.nameIsValid(value)
		});
	},

	toggleRename () {
		const {refs: {newName}, state: {renaming}} = this;
		this.setState({
			renaming: !renaming
		}, () => {
			if(newName) {
				let n = React.findDOMNode(newName);
				n.focus();
				n.selectionStart = n.selectionEnd = n.value.length;
			}
		});
	},

	saveRename () {
		const {props: {list}, refs: {newName}} = this;

		let alias = React.findDOMNode(newName).value.trim();

		console.log(alias);

		list.save({alias})
			.then(this.toggleRename);
	},

	render () {

		const {props: {list}, state: {renaming, saveDisabled}} = this;

		let saveRenameClasses = cx('primary tiny button', {
			'disabled': saveDisabled
		});

		return (
			<header className="item-detail-header">
				<h1>{renaming ? <input type="text" ref="newName" defaultValue={list.displayName} onChange={this.nameInputChanged} /> : list.displayName}</h1>
				{renaming
					?
					<div className="rename controls">
						<button className="secondary tiny button" onClick={this.toggleRename}>Cancel</button>
						<button className={saveRenameClasses} onClick={this.saveRename}>Save Name</button>
					</div>
					:
					<div>
						<button className="delete-icon" onClick={this.deleteList}>Delete</button>
						<button className="rename" onClick={this.toggleRename} ><i className="icon-pencil"/> Rename</button>
					</div>
				}
			</header>
		);
	}
});
