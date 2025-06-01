export interface GetGasStationResponse {
  gasSatationName: string;
  adminFullname: string;
  address: string;
  license: string;
  openTime: Date;
  closeTime: Date;
  open: boolean;
  zone: string;
  serviceDays: string[];
};

export interface getPricesByGasStationResponse {
  id: number;
  gasStationId: number;
  gasType: string;
  ltPrice: number;
}

export interface CreatePriceRequest {
  gasStationId: number;
  gasTypeId: number;
  ltPrice: number;
}

export interface UpdatePriceRequest {
  id: number;
  ltPrice: number;
}

export interface gasStationDataJsonResponse {
  id: number;
  user_id: number;
  gas_station_name: string;
  address: string;
  license: string;
  open_time: string;
  close_time: string;
  open: boolean;
  zone_id: number;
  service_days: string[];
}

export interface zoneJsonResponse {
  id: number;
  name: string
}

export interface gasTypeJsonResponse {
  id: number;
  name: string;
}

export interface priceJsonResponse {
  id: number;
  gas_station_id: number;
  gas_type_id: number;
  lt_price: number;
}