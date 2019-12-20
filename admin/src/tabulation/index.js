import './_tabulation.scss';

import delegate from 'delegate';

export default class Tabulation {
	constructor(element) {
		this.el = element;

		this.refs = {
			tabList: this.el.querySelector('[tab-list]'),
			panelList: this.el.querySelector('[panel-list]'),
		};

		this.state = {
			activeTab: 0,
		};

		this.bind();
	}

	bind() {
		delegate( this.refs.tabList, 'a', 'click', this.onTabClick.bind(this) );
	}

	onTabClick(event) {
		event.preventDefault();

		this.updateActive(Array.from(this.refs.tabList.children).indexOf(event.target));
	}

	updateActive(nextActive = 0) {
		this.refs.tabList.children[this.state.activeTab].classList.remove('is-active');
		this.refs.panelList.children[this.state.activeTab].classList.remove('is-active');

		this.refs.tabList.children[nextActive].classList.add('is-active');
		this.refs.panelList.children[nextActive].classList.add('is-active');

		this.state.activeTab = nextActive;
	}
}
