import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Prompt, Mixins } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { Button, Icons } from '@nti/web-core';

const DEFAULT_TEXT = {
	deleteListPrompt: 'Delete this list?',
};

const t = scoped('contacts.lists', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'ItemDetailHeader',

	mixins: [Mixins.NavigatableMixin],

	propTypes: {
		list: PropTypes.object.isRequired,
	},

	attachRef(x) {
		this.newName = x;
	},

	getInitialState() {
		return {
			renaming: false,
		};
	},

	deleteList() {
		let { list } = this.props;
		Prompt.areYouSure(t('deleteListPrompt')).then(() => {
			this.setState({
				loading: true,
			});
			list.delete().then(() => {
				this.navigate('/lists/');
			});
		});
	},

	nameIsValid(name) {
		return (name || '').trim().length > 0;
	},

	nameInputChanged(event) {
		let value = event.target.value;
		this.setState({
			saveDisabled: !this.nameIsValid(value),
		});
	},

	toggleRename() {
		const {
			newName,
			state: { renaming },
		} = this;
		this.setState(
			{
				renaming: !renaming,
			},
			() => {
				if (newName) {
					newName.focus();
					(n => (n.selectionStart = n.selectionEnd = n.value.length))(
						newName
					);
				}
			}
		);
	},

	saveRename() {
		const {
			props: { list },
			newName,
		} = this;

		let alias = newName.value.trim();

		list.save({ alias }).then(this.toggleRename);
	},

	render() {
		const {
			props: { list },
			state: { renaming, saveDisabled },
		} = this;

		return (
			<header className="item-detail-header">
				<h1>
					{renaming ? (
						<input
							autoFocus
							type="text"
							ref={this.attachRef}
							defaultValue={list.displayName}
							onChange={this.nameInputChanged}
						/>
					) : (
						list.displayName
					)}
				</h1>
				{renaming ? (
					<div
						css={css`
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							background: rgba(255 255 255 / 20%);
							gap: 1em;
							display: flex;
							justify-content: flex-end;
						`}
					>
						<Button plain onClick={this.toggleRename}>
							Cancel
						</Button>
						<Button
							disabled={saveDisabled}
							onClick={this.saveRename}
						>
							Save Name
						</Button>
					</div>
				) : (
					<div>
						<Button
							onClick={this.deleteList}
							destructive
							rounded
							ph="sm"
							pv="xs"
							css={css`
								position: absolute;
								top: 1rem;
								right: 1rem;
								--icon-size: 1.7rem;
							`}
						>
							<Icons.TrashCan />
						</Button>
						<Button
							onClick={this.toggleRename}
							plain
							css={css`
								/* background: none;
								font-size: 0.75rem;
								letter-spacing: 0.1em;
								padding: 0; */
							`}
						>
							<Icons.Pencil /> Rename
						</Button>
					</div>
				)}
			</header>
		);
	},
});
