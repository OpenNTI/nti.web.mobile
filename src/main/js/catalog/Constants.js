const getConst = x => Symbol(x);

/**
 *
 * @event LOAD_CATALOG
 * @type String
 * @final
 */
export const LOAD_CATALOG = 'catalog:LOAD';


/**
 *
 * @event LOADED_CATALOG
 * @type String
 * @final
 */
export const LOADED_CATALOG = 'catalog:LOADED';

/**
*
* @event REDEEM_GIFT
* @type Symbol
* @final
*/
export const REDEEM_GIFT = getConst('gift:Redeem');

/**
*
* @event GIFT_CODE_REDEEMED
* @type Symbol
* @final
*/
export const GIFT_CODE_REDEEMED = getConst('gift:Code Redeemed');

/**
*
* @event INVALID_GIFT_CODE
* @type Symbol
* @final
*/
export const INVALID_GIFT_CODE = getConst('gift:Code Invalid');

