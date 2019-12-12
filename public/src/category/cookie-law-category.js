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
import DEFAULT_CONFIG from './default-config.json';

/**
 * Constants
 */
const SELECTOR_TAB = '.cookie-law-category__tab';
const SELECTOR_TITLE = '.cookie-law-category__title';
const SELECTOR_SWITCH = '.cookie-law-category__switch';
const SELECTOR_CHECKBOX = '.cookie-law-category__checkbox';
const SELECTOR_LABEL = '.cookie-law-category__label';
const SELECTOR_STATUS = '.cookie-law-category__status';
const SELECTOR_CONTENT = '.cookie-law-category__content';
const SELECTOR_DESC = '.cookie-law-category__desc';

const CLASS_IS_EXPANDED = 'is-expanded';

export default class CookieLawCategory extends EventEmitter {
	constructor(container, config) {
		super();

		this.config = mergeDeep(DEFAULT_CONFIG, config, { container });

		this.state = new Proxy(
			{
				collapsed: true,
				enabled: this.config.enabled,
			},
			{ set: this.stateChange.bind(this) }
		);

		const el = this.init();
		this.refs = {
			el,
			tab: el.querySelector(SELECTOR_TAB),
			title: el.querySelector(SELECTOR_TITLE),
			switch: el.querySelector(SELECTOR_SWITCH),
			checkbox: el.querySelector(SELECTOR_CHECKBOX),
			label: el.querySelector(SELECTOR_LABEL),
			status: el.querySelector(SELECTOR_STATUS),
			content: el.querySelector(SELECTOR_CONTENT),
			desc: el.querySelector(SELECTOR_DESC),
		};

		this.onChange = this.onChange.bind(this);
		this.onToggle = this.onToggle.bind(this);
		this.stopPropagation = this.stopPropagation.bind(this);

		this.refs.tab.addEventListener('click', this.onToggle);
		if (this.refs.checkbox) this.refs.checkbox.addEventListener('change', this.onChange);
		if (this.refs.switch) this.refs.switch.addEventListener('click', this.stopPropagation);
	}

	destroy() {
		this.refs.tab.removeEventListener('click', this.onToggle);
		if (this.refs.checkbox) this.refs.checkbox.removeEventListener('change', this.onChange);
		if (this.refs.switch) this.refs.switch.removeEventListener('click', this.stopPropagation);
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
			case 'collapsed':
				this.toggleExpanded();
				break;
			case 'enabled':
				this.toggleStatus();
				this.emit('change', { enabled: value, name: this.config.name });
				break;
		}

		return true;
	}

	onToggle(event) {
		event.stopPropagation();
		this.state.collapsed = ! this.state.collapsed;
	}

	onChange(event) {
		event.stopPropagation();
		this.state.enabled = event.target.checked;
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	// ##############################
	// #endregion
	// ##############################

	// ##############################
	// #region Event handler
	// ##############################

	getName() {
		return this.config.name;
	}

	setEnabled(enabled = false) {
		if (this.config.mandatory) return;
		this.state.enabled = enabled;
	}

	// ##############################
	// #endregion
	// ##############################

	init() {
		const el = document.createElement('li');
		el.classList.add('cookie-law-category');

		el.insertAdjacentHTML('beforeend', (
			`<div class="cookie-law-category__tab">
				<button class="cookie-law-category__title">
					<span>${ this.config.title }</span>
				</button>
				${ this.config.mandatory
				? (`<span class="cookie-law-category__caption">${ this.config.texts.alwaysEnabled }</span>`)
				: (
					`<div class="cookie-law-category__switch">
						<input
							type="checkbox"
							class="cookie-law-category__checkbox"
							id="cookie-law-category-checkbox-${ this.config.name }"
							${ (this.state.enabled ? 'checked' : '') }
						>
						<label class="cookie-law-category__label" for="cookie-law-category-checkbox-${ this.config.name }">
							${ this.config.texts[ this.state.enabled ? 'disable' : 'enable' ] }
						</label>
						<span class="cookie-law-category__status">
							${ this.config.texts[ this.state.enabled ? 'enabled' : 'disabled' ] }
						</span>
					</div>`) }
			</div>
			<div class="cookie-law-category__content" aria-hidden="${ this.state.collapsed }">
				<div class="cookie-law-category__desc">${ this.config.description }</div>
			</div>`));

		this.config.container.insertAdjacentElement('beforeend', el);

		return el;
	}

	toggleExpanded() {
		this.refs.content.setAttribute('aria-hidden', this.state.collapsed);
		this.refs.el.classList[ this.state.collapsed ? 'remove' : 'add' ](CLASS_IS_EXPANDED);
	}

	toggleStatus() {
		if (this.refs.label) this.refs.label.textContent = this.config.texts[ this.state.enabled ? 'disable' : 'enable' ];
		if (this.refs.status) this.refs.status.textContent = this.config.texts[ this.state.enabled ? 'enabled' : 'disabled' ];

		if (this.refs.checkbox && (this.state.enabled !== this.refs.checkbox.checked)) {
			this.refs.checkbox.checked = this.state.enabled;
		}
	}
}
