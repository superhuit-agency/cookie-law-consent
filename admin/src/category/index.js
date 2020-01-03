import './_category.scss';

import unique from '../_common/unique';

export default class Category {

	constructor(element, settingName, idx = 0) {
		this.el = (typeof element === 'undefined') ? this.create(settingName, idx) : element;

		this.refs = {
			title: this.el.querySelector('.category__title'),
		};

		this.props = {
			settingName,
			id: this.el.getAttribute('id').match(/category_(.*)/)[1],
			idx: parseInt(this.el.dataset.idx),
		};

		this.state = {
			title: this.refs.title.value,
		};

		this.onTitleChange = this.onTitleChange.bind(this);

		this.bind();
	}

	bind() {
		this.refs.title.addEventListener('keyup', this.onTitleChange);
	}

	onTitleChange(event) {
		this.state.title = event.target.value;
		this.el.dispatchEvent(new CustomEvent('titleChange', {detail: {
			id: this.props.id,
			title: this.state.title,
		}}));
	}

	getId() {
		return this.props.id;
	}
	getTitle() {
		return this.state.title;
	}

	create(settingName, idx) {
		const id = unique();
		const el = document.createElement('div');
		el.classList.add('category');
		el.setAttribute('id', `category_${id}`);
		el.dataset.idx = idx;

		el.insertAdjacentHTML('beforeend',
			`<input name="${settingName}[categories][${idx}][id]" type="text" value="cat-${id}"/>` +
			`<input name="${settingName}[categories][${idx}][position]" type="number" value="${idx + 1}"/>` +
			'<table class="form-table">' +
				'<tr class="row">' +
					`<th><label for="cat-mandatory_${id}">Mandatory ?</label></th>` +
					'<td>' +
						'<div class="switch">' +
							`<input id="cat-mandatory_${id}" name="${settingName}[categories][${idx}][mandatory]" type="checkbox" class="switch__chk"/>` +
							`<label for="cat-mandatory_${id}" class="switch__label">mandatory ?</label>` +
						'</div>' +
					'</td>' +
				'</tr>' +
				'<tr class="row">' +
					`<th><label for="cat-title_${id}">Title</label></th>` +
					'<td>' +
						`<input id="cat-title_${id}" name="${settingName}[categories][${idx}][title]" type="text" class="category__title"/>` +
					'</td>' +
				'</tr>' +
				'<tr class="row">' +
					`<th><label for="cat-description_${id}">Description</label></th>` +
					'<td>' +
						`<textarea id="cat-description_${id}" name="${settingName}[categories][${idx}][description]" ></textarea>` +
					'</td>' +
				'</tr>' +
				'<tr class="row">' +
					'<th><h3>Custom Texts</h3></th>' +
				'</tr>' +
				'<tr>' +
					`<th><label for="texts-enable_${id}">Enable</label></th>` +
					'<td>' +
						`<input id="texts-enable_${id}" type="text" name="${settingName}[categories][${idx}][texts][enable]" placeholder="Enable cookies" />` +
					'</td>' +
					`<th><label for="texts-enabled_${id}">Enabled</label></th>` +
					'<td>' +
						`<input id="texts-enabled_${id}" type="text" name="${settingName}[categories][${idx}][texts][enabled]" placeholder="Enabled" />` +
					'</td>' +
				'</tr>' +
				'<tr>' +
					`<th><label for="texts-disable_${id}">Disable</label></th>` +
					'<td>' +
						`<input id="texts-disable_${id}" type="text" name="${settingName}[categories][${idx}][texts][disable]" placeholder="Disable cookies" />` +
					'</td>' +
					`<th><label for="texts-disabled_${id}">Disabled</label></th>` +
					'<td>' +
						`<input id="texts-disabled_${id}" type="text" name="${settingName}[categories][${idx}][texts][disabled]" placeholder="Disabled" />` +
					'</td>' +
				'</tr>' +
				'<tr>' +
					`<th><label for="texts-alwaysEnabled_${id}">Always Enabled <br><small><em>Mandatory category</em></small></label></th>` +
					'<td>' +
						`<input id="texts-alwaysEnabled_${id}" type="text" name="${settingName}[categories][${idx}][texts][alwaysEnabled]" placeholder="Always enabled" />` +
					'</td>' +
				'</tr>' +
			'</table>'
		);

		return el;
	}

	insert(container) {


	}
}
