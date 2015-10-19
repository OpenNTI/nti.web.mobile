export function setError (cmp, error) {
	console.error('Component encountered an error:', error.stack || error);
	cmp.setState({error});
}

export function clearLoadingFlag (cmp) {
	cmp.setState({loading: false});
}
