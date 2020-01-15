/* eslint-disable curly */

/**
 * Internal dependencies
 */
import mergeDeep from './utils/merge-deep';
import { getCookie, setCookie } from './utils/cookie';
import CookieLawModal from './modal/cookie-law-modal';
import CookieLawBanner from './banner/cookie-law-banner';
import services from './services/index';
import DEFAULT_CONFIG from './default-config.json';

/**
 * Constants
 */
const ACCEPTED_VALUE = 'yes';
const REFUSED_VALUE = 'no';

export default class CookieLaw {
	constructor(config) {
		this.config = mergeDeep(DEFAULT_CONFIG, config);

		this.state = new Proxy(
			{
				bannerDismissed: true,
				loadedServices: [],
			},
			{ set: this.stateChange.bind(this) }
		);

		this.refs = this.initRefs();

		// force the state change
		this.state.bannerDismissed = (getCookie(`${ this.config.cookieName }_banner`) === 'dismiss');

		this.bindEvents();
	}

	bindEvents() {
		this.acceptAll = this.acceptAll.bind(this);
		this.onHashChange = this.onHashChange.bind(this);
		this.onModalClosed = this.onModalClosed.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onPersonalizeClick = this.onPersonalizeClick.bind(this);

		this.refs.banner.on('acceptAll', this.acceptAll);
		this.refs.banner.on('personalize', this.onPersonalizeClick);
		this.refs.modal.on('categoryChange', this.onCategoryChange);
		this.refs.modal.on('closed', this.onModalClosed);
		window.addEventListener('hashchange', this.onHashChange);
	}

	destroy() {
		this.refs.banner.off('acceptAll', this.acceptAll);
		this.refs.banner.off('persoffalize', this.refs.modal.open);
		this.refs.modal.on('categoryChange', this.onCategoryChange);
		this.refs.modal.off('closed', this.onModalClosed);
		window.removeEventListener('hashchange', this.onHashChange);

		this.refs.banner.destroy();
		this.refs.modal.destroy();
	}

	// ##############################
	// #region Event handler
	// ##############################

	/**
	 * Trap handler for the state object
	 *
	 * @param {Object} state Current state object
	 * @param {string} property The name of the property to set in the state
	 * @param {*} value The new value of the property to set
	 *
	 * @return {boolean} Indicate wether or not the assignment succeeded
	 */
	stateChange(state, property, value) {
		// eslint-disable-next-line no-param-reassign
		state[ property ] = value; // Update the state

		// eslint-disable-next-line default-case
		switch (property) {
			case 'bannerDismissed':
				this.refs.banner[ value ? 'hide' : 'show' ]();
				setCookie(`${ this.config.cookieName }_banner`, 'dismiss', value ? null : 0);
				break;
		}

		return true;
	}

	onPersonalizeClick() {
		this.refs.modal.open();
	}

	onHashChange(event) {
		if (event.newURL.indexOf(`#${ this.config.hash }`) === -1) return;

		this.refs.modal.open();
		window.history.replaceState('', 'Cookie Manager', window.location.pathname + window.location.search);
	}

	onModalClosed() {
		if (window.location.hash.indexOf(`#${ this.config.hash }`) === -1) return;

		window.history.replaceState('', document.title, window.location.pathname + window.location.search);
	}

	onCategoryChange(event) {
		const changedCat = this.config.categories.find((cat) => cat.id === event.id);
		this.setCategoryCookie(changedCat, event.enabled);
	}

	// ##############################
	// #endregion
	// ##############################

	// ##############################
	// #region LOGIC
	// ##############################

	acceptAll() {
		this.state.bannerDismissed = true;
		this.config.categories.forEach((cat) => {
			this.setCategoryCookie(cat, true);
			this.refs.modal.setCategoryEnabled(cat, true);
		});
	}

	setCategoryCookie(category, accepted = false) {
		// No need to set mandatory categories
		// as we cannot choose
		if (category.mandatory) return;

		setCookie(`${ this.config.cookieName }_${ category.id }_accepted`, accepted ? ACCEPTED_VALUE : REFUSED_VALUE);
		if (accepted && category.services) {
			category.services.forEach(({ name, ...data }) => {
				this.loadService(name, data);
			});
		}
	}

	getCategoriesSettings() {
		return this.config.categories.map((cat) => {
			const cookie = getCookie(`${ this.config.cookieName }_${ cat.id }_accepted`);
			const enabled = (cookie === ACCEPTED_VALUE);

			if (enabled && cat.services) {
				cat.services.forEach(({name, ...data}) => {
					this.loadService(name, data);
				});
			}

			return { ...cat, enabled };
		});
	}

	loadService(name, data) {
		if (typeof services[ name ] === 'undefined') return;
		if (typeof this.state.loadedServices.find((serv) => serv.name === name) !== 'undefined') return;

		const { url, callback } = services[ name ](data);

		this.state.loadedServices.push({
			name,
			script: this.addScript(url, callback),
		});
	}

	addScript(url, callback) {
		let done = false;

		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = url;

		if (typeof callback === 'function') {
			const loadedCB = () => {
				const state = script.readyState;
				if (! done && (! state || /loaded|complete/.test(state))) {
					done = true;
					callback();
				}
			};

			script.onreadystatechange = loadedCB;
			script.onload = loadedCB;
		}

		document.head.appendChild(script);

		return script;
	}

	// ##############################
	// #endregion
	// ##############################

	// ##############################
	// #region DOM Manipulations
	// ##############################

	initRefs() {
		if (typeof this.refs !== 'undefined') return this.refs;

		const el = document.createElement('div');
		el.classList.add('cookie-law');
		document.body.insertAdjacentElement('afterbegin', el);

		const banner = new CookieLawBanner(el, { position: this.config.banner_position, texts: this.config.texts.banner });

		const modal = new CookieLawModal(el, {
			categories: this.getCategoriesSettings(),
			texts: this.config.texts.modal,
		});

		return { el, banner, modal };
	}

	// ##############################
	// #endregion
	// ##############################
}
