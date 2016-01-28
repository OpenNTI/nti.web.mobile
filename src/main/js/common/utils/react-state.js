import Logger from 'nti-util-logger';

const logger = Logger.get('common:utils:react-state');

export function setError (cmp, error) {
	logger.error('Component encountered an error:', error.stack || error);
	cmp.setState({error});
}

export function clearLoadingFlag (cmp) {
	cmp.setState({loading: false});
}
