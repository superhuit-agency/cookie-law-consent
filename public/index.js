import CookieLaw from './src/cookie-law';

const config = ( typeof clc_config === 'undefined' ) ? {} : JSON.parse(clc_config);

new CookieLaw(config);
