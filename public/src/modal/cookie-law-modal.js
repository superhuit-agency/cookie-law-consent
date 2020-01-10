/* eslint-disable curly */
/* eslint-disable operator-linebreak */

/**
 * External dependencies
 */
import { EventEmitter } from 'events';

/**
 * Internal dependencies
 */
import mergeDeep from '../utils/merge-deep';
import CookieLawCategory from '../category/cookie-law-category';
import DEFAULT_CONFIG from './default-config.json';

/**
 * Constants
 */

export default class CookieLawModal extends EventEmitter {
	constructor(container, config) {
		super();

		this.config = mergeDeep(DEFAULT_CONFIG, config, { container });

		this.refs = {
			el: null,
			list: null,
			categories: [],
			close: null,
			save: null,
		};

		this.state = new Proxy(
			{
				hidden: true,
			},
			{ set: this.stateChange.bind(this) }
		);

		this.onClose = this.onClose.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onLostFocus = this.onLostFocus.bind(this);

		this.init();
	}

	bindEvents() {
		document.addEventListener('focusin', this.onLostFocus);
		this.refs.save.addEventListener('click', this.onClose);
		this.refs.close.addEventListener('click', this.onClose);
		this.refs.categories.forEach((cat) => cat.on('change', this.onCategoryChange));
	}

	unbindEvents() {
		document.removeEventListener('focusin', this.onLostFocus);
		this.refs.save.removeEventListener('click', this.onClose);
		this.refs.close.removeEventListener('click', this.onClose);
		this.refs.categories.forEach((cat) => cat.off('change', this.onCategoryChange));
	}

	destroy() {
		if (! this.state.hidden) this.close();

		this.refs.categories.forEach((cat) => cat.destroy());
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
			case 'hidden':
				this.toggle();
				break;
		}

		return true;
	}

	onCategoryChange(event) {
		this.emit('categoryChange', event);
	}

	onSave(event) {
		event.stopPropagation();
		this.save();
	}

	onClose(event) {
		event.stopPropagation();
		this.close();
	}

	onLostFocus(event) {
		if (this.refs.el.contains(event.target)) return;
		this.refs.close.focus();
	}

	// ##############################
	// #endregion
	// ##############################

	// ##############################
	// #region LOGIC
	// ##############################

	open() {
		if (this.state.hidden === false) return;

		this.state.hidden = false;
		this.refs.close.focus();

		this.bindEvents();
	}

	save() {
		this.emit('save');
		this.close();
	}

	close() {
		if (this.state.hidden === true) return;

		this.state.hidden = true;
		this.unbindEvents();
		this.emit('closed');
	}

	setCategoryEnabled(category, enabled = false) {
		this.refs.categories.find((cat) => cat.getId() === category.id).setEnabled(enabled);
	}

	// ##############################
	// #endregion
	// ##############################

	// ##############################
	// #region DOM Manipulation
	// ##############################

	init() {
		this.refs.el = document.createElement('section');
		this.refs.el.classList.add('cookie-law-modal');
		this.refs.el.setAttribute('role', 'dialog');
		this.refs.el.setAttribute('aria-hidden', 'true');
		this.refs.el.setAttribute('tabindex', '-1');

		this.refs.el.insertAdjacentHTML('beforeend', (
			`<div class="cookie-law-modal__dialog" role="document" aria-labelledby="exampleModalCenterTitle">
				<div class="cookie-law-modal__content">
					<button class="cookie-law-modal__close">
						<svg viewBox="0 0 24 24">
							<title>${ this.config.texts.close }</title>
							<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</button>
					<div class="cookie-law-modal__body">
						<header class="cookie-law-modal__head">
							<h4 class="cookie-law-modal__title">${ this.config.texts.title }</h4>
							<p class="cookie-law-modal__desc">${ this.config.texts.description }</p>
						</header>
						<ul class="cookie-law-modal__categories"></ul>
						<footer class="cookie-law-modal__footer">
							<button class="cookie-law-modal__save">${ this.config.texts.save }</button>
						</footer>
					</div>
				</div>
			</div>`));

		this.refs.list = this.refs.el.querySelector('.cookie-law-modal__categories');
		this.refs.close = this.refs.el.querySelector('.cookie-law-modal__close');
		this.refs.save = this.refs.el.querySelector('.cookie-law-modal__save');

		// eslint-disable-next-line max-len
		this.refs.categories = this.config.categories.map((cat) => new CookieLawCategory(this.refs.list, cat));

		this.config.container.insertAdjacentElement('beforeend', this.refs.el);
	}

	toggle() {
		this.refs.el.setAttribute('aria-hidden', this.state.hidden);
	}

	// ##############################
	// #endregion
	// ##############################
}
