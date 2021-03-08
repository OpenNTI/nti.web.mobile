import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Switch } from '@nti/web-commons';
import Storage from '@nti/web-storage';

import Filters from './Filters';
import { getTabs } from './util';

const storageKey = 'app:right-overlay:tabs:selected-tab';

class Tab extends React.Component {
	static propTypes = {
		item: PropTypes.string,
		label: PropTypes.string,
		children: PropTypes.any,
		className: PropTypes.string,
	};

	rememberSelectedTab = () => Storage.setItem(storageKey, this.props.item);

	render() {
		const { children, className, ...other } = this.props;

		return (
			<Switch.Trigger
				className={cx('tab-label', className)}
				onClick={this.rememberSelectedTab}
				{...other}
			>
				{children}
			</Switch.Trigger>
		);
	}
}

export default class View extends React.Component {
	state = {};

	componentDidMount() {
		this.setUp();
	}

	setUp = async () => {
		const tabs = await getTabs();
		this.setState({ tabs });
	};

	renderTrigger = ([key, { label, labelCmp = label }]) => (
		<Tab key={key} item={key} className={key} title={label}>
			{labelCmp}
		</Tab>
	);

	renderItem = ([key, { label, component }]) => (
		<Switch.Item
			className={key}
			key={key}
			name={key}
			component={component}
		/>
	);

	render() {
		const { tabs } = this.state;

		if (!tabs) {
			return null;
		}

		const active = Storage.getItem(storageKey) || Object.keys(tabs)[0];

		return (
			<>
				<Filters />
				<Switch.Panel
					className="nti-mobile-drawer-tab-panel"
					active={active}
				>
					<Switch.Controls className="nti-mobile-drawer-tabs">
						{Object.entries(tabs).map(this.renderTrigger)}
					</Switch.Controls>
					<Switch.Container className="nti-mobile-drawer-tab-content">
						{Object.entries(tabs).map(this.renderItem)}
					</Switch.Container>
				</Switch.Panel>
			</>
		);
	}
}
