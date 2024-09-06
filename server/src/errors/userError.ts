export class NoUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoUserError";
  }
}

export class PasswordNotMatchedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordNotMatchedError";
  }
}
