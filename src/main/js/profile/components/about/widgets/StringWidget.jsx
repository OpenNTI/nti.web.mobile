import PropTypes from 'prop-types';
import React from 'react';

import {rawContent} from 'nti-commons';

export default class extends React.Component {
    static displayName = 'StringWidget';

    static propTypes = {
		item: PropTypes.string.isRequired
	};

    static handles(item) {
        return typeof item === 'string';
    }

    render() {
		return <div className="string-item" {...rawContent(this.props.item)}/>;
	}
}
