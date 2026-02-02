// api/errorHandler.ts
import axios, { AxiosError } from "axios";

export interface NormalizedError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  data?: any;
}

/**
 * Normalize different error types into a consistent format
 */
export const normalizeError = (error: unknown): NormalizedError => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Server responded with error
    if (axiosError.response) {
      const { data, status } = axiosError.response;

      return {
        message: data?.message || axiosError.message || "An error occurred",
        statusCode: status,
        errors: data?.errors || undefined,
        data: data || undefined,
      };
    }

    // Request was made but no response received
    if (axiosError.request) {
      return {
        message: "No response from server. Please check your connection.",
        statusCode: 0,
      };
    }

    // Something happened in setting up the request
    return {
      message: axiosError.message || "Request failed",
      statusCode: 0,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      statusCode: 500,
    };
  }

  // Handle unknown errors
  return {
    message: "An unknown error occurred",
    statusCode: 500,
  };
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const normalized = normalizeError(error);
  return normalized.message;
};

/**
 * Check if error is a specific HTTP status
 */
export const isErrorStatus = (error: unknown, status: number): boolean => {
  const normalized = normalizeError(error);
  return normalized.statusCode === status;
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: unknown): boolean => {
  return isErrorStatus(error, 401) || isErrorStatus(error, 403);
};

/**
 * Check if error is validation related
 */
export const isValidationError = (error: unknown): boolean => {
  const normalized = normalizeError(error);
  return normalized.statusCode === 400 && !!normalized.errors;
};

/**
 * Get validation errors as array of messages
 */
export const getValidationErrors = (error: unknown): string[] => {
  const normalized = normalizeError(error);
  
  if (!normalized.errors) {
    return [];
  }

  return Object.entries(normalized.errors).flatMap(([field, messages]) =>
    messages.map((msg) => `${field}: ${msg}`)
  );
};

/**
 * Handle API errors with optional callback
 */
export const handleApiError = (
  error: unknown,
  options?: {
    onAuthError?: () => void;
    onValidationError?: (errors: string[]) => void;
    onNetworkError?: () => void;
    onServerError?: () => void;
  }
) => {
  const normalized = normalizeError(error);

  // Authentication errors
  if (isAuthError(error)) {
    options?.onAuthError?.();
    return;
  }

  // Validation errors
  if (isValidationError(error)) {
    const validationErrors = getValidationErrors(error);
    options?.onValidationError?.(validationErrors);
    return;
  }

  // Network errors
  if (normalized.statusCode === 0) {
    options?.onNetworkError?.();
    return;
  }

  // Server errors
  if (normalized.statusCode >= 500) {
    options?.onServerError?.();
    return;
  }
};

// ==================== USAGE EXAMPLES ====================

/*
// In a component or store action
try {
  await someApiCall();
} catch (error) {
  const normalized = normalizeError(error);
  console.error(normalized.message);
  
  // Or use the handler
  handleApiError(error, {
    onAuthError: () => {
      // Redirect to login
      window.location.href = "/login";
    },
    onValidationError: (errors) => {
      // Show validation errors
      toast.error(errors.join(", "));
    },
    onNetworkError: () => {
      // Show network error
      toast.error("Network error. Please check your connection.");
    },
    onServerError: () => {
      // Show server error
      toast.error("Server error. Please try again later.");
    },
  });
}
*/