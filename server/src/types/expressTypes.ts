export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface CustomRequest extends Request {
  token?: string; // Add the token property, making it optional
}
