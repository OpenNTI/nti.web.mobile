import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {Prompt, Mixins} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
import cx from 'classnames';

let t = scoped('CONTACTS');

export default createReactClass({
	displayName: 'ItemDetailHeader',

	mixins: [Mixins.NavigatableMixin],

	propTypes: {
		list: PropTypes.object.isRequired
	},


	attachRef (x) { this.newName = x; },


	getInitialState () {
		return {
			renaming: false
		};
	},

	deleteList () {
		let {list} = this.props;
		Prompt.areYouSure(t('deleteListPrompt')).then(() => {
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
		const {newName, state: {renaming}} = this;
		this.setState({
			renaming: !renaming
		}, () => {
			if(newName) {
				newName.focus();
				(n => n.selectionStart = n.selectionEnd = n.value.length)(newName);
			}
		});
	},

	saveRename () {
		const {props: {list}, newName} = this;

		let alias = newName.value.trim();

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
				<h1>{renaming ? <input type="text" ref={this.attachRef} defaultValue={list.displayName} onChange={this.nameInputChanged} /> : list.displayName}</h1>
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
