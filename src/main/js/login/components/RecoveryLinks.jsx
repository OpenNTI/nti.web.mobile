import React from 'react';
import {scoped} from 'common/locale';
import {Link} from 'react-router-component';

let t = scoped('LOGIN');

export default React.createClass({
	displayName: 'RecoveryLinks',

	render () {

		let cssClasses = 'tiny button small-12 columns';

		return (
			<div>
				<Link id="login:forgot:username" className={cssClasses} href="/forgot/username">{t('forgot.username')}</Link>
				<Link id="login:forgot:password" className={cssClasses} href="/forgot/password">{t('forgot.password')}</Link>
			</div>
		);
	}

});
