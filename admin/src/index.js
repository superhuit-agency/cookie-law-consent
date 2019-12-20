import './styles.scss';

import Categories from './categories/categories';

const categoriesEl = document.querySelector('.categories');
if ( categoriesEl ) new Categories(categoriesEl);
