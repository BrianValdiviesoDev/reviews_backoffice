export enum RequestStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  ERROR = 'ERROR',
}

export enum RequestType {
  FIND_PRODUCT = 'FIND_PRODUCT',
  GET_REVIEWS = 'GET_REVIEWS',
}
export interface Request {
  _id: string;
  url: string;
  type: RequestType;
  status: RequestStatus;
  productId: string;
  executionDate: Date;
}
