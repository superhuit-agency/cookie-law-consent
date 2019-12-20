import './_services.scss';


export default class Services {
	constructor(element) {
		this.el = element;

		this.refs = {
			services: Array.from(this.el.querySelectorAll('.service')).map((el) => new Service(el)),
		};
	}
}

class Service {
	constructor(element) {
		this.el = element;

		this.props = {

		};

		this.refs = {
			enable: this.el.querySelector('.service__row-enable input'),
			rows: Array.from(this.el.querySelectorAll('.service__row-enable ~ tr')),
			fields: Array.from(this.el.querySelectorAll('.service__row-enable ~ tr input[type="text"], .service__row-enable ~ tr select')),
		};

		this.bind()
		this.updateFields();
	}

	bind() {
		this.updateFields = this.updateFields.bind(this);

		this.refs.enable.addEventListener('change', this.updateFields);
	}

	updateFields() {

		if (this.refs.enable.checked ) {
			this.refs.rows.forEach(row => row.style.display = 'table-row');
			this.refs.fields.forEach(field => field.setAttribute('required', true));
		}
		else {
			this.refs.rows.forEach(row => row.style.display = 'none');
			this.refs.fields.forEach(field => field.removeAttribute('required'));
		}
	}
}
