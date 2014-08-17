/**
 * Constants for HTTP response codes.
 * @class HTTP_STATUS_CODES
 */

module.exports = {
	/**
	* @property NO_CONTENT (204)
	* @static
	* @final
	*/
	NO_CONTENT: 204,

	/**
	* IE8 mangles 204 responses from ajax requests into 1223.
	* @property NO_CONTENT_IE8 (1223)
	* @static
	* @final
	*/
	NO_CONTENT_IE8: 1223,

	/**
	* @property UNAUTHORIZED (401)
	* @static
	* @final
	*/
	UNAUTHORIZED: 401,
	
	/**
	* @property NOT_FOUND (404)
	* @static
	* @final
	*/
	NOT_FOUND: 404
}
