import Cleave from 'cleave.js/react';
import React, { Component } from 'react';
import InputDate from '@volenday/input-date';
import validate from 'validate.js';
import { Button, Form, InputNumber, Popover } from 'antd';

import './styles.css';

export default class InputNumber2 extends Component {
	state = { errors: [], hasChange: false, isPopoverVisible: false };

	onChange = async value => {
		const { action, id, onChange, onValidate } = this.props;

		onChange(id, value);
		const errors = this.validate(value);
		await this.setState({ errors, hasChange: action === 'add' ? false : true });
		if (onValidate) onValidate(id, errors);
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

	handlePopoverVisible = visible => {
		this.setState({ isPopoverVisible: visible });
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
					onChange={e => this.onChange(e.target.rawValue)}
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
				onChange={e => this.onChange(e.toString())}
				onPressEnter={onPressEnter}
				placeholder={placeholder || label || id}
				style={{ width: '100%', ...styles }}
				value={value}
			/>
		);
	}

	renderPopover = () => {
		const { isPopoverVisible } = this.state;
		const { id, label = '', historyTrackValue = '', onHistoryTrackChange } = this.props;

		return (
			<Popover
				content={
					<InputDate
						id={id}
						label={label}
						required={true}
						withTime={true}
						withLabel={true}
						value={historyTrackValue}
						onChange={onHistoryTrackChange}
					/>
				}
				trigger="click"
				title="History Track"
				visible={isPopoverVisible}
				onVisibleChange={this.handlePopoverVisible}>
				<span class="float-right">
					<Button
						type="link"
						shape="circle-outline"
						icon="warning"
						size="small"
						style={{ color: '#ffc107' }}
					/>
				</span>
			</Popover>
		);
	};

	render() {
		const { errors, hasChange } = this.state;
		const { action, label = '', required = false, withLabel = false, historyTrack = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			help: errors.length != 0 ? errors[0] : '',
			label: withLabel ? label : false,
			required,
			validateStatus: errors.length != 0 ? 'error' : 'success'
		};

		return (
			<Form.Item {...formItemCommonProps}>
				{historyTrack && hasChange && action !== 'add' && this.renderPopover()}
				{this.renderInput()}
			</Form.Item>
		);
	}
}
