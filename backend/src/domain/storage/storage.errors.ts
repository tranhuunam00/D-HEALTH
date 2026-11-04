export class StorageValidationError extends Error {
  readonly code: string;
  readonly field?: string;

  constructor(code: string, message: string, field?: string) {
    super(message);
    this.name = 'StorageValidationError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, StorageValidationError.prototype);
  }
}

export class StorageOperationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'StorageOperationError';
    this.code = code;
    Object.setPrototypeOf(this, StorageOperationError.prototype);
  }
}
