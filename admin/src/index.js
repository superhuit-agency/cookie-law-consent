import './switch';
import Tabulation from './tabulation';
import Categories from './categories';
import Services from './services';

const categoriesEl = document.querySelector('.categories');
if ( categoriesEl ) new Categories(categoriesEl);

const tabEls = Array.from(document.querySelectorAll('[tabulation]'));
if ( tabEls ) tabEls.forEach(el => new Tabulation(el));

const ServicesEl = document.querySelector('.services');
if ( ServicesEl ) new Services(ServicesEl);
