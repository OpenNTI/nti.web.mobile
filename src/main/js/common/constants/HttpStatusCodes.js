/**
 * Constants for HTTP response codes.
 * @class HTTP_STATUS_CODES
 */


/**
 * @property NO_CONTENT (204)
 * @static
 * @final
 */
export const NO_CONTENT = 204;

/**
 * IE8 mangles 204 responses from ajax requests into 1223.
 * @property NO_CONTENT_IE8 (1223)
 * @static
 * @final
 */
export const NO_CONTENT_IE8 = 1223;

/**
 * @property UNAUTHORIZED (401)
 * @static
 * @final
 */
export const UNAUTHORIZED = 401;

/**
 * @property NOT_FOUND (404)
 * @static
 * @final
 */
export const NOT_FOUND = 404;

/**
 * @property SERVER_ERROR (500)
 * @static
 * @final
 */
export const SERVER_ERROR = 500;
