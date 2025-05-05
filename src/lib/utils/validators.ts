import type { Validator } from '$lib/types/form';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const validateFields = (
	fields: { value: string; validators: Validator[]; required: boolean; name: string }[]
) => {
	let valid = true;
	for (const field of fields) {
		if (field.required && !field.value) {
			valid = false;
			break;
		}
		if (
			field.validators
				.map((v) => v(field.value))
				.filter((v) => !!v)
				.join('')
		) {
			valid = false;
			break;
		}
	}
	if (valid) {
		const result: { [key: string]: string } = {};
		fields.forEach((field) => (result[field.name] = field.value));
		return result;
	}
	return false;
};

export function emailValidator(val: string) {
	if (!val) return null;
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (re.test(val)) {
		return null;
	}
	return 'Invalid Email';
}

export function requiredValidator(val: string) {
	if (val === null || val === undefined) return 'This field is required';
	val = val.toString();
	if (!val) {
		return 'This field is required';
	}
	return null;
}

export function listRequesterValidator(val: string[]) {
	if (val.length === 0) {
		return 'This field is required';
	}
	return null;
}

export function passwordMatchValidator(val1: string) {
	return (val2: string) => {
		if (val1 !== val2) {
			return 'Passwords do not match';
		}
		return null;
	};
}

export function minLengthValidator(min: number) {
	return (val: string) => {
		if (!val) return null;
		if (val.length < min) {
			return `Must be at least ${min} characters`;
		}
		return null;
	};
}

export function maxLengthValidator(max: number) {
	return (val: string) => {
		if (!val) return null;
		if (val.length > max) {
			return `Must be less than ${max} characters`;
		}
		return null;
	};
}

export function regexValidator(regex: RegExp, message: string = 'Invalid value') {
	return (val: string) => {
		if (!val) return null;
		if (!regex.test(val)) {
			return message;
		}
		return null;
	};
}

export function phoneNumberValidator(val: string) {
	if (!val) return null;
	if (isValidPhoneNumber(val, 'US')) {
		return null;
	}
	return 'Invalid Phone Number';
}

export function faxNumberValidator(val: string) {
	if (!val) return null;
	if (isValidPhoneNumber(val, 'US')) {
		return null;
	}
	return 'Invalid Fax Number';
}

export function annualReportNumberValidator(
	integer: boolean,
	min: number | null = null,
	max: number | null = null
) {
	return (val: string) => {
		if (!val) return null;
		// const numberRegex = integer ? /^-?\d+$/ : /^-?\d+(\.\d+)?$/;
		const numberRegex = integer ? /^(0|-?[1-9]\d*)$/ : /^(0|-?[1-9]\d*)(\.\d+)?$/;
		if (numberRegex.test(val)) {
			if (min === null && max === null) {
				return null;
			} else if (min !== null) {
				return parseFloat(val) >= min ? null : `Min value: ${min}`;
			} else if (max !== null) {
				return parseFloat(val) <= max ? null : `Max value: ${max}`;
			} else {
				return null;
			}
		} else {
			return `Not a valid ${integer ? 'integer' : 'number'}`;
		}
	};
}

export function validateObject(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	obj: { [key: string]: any },
	validators: { [key: string]: Validator[] }
): boolean {
	let valid = true;
	Object.keys(validators).forEach((k) => {
		if (
			validators[k]
				.map((v) => {
					return v(obj[k]);
				})
				.filter((v) => !!v).length
		) {
			valid = false;
		}
	});
	return valid;
}

export function equalValidator(value: string) {
	return (v: string) => {
		if (v === value) {
			return null;
		}
		return `Must be equal to ${value}`;
	};
}
