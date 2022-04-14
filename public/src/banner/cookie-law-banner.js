/**
 * External dependencies
 */
import { EventEmitter } from 'events';

/**
 * Internal dependencies
 */
import mergeDeep from '../utils/merge-deep';
import DEFAULT_CONFIG from './default-config.json';

/**
 * Constants
 */
const SELECTOR_ACCEPT = '.cookie-law-banner__accept';
const SELECTOR_PERSONALIZE = '.cookie-law-banner__personalize';

export default class CookieLawBanner extends EventEmitter {
	constructor(container, config) {
		super();

		this.config = mergeDeep(DEFAULT_CONFIG, config, { container });

		this.state = new Proxy(
			{ hidden: true },
			{ set: this.stateChange.bind(this) }
		);

		const el = this.init();
		this.refs = {
			el,
			personalize: el.querySelector(SELECTOR_PERSONALIZE),
			accept: el.querySelector(SELECTOR_ACCEPT),
		};

		this.onPersonalizeClick = this.onPersonalizeClick.bind(this);
		this.onAcceptClick = this.onAcceptClick.bind(this);

		this.bindEvents();
	}

	bindEvents() {
		this.refs.personalize.addEventListener('click', this.onPersonalizeClick);
		this.refs.accept.addEventListener('click', this.onAcceptClick);
	}

	destroy() {
		this.refs.personalize.removeEventListener('click', this.onPersonalizeClick);
		this.refs.accept.removeEventListener('click', this.onAcceptClick);
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

	onPersonalizeClick(event) {
		event.stopPropagation();
		this.emit('personalize');
	}

	onAcceptClick(event) {
		event.stopPropagation();
		this.emit('acceptAll');
		this.hide();
	}

	// ##############################
	// #endregion
	// ##############################

	// ##############################
	// #region LOGIC
	// ##############################

	show() {
		this.state.hidden = false;
	}

	hide() {
		this.state.hidden = true;
	}

	// ##############################
	// #endregion
	// ##############################

	init() {
		const el = document.createElement('div');
		el.classList.add('cookie-law-banner');
		el.classList.add(`cookie-law-banner--${this.config.position}`);
		el.setAttribute('role', 'dialog');
		el.setAttribute('aria-live', 'polite');
		el.setAttribute('aria-hidden', 'true');
		el.setAttribute('aria-label', 'cookie-law-banner:title');
		el.setAttribute('aria-describedby', 'cookie-law-banner:desc');

		el.insertAdjacentHTML('beforeend', (
			`<h5 id="cookie-law-banner:title" class="cookie-law-banner__title">${ this.config.texts.title }</h5>
			<div id="cookie-law-banner:desc" class="cookie-law-banner__message">${ this.config.texts.message }</div>
			<div class="cookie-law-banner__personalize-cell">
				<button class="cookie-law-banner__personalize">${ this.config.texts.personalize }</button>
			</div>
			<div class="cookie-law-banner__accept-cell">
				<button class="cookie-law-banner__accept">${ this.config.texts.acceptAll }</button>
			</div>`
		));

		this.config.container.insertAdjacentElement('beforeend', el);

		return el;
	}

	toggle() {
		this.refs.el.setAttribute('aria-hidden', this.state.hidden);
	}
}
