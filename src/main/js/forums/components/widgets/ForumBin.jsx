import React from 'react';
import PropTypes from 'prop-types';

import keyFor from '../../utils/key-for-item';

import ForumBoard from './ForumBoard';


export default function ForumBin ({title, bin}) {
	return (
		<div className="bin">
			<h2>{title}</h2>
			<ul>
				{Object.keys(bin).map((key, i, boards) => {
					let board = bin[key];
					return (
						<li key={keyFor(board)}>
							<ForumBoard
								title={key === 'Section' && boards.length === 1 ? '' : key}
								board={board}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

ForumBin.propTypes = {

	/**
	*	A bin is an object with boards. Currently the usual bins
	* 	are "Enrolled For-Credit", "Open Discussions", "Other Discussions"
	*	{
	*		Parent: {
	*			forums: [...]
	*		},
	*		Section: {
	*			forums: [...]
	*		}
	*	}
	*/
	bin: PropTypes.object.isRequired,

	/**
	* The localized title for this bin (e.g. "Enrolled For-Credit")
	*/
	title: PropTypes.string.isRequired
};
