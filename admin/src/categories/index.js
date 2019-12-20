import './_categories.scss';

import Category from '../category';

export default class Categories {

	constructor(element) {
		this.el = element;

		this.props = {
			settingName: this.el.dataset.settingName,
		};

		this.refs = {
			tabList: this.el.querySelector('.categories__tab-list'),
			btnAdd: this.el.querySelector('.categories__add'),

			panelList: this.el.querySelector('.categories__panel-list'),

			categories: Array.from(this.el.querySelectorAll('.category')).map((cat) => new Category(cat, this.props.settingName)),
		};

		this.state = {
			activeId: 0,
		}

		this.renderTabs();

		this.onAddClick = this.onAddClick.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);

		this.bind();
	}

	bind() {
		this.refs.btnAdd.addEventListener('click', this.onAddClick);
		this.refs.categories.forEach(cat => cat.el.addEventListener('titleChange', this.onCategoryChange))
	}


	onAddClick(event) {
		event.preventDefault();

		const newCat = new Category(undefined, this.props.settingName, this.refs.categories.length);
		newCat.el.addEventListener('titleChange', this.onCategoryChange);
		this.refs.panelList.insertAdjacentElement('beforeend', newCat.el)
		this.refs.categories.push(newCat);

		this.renderTabs();
		this.refs.tabList.children[this.refs.categories.length - 1].click();
	}

	onCategoryChange(event) {
		const catIdx = this.refs.categories.findIndex((cat) => cat.getId() === event.detail.id);
		this.refs.tabList.children[catIdx].textContent = event.detail.title === '' ? `Category ${catIdx + 1}` : event.detail.title;
	}

	renderTabs() {
		while (this.refs.tabList.lastChild) {
			this.refs.tabList.removeChild(this.refs.tabList.lastChild);
		}

		this.refs.categories.forEach((cat, id) => {
			const title = cat.getTitle();

			this.refs.tabList.insertAdjacentHTML('beforeend',
				`<a href="#category_${cat.getId()}" class="categories__tab${ this.state.activeId === id ? ' is-active' : ''}">${ title === '' ? `Category ${id + 1}` : title }</a>`
			);
		});
	}
}
