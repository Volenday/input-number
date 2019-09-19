import Cleave from 'cleave.js/react';
import React, { Component } from 'react';
import validate from 'validate.js';
import { Form, InputNumber } from 'antd';

import './styles.css';

export default class InputNumber2 extends Component {
	state = { errors: [] };

	onChangeTimeout = null;
	onChange = async (e, value) => {
		const { id, onChange, onValidate } = this.props;

		onChange(e, id, value);

		this.onChangeTimeout && clearTimeout(this.onChangeTimeout);
		this.onChangeTimeout = setTimeout(async () => {
			const errors = this.validate(value);
			await this.setState({ errors });
			if (onValidate) onValidate(id, errors);
		}, 500);
	};

	validate = value => {
		const { id, maximum, minimum, required = false } = this.props;

		const constraints = {
			[id]: {
				numericality: {
					onlyInteger: true,
					greaterThanOrEqualTo: parseInt(minimum),
					lessThanOrEqualTo: parseInt(maximum)
				},
				presence: { allowEmpty: !required }
			}
		};

		const errors = validate({ [id]: value }, constraints);
		return validate.isEmpty(value) && !required ? [] : errors ? errors[id] : [];
	};

	renderInput() {
		const {
			disabled = false,
			format = [],
			id,
			label = '',
			onBlur = () => {},
			onPressEnter = () => {},
			placeholder = '',
			styles = {},
			value = ''
		} = this.props;

		if (format.length != 0) {
			let blocks = format.map(d => parseInt(d.characterLength)),
				delimiters = format.map(d => d.delimiter);
			delimiters.pop();
			return (
				<Cleave
					autoComplete="off"
					class="ant-input"
					disabled={disabled}
					name={id}
					options={{ delimiters, blocks, numericOnly: true }}
					onBlur={onBlur}
					onChange={e => this.onChange(e, e.target.rawValue)}
					onKeyPress={e => {
						if (e.key === 'Enter') {
							onPressEnter(e);
						}
					}}
					placeholder={placeholder || label || id}
					style={styles}
					value={value}
				/>
			);
		}

		return (
			<InputNumber
				allowClear
				autoComplete="off"
				disabled={disabled}
				name={id}
				onBlur={onBlur}
				onChange={e => this.onChange({ target: { name: id, value: e.toString() } }, e.toString())}
				onPressEnter={onPressEnter}
				placeholder={placeholder || label || id}
				style={{ width: '100%', ...styles }}
				value={value}
			/>
		);
	}

	render() {
		const { errors } = this.state;
		const { label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			help: errors.length != 0 ? errors[0] : '',
			label: withLabel ? label : false,
			required,
			validateStatus: errors.length != 0 ? 'error' : 'success'
		};

		return <Form.Item {...formItemCommonProps}>{this.renderInput()}</Form.Item>;
	}
}
