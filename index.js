import React from 'react';
import { Form, Skeleton, Tooltip } from 'antd';

const browser = typeof window !== 'undefined' ? true : false;

if (browser) require('./styles.css');

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
	toolTip = {},
	value = '',
	withLabel = false
}) => {
	const renderInput = () => {
		if (format.length !== 0) {
			const withCurrency = !!format.filter(d => d.type === 'currency').length;

			if (withCurrency) {
				const CurrencyInput = require('react-currency-input').default;
				const { decimalSeparator, prefix, sign, suffix, thousandSeparator } = format[0];

				const currencyInput = (
					<CurrencyInput
						className="ant-input"
						decimalSeparator={decimalSeparator}
						disabled={disabled}
						name={id}
						onBlur={onBlur}
						onChangeEvent={(e, maskedvalue, floatvalue) =>
							onChange({ target: { name: id, value: floatvalue } }, id, floatvalue)
						}
						onKeyPress={e => e.key === 'Enter' && onPressEnter(e)}
						placeholder={placeholder || label || id}
						prefix={prefix ? sign : ''}
						suffix={suffix ? sign : ''}
						thousandSeparator={thousandSeparator}
						value={value}
					/>
				);

				return Object.keys(toolTip).length === 0 ? (
					currencyInput
				) : (
					<Tooltip {...toolTip}>{currencyInput}</Tooltip>
				);
			}

			let blocks = format.map(d => parseInt(d.characterLength)),
				delimiters = format.map(d => d.delimiter);
			delimiters.pop();

			const Cleave = require('cleave.js/react');

			const cleave = (
				<Cleave
					autoComplete="off"
					className="ant-input"
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

			return Object.keys(toolTip).length === 0 ? cleave : <Tooltip {...toolTip}>{cleave}</Tooltip>;
		}

		const { InputNumber } = require('antd');

		const inputNumber = (
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
		return Object.keys(toolTip).length === 0 ? inputNumber : <Tooltip {...toolTip}>{inputNumber}</Tooltip>;
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

	return (
		<Form.Item {...formItemCommonProps}>
			{browser ? renderInput() : <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />}
		</Form.Item>
	);
};
