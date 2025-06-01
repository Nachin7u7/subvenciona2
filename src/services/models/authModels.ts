export interface LoginCustomerResponse {
  fullname: string;
  email: string;
  license: string;
  carPlate: string;
  rol: string;
};

export interface LoginGasStationResponse {
  gasSatationName: string;
  adminFullname: string;
  adminEmail: string;
  address: string;
  license: string;
  openTime: Date;
  closeTime: Date;
  open: boolean;
  rol: string;
  zone: string;
  serviceDays: string[];
};

export interface RegisterUserRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
};

export interface RegisterCustomerRequest {
  user: RegisterUserRequest;
  license: string;
  car_plate: string;
};

export interface RegisterGasStationRequest {
  user: RegisterUserRequest;
  gasSatationName: string;
  address: string;
  license: string;
  openTime: Date;
  closeTime: Date;
  open: boolean;
  rol: string;
  zone: number;
  serviceDays: string[];
};

export interface userJsonResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
}

export interface customerDataJsonResponse {
  id: number;
  user_id: number;
  license: string;
  car_plate: string;
}