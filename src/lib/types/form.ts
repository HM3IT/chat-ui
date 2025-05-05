// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Validator = (val: string, params?: any) => string | null;
export type ListValidator = (val: string[], params?: any) => string | null;

export type InputEventType = Event & {
	currentTarget: EventTarget & HTMLInputElement;
};


export type InputFieldType = {
	label: string;
	required: boolean;
	type: 'text' | 'number' | 'date' | 'password';
	validators: Validator[];
	value: string;
	name: string;
};