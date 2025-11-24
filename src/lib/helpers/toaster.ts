import { toaster } from '$lib/stores/toaster';
import type { ErrorToast, Toast } from '$lib/types/toaster';
import { getErrorMessage } from './errors';

function showSuccessToast(data: Toast) {
	toaster.success({
		title: data.title,
		description: data.description
	});
}

function showErrorToast(data: ErrorToast) {
	toaster.error({
		title: data.title ?? 'common.error',
		description: data.description ?? getErrorMessage(data.error)
	});
	throw data.error;
}

function showInfoToast(data: Toast) {
	toaster.info({
		title: data.title,
		description: data.description
	});
}

export { showErrorToast, showSuccessToast, showInfoToast };
