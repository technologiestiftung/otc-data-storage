export enum ErroCodes {
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  ProxyAuthenticationRequired,
  RequestTimeout,
  Conflict,
  UnavailableForLegalReasons = 451,
}

// and of course for reponse codes

export enum StatusCodes {
  OK = 200,
  Created,
  Accepted,
  NonAuthoritativeInformation,
  NoContent,
}
