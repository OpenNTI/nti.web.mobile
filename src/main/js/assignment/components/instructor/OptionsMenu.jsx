import './OptionsMenu.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import AssignmentSummary from '../bindings/AssignmentSummary';
import {Receiver as ShowAvatars} from '../bindings/ShowAvatars';

import MenuTransitionGroup from './MenuTransitionGroup';
import PageSizeMenuOption from './PageSizeMenuOption';

export default
@AssignmentSummary.connect
@ShowAvatars.connect
class OptionsMenu extends React.Component {

	static propTypes = {
		showAvatars: PropTypes.bool,
		setShowAvatars: PropTypes.func,
		store: PropTypes.object,
	}

	state = {
		open: false
	}


	toggleMenu = () => {
		this.setState(({open}) => ({ open: !open }));
	}


	setPageSize = (num) => {
		this.props.store.setPageSize(num);
	}


	toggleAvatars = (event) => {
		const {showAvatars, setShowAvatars} = this.props;

		event.stopPropagation(); // leave the menu open

		setShowAvatars(!showAvatars);
	}

	render () {
		const {
			props: {
				showAvatars,
				store
			},
			state: {
				open
			}
		} = this;

		const classes = cx('options-menu-wrapper', {open});

		const values = [50, 75, 100];

		return (
			<div className={classes} onClick={this.toggleMenu}>
				<i className="icon-gear-menu" />
				<MenuTransitionGroup>
					{open && (
						<ul className="options-menu">
							<li key="title" className="title">Display</li>
							{values.map(value => (
								<PageSizeMenuOption
									key={value}
									value={value}
									onClick={this.setPageSize}
									className={cx({'selected': store.getPageSize() === value})}
								/>
							))}
							<li onClick={this.toggleAvatars}>
								<input type="checkbox" onChange={this.toggleAvatars} checked={showAvatars} />
								<span> Show Avatars</span>
							</li>
						</ul>
					)}
				</MenuTransitionGroup>
			</div>
		);
	}
}
