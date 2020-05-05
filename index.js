import React from 'react';
import { Form } from 'antd';

import './styles.css';

export default ({
	disabled = false,
	error = null,
	extra = null,
	format = [],
	id,
	label = '',
	onBlur = () => {},
	onChange,
	onPressEnter = () => {},
	placeholder = '',
	required = false,
	styles = {},
	value = '',
	withLabel = false
}) => {
	const renderInput = () => {
		if (format.length !== 0) {
			const Cleave = require('cleave.js/react');

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
					onChange={e => onChange({ target: { name: id, value: e.target.rawValue } }, id, e.target.rawValue)}
					onKeyPress={e => {
						if (e.key === 'Enter') onPressEnter(e);
					}}
					placeholder={placeholder || label || id}
					style={styles}
					value={value}
				/>
			);
		}

		const { InputNumber } = require('antd');

		return (
			<InputNumber
				autoComplete="off"
				disabled={disabled}
				name={id}
				onBlur={onBlur}
				onChange={e => onChange({ target: { name: id, value: e.toString() } }, id, e.toString())}
				onPressEnter={onPressEnter}
				placeholder={placeholder || label || id}
				style={{ width: '100%', ...styles }}
				value={value}
			/>
		);
	};

	const formItemCommonProps = {
		colon: false,
		help: error ? error : '',
		label: withLabel ? (
			<>
				<div style={{ float: 'right' }}>{extra}</div> <span class="label">{label}</span>
			</>
		) : (
			false
		),
		required,
		validateStatus: error ? 'error' : 'success'
	};

	return <Form.Item {...formItemCommonProps}>{renderInput()}</Form.Item>;
};
