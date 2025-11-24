import type { PostgrestError } from '@supabase/supabase-js';

export function getErrorMessage(error: PostgrestError | null | undefined): string {
	if (!error) return 'common.errors.unknownError';

	// PostgreSQL error codes to user-friendly messages
	const errorMessages: Record<string, string> = {
		// Authentication errors
		invalid_credentials: 'common.errors.invalidCredentials',
		email_not_confirmed: 'common.errors.emailNotConfirmed',
		user_already_exists: 'common.errors.userAlreadyExists',

		// Database constraint errors
		'23505': 'common.errors.duplicateEntry',
		'23503': 'common.errors.cannotDeleteRelatedRecords',
		'23502': 'common.errors.requiredFieldMissing',
		'23514': 'common.errors.invalidDataFormat',

		// Foreign key violations
		foreign_key_violation: 'common.errors.cannotCompleteActionRelatedDataMissing',

		// Permission errors
		'42501': 'common.errors.permissionDenied',
		PGRST301: 'common.errors.permissionDenied',

		// Not found
		PGRST116: 'common.errors.recordNotFound',

		// Network/connection errors
		FetchError: 'common.errors.networkError'
	};

	// Check for specific error code
	if (error.code && errorMessages[error.code]) {
		return errorMessages[error.code];
	}

	// Check error message for patterns
	if (error.message.includes('duplicate key')) {
		return 'common.errors.duplicateEntry';
	}

	if (error.message.includes('Token has expired') || error.message.includes('invalid token')) {
		return 'common.errors.tokenExpiredOrInvalid';
	}

	if (error.message.includes('violates foreign key constraint')) {
		return 'common.errors.cannotDeleteRelatedRecords';
	}

	if (error.message.includes('permission denied')) {
		return 'common.errors.permissionDenied';
	}

	if (error.message.includes('timePassedOrBookedByCustomer')) {
		return 'common.errors.timePassedOrBookedByCustomer';
	}

	// Development mode: show actual error
	if (import.meta.env.DEV) {
		console.error('Supabase error:', error);
		return `Error: ${error.message}`;
	}

	// Production: generic message
	return 'common.errors.unknownError';
}
