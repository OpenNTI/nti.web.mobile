/**
 * This structure defines both navigation and all the primary routes in the application.
 * The structure is:
 * 		Array[Object{handler:String, path:String[, navIndex:Number]}]
 *
 * @namespace
 * @property {object} Object				A route in the array.
 * @property {string} Object.handler		The name of the handler to handle this route. The name comes from a map
 *                                    		in {@link Router#HANDLER_BY_NAME}, the name is the key into that map.
 * @property {string} Object.path			The route pattern. All paths should end in a "(/*)" to make the route
 *                                  		continue to match if the view is to have children routes. If left off,
 *                                  		the exact path will have to match. The parenthesis mean the expression
 *                                  		is optional.
 * @property {number} [Object.navIndex]		If present, will put the route in the top level navigation bar. The
 *                                       	index value is used to sort them in the UI. Items with a navIndex
 *                                       	property should have a simple path value. (No ':value' keys) This
 *                                       	path will be turned into an href. The asterisk and parenthesis will
 *                                       	be removed and the result is the href.
 *
 * The order of the array matters. The more specific paths must be earlier in the array
 * than the less specific routes.
 *
 */
export default [
	{handler: 'Object',		path: '/object/:objectId(/*)'},
	{handler: 'Login',		path: '/login/*'},
	{handler: 'Catalog',	path: '/catalog/*'},
	{handler: 'Contacts',	path: '/contacts/*'},
	{handler: 'Content',	path: '/content/:contentId/*'},
	{handler: 'Course',		path: '/course/:course/*'},
	{handler: 'Enrollment',	path: '/enroll/:course/*'},
	// {handler: 'Forums',		path: '/forums/*'},
	{handler: 'Library',	path: '/library(/*)'},
	{handler: 'Profile',	path: '/profile/:entityId(/*)'},
	{handler: 'Home',		path: '/'}
];
