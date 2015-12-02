// let Relay = require('react-relay');
//
// class GradebookRoute extends Relay.Route {
// }
//
// GradebookRoute.routeName = 'GradebookRoute';
// GradebookRoute.queries = {
// 	store: ((Row, variables) => {
// 		return Relay.QL`
// 			query root($rootId: ID!) {
// 				gradebookByAssignment(id: $rootId, filter: "Open") {
// 					${Row.getFragment('store')}
// 				}
// 			}
// 		`;
// 	})
// };
//
// export default GradebookRoute;
