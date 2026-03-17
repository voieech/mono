export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
    // Restore prototype chain for `instanceof` to work
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
