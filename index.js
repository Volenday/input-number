import Cleave from 'cleave.js/react';
import React, { Component } from 'react';
import { Form, InputNumber } from 'antd';

import './styles.css';

export default class InputNumber2 extends Component {
	state = { errors: [] };

	onChange = async (e, value) => {
		const { id, onChange } = this.props;
		onChange(e, id, value);
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
					onChange={e => this.onChange({ target: { name: id, value: e.target.rawValue } }, e.target.rawValue)}
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
		const { error = null, label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			help: error ? error : '',
			label: withLabel ? label : false,
			required,
			validateStatus: error ? 'error' : 'success'
		};

		return <Form.Item {...formItemCommonProps}>{this.renderInput()}</Form.Item>;
	}
}
