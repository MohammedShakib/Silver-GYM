export class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
  GYM_NOT_FOUND: 'GYM_NOT_FOUND',
  MEMBERSHIP_NOT_FOUND: 'MEMBERSHIP_NOT_FOUND',
  MEMBERSHIP_INACTIVE: 'MEMBERSHIP_INACTIVE',
  GYM_ACCESS_DENIED: 'GYM_ACCESS_DENIED',
  NO_VISITS_REMAINING: 'NO_VISITS_REMAINING',
  ALREADY_CHECKED_IN: 'ALREADY_CHECKED_IN'
};
