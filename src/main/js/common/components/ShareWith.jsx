import './ShareWith.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Logger from '@nti/util-logger';
import { Selection } from '@nti/lib-commons';
import { Loading } from '@nti/web-commons';
import { getService } from '@nti/web-client';

import ShareTarget from './ShareTarget';
import SelectableEntities from './SelectableEntities';
import Search from './EntitySearch';

const logger = Logger.get('common:components:ShareWith');

const KEY = 'defaultValue';

const EVENTS = ['focus', 'focusin', 'click', 'touchstart'];

const trim = x => (typeof x === 'string' ? x.trim() : x);
const nullEmpty = x => (!x?.length ? null : x);

export default class ShareWith extends React.Component {
	static propTypes = {
		defaultValue: PropTypes.array,

		getSharingSuggestions: PropTypes.func,

		onBlur: PropTypes.func,

		readOnly: PropTypes.bool,
	};

	state = {};
	attachDomRef = x => {
		this.el = x;
	};
	attachEntryRef = x => {
		this.entry = x;
	};
	attachSearchRef = x => {
		this.search = x;
	};
	attachScrollerRef = x => {
		this.scroller = x;
	};

	componentDidMount() {
		this.setup();
		for (let e of EVENTS) {
			document.body.addEventListener(
				e,
				this.maybeCloseDrawer,
				e === 'focus'
			);
		}
	}

	componentDidUpdate(props) {
		if (props[KEY] !== this.props[KEY]) {
			this.setup();
		}
	}

	componentWillUnmount() {
		for (let e of EVENTS) {
			document.body.removeEventListener(
				e,
				this.maybeCloseDrawer,
				e === 'focus'
			);
		}

		this.setState({ focused: false });
	}

	setup = async (props = this.props) => {
		const stillValid = () => props[KEY] === this.props[KEY];
		const { getSharingSuggestions } = props;

		async function getSuggestions() {
			try {
				return nullEmpty(await getSharingSuggestions?.());
			} catch (e) {
				logger.error(
					'Error getting suggestions: ',
					e.stack || e.message || e
				);
				return null;
			}
		}

		let value = props.defaultValue;

		let selection = new Selection.EntitySelectionModel(value);

		this.setState({ value, selection });

		const service = await getService();
		const stores = [
			service.getCommunities(),
			service.getGroups(),
			service.getLists(),
			service.getContacts(),
		];

		const [suggestionsResults] = await Promise.allSettled([
			getSuggestions(),
			...stores.map(store => store?.waitForPending?.()),
		]);

		if (stillValid()) {
			const { value: suggestions = null } = suggestionsResults;

			const toArray = o =>
				nullEmpty(
					o &&
						Array.from(o).filter(
							x =>
								x &&
								!suggestions?.find(_ => x.getID() === _.getID())
						)
				);

			const [communities, groups, lists, contacts] = stores.map(toArray);

			this.setState({
				suggestionGroups: {
					suggestions,
					communities,
					groups,
					lists,
					contacts,
				},
			});
		}
	};

	maybeCloseDrawer = e => {
		const {
			state: { focused },
			el,
			entry,
			props: { onBlur },
		} = this;

		if (!focused || !el) {
			return;
		}

		if (!el.contains(e.target)) {
			clearTimeout(this.maybeCloseDrawerTimeout);
			this.maybeCloseDrawerTimeout = setTimeout(() => {
				let dy = el.offsetHeight - entry.offsetHeight;

				this.setState({ focused: false }, onBlur);

				//When this is used on a desktop environment and the
				//list is "out of flow"/positioned... don't assume
				//inline-mobile-styles.
				global.scrollBy(0, -dy);
			}, 500);
		}
	};

	focusSearch = () => {
		let search = this.getSearchBoxEl();
		if (search) {
			search.focus();
		}
	};

	getSearchBoxEl = () => {
		return this.search;
	};

	onFocus = () => {
		this.setState({ focused: true });
		this.focusSearch();
	};

	onInputBlur = () => {
		//this.setState({focused: true, inputFocused: false});
	};

	onListScroll = () => {
		const { scroller } = this;
		const search = this.getSearchBoxEl();
		if (search) {
			search.blur();
		}

		if (scroller) {
			scroller.focus();
		}

		clearTimeout(this.maybeCloseDrawerTimeout);
		this.setState({ focused: true, inputFocused: false });
	};

