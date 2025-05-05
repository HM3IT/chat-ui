<script lang="ts">
	import  type { InputFieldType } from '$lib/types/form';
	
	import { login } from '$lib/api/auth';
	import { errorStore } from '$lib/store/errorStore';
	import { userRole } from '$lib/types/user';
	import { emailValidator, requiredValidator, validateFields } from '$lib/utils/validators';
	import { invalidate } from '$app/navigation';

	import PrimaryBtn from '$lib/components/ui/PrimaryBtn.svelte';
	import Form from '$lib/components/form/Form.svelte';

	let isLoading = false;
	let fields: InputFieldType[] = [
		{
			label: 'Email Address',
			required: true,
			type: 'text',
			validators: [requiredValidator, emailValidator],
			value: '',
			name: 'email'
		},
		{
			label: 'Password',
			required: true,
			type: 'password',
			validators: [requiredValidator],
			value: '',
			name: 'password'
		}
	];

	async function submitHandler() {
		const result = validateFields(fields);
		if (!result) {
			errorStore.showError();
			return;
		}
		try {
			isLoading = true;
			const {
				data: { access_token, refresh_token, roles, username, email, id }
			} = await login(result.email, result.password, userRole.STANDARD_USER);
			localStorage.setItem('accessToken', access_token);
			localStorage.setItem('refreshToken', refresh_token);
			localStorage.setItem('role', roles[0]);

			await invalidate('app:auth');
			isLoading = false;
		} catch (e) {
			isLoading = false;
		}
	}
</script>

<div class="flex-grow grid place-items-center">
	<div class="w-full max-w-md space-y-2">
		<div class="bg-neutral-100 w-full py-6 px-4 rounded-lg">
			<h1 class="font-semibold text-2xl mb-4">Sign In</h1>
			<Form innerClass="space-y-4" bind:fields on:submit={submitHandler}>
				<PrimaryBtn type="submit" loading={isLoading} style="w-full mt-4">Submit</PrimaryBtn>
			</Form>
			<button class="text-sm underline hover:no-underline mt-4">Forgot Username or Password?</button
			>
		</div>
		<div class="font-semibold text-center">or</div>
		<PrimaryBtn href="/signup" variant="neutral" style="w-full">Create an Account</PrimaryBtn>
	</div>
</div>
