import delegate from 'delegate';
import Category from '../category/category';

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
		this.onTabClick = this.onTabClick.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);

		this.bind();
	}

	bind() {
		delegate(this.refs.tabList, 'a', 'click', this.onTabClick);
		this.refs.btnAdd.addEventListener('click', this.onAddClick);
		this.refs.categories.forEach(cat => cat.el.addEventListener('titleChange', this.onCategoryChange))
	}

	onTabClick(event) {
		event.preventDefault();

		this.updateActive(Array.from(this.refs.tabList.children).indexOf(event.target));
	}

	onAddClick(event) {
		event.preventDefault();

		const newCat = new Category(undefined, this.props.settingName, this.refs.categories.length);
		newCat.el.addEventListener('titleChange', this.onCategoryChange);
		this.refs.panelList.insertAdjacentElement('beforeend', newCat.el)
		this.refs.categories.push(newCat);

		this.renderTabs();
		this.updateActive(this.refs.categories.length - 1);
	}

	onCategoryChange(event) {
		const catIdx = this.refs.categories.findIndex((cat) => cat.getId() === event.detail.id);
		this.refs.tabList.children[catIdx].textContent = event.detail.title === '' ? `Category ${catIdx + 1}` : event.detail.title;
	}

	updateActive(nextActive = 0) {
		this.refs.tabList.children[this.state.activeId].classList.remove('is-active');
		this.refs.categories[this.state.activeId].el.classList.remove('is-active');

		this.refs.tabList.children[nextActive].classList.add('is-active');
		this.refs.categories[nextActive].el.classList.add('is-active');

		this.state.activeId = nextActive;
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