	onInputFocus = () => {
		clearTimeout(this.maybeCloseDrawerTimeout);
		this.setState({ focused: true, inputFocused: true });
	};

	onInputChange = () => {
		let search = (this.getSearchBoxEl() || {}).value;

		if (!search || search === '' || trim(search) === '') {
			search = void 0;
		}

		this.onInputFocus();
		this.setState({ search });
	};

	onSelectionChange = entity => {
		let {
			state: { selection },
		} = this;
		const selected = selection.isSelected(entity);
		let result = selected
			? selection.remove(entity)
			: selection.add(entity);

		// this.focusSearch();

		if (result) {
			if (selected) {
				this.forceUpdate();
			} else {
				this.setState({ search: '' });
			}
		}
	};

	onTokenTap = e => {
		let {
			state: { pendingRemove },
		} = this;

		if (pendingRemove === e) {
			e = void 0;
		}

		this.setState({ pendingRemove: e });
	};

	onKeyPressHandleDelete = e => {
		let {
			state: { selection, pendingRemove },
		} = this;

		if (e.target.value === '' && (e.keyCode === 8 || e.keyCode === 46)) {
			if (pendingRemove) {
				selection.remove(pendingRemove);
				pendingRemove = void 0;
			} else {
				let s = selection.getItems();
				pendingRemove = s[s.length - 1];
			}

			this.setState({ pendingRemove });
		} else if (pendingRemove) {
			this.setState({ pendingRemove: void 0 });
		}
	};

	render() {
		let {
			state: {
				focused,
				inputFocused,
				pendingRemove,
				search,
				selection,
				suggestionGroups,
			},
			props: { readOnly },
		} = this;
		const loading = !suggestionGroups;
		let groupings = Object.keys(suggestionGroups || {})
			.filter(x => suggestionGroups[x])
			.map(k => ({
				label: k,
				list: suggestionGroups[k],
			}));

		if (!selection) {
			return null;
		}

		let placeholder = selection.empty ? 'Share with' : null;

		return (
			<div
				ref={this.attachDomRef}
				className={cx('share-with', {
					active: focused && !readOnly,
					'read-only': readOnly,
				})}
			>
				<div
					ref={this.attachEntryRef}
					className="share-with-entry"
					onClick={this.onFocus}
				>
					{selection.getItems().map((e, index) => (
						<ShareTarget
							key={e.getID?.() || index}
							entity={e}
							selected={pendingRemove === e}
							onClick={this.onTokenTap}
						/>
					))}
					<span className="input-field" data-value={search}>
						<input
							type="text"
							ref={this.attachSearchRef}
							value={search}
							placeholder={placeholder}
							readOnly={readOnly}
							onBlur={this.onInputBlur}
							onFocus={this.onInputFocus}
							onChange={this.onInputChange}
							onKeyDown={this.onKeyPressHandleDelete}
						/>
					</span>
				</div>

				{focused && search && !readOnly ? (
					<div className="search-results">
						<div
							ref={this.attachScrollerRef}
							onTouchStart={this.onListScroll}
							onScroll={this.onListScroll}
							className={cx('scroller', 'visible', {
								restrict: inputFocused,
							})}
						>
							<h3>Search Results:</h3>
							<Search
								allowAny
								allowContacts
								query={trim(search)}
								selection={selection}
								onChange={this.onSelectionChange}
							/>
						</div>
					</div>
				) : (
					<div className="suggestions">
						{!focused || readOnly ? null : loading ? (
							<Loading.Ellipse />
						) : (
							<div
								ref={this.attachScrollerRef}
								onTouchStart={this.onListScroll}
								onScroll={this.onListScroll}
								className={cx('scroller', 'visible', {
									restrict: inputFocused,
								})}
							>
								{groupings.map((o, index) => (
									<div
										className="suggestion-group"
										key={index}
									>
										<h3>{o.label}</h3>
										<SelectableEntities
											entities={o.list}
											selection={selection}
											onChange={this.onSelectionChange}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		);
	}

	getValue = (
		valueTransformer = o => (typeof o === 'object' ? o.getID() : o)
	) => {
		let {
			state: { selection },
		} = this;
		return selection.getItems().map(valueTransformer);
	};
}
