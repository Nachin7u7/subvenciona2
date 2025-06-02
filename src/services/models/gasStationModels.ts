export interface GetGasStationResponse {
  gasSatationName: string;
  adminFullname: string;
  address: string;
  license: string;
  openTime: Date;
  closeTime: Date;
  open: boolean;
  zone: string;
  image: string;
  serviceDays: string[];
};

export interface GetPricesByGasStationResponse {
  id: number;
  gasStationId: number;
  gasType: string;
  ltPrice: number;
}
export interface GetZoneResponse {
  id: number;
  name: string
}

export interface GetGasTypeResponse {
  id: number;
  name: string;
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
  id: string;
  user_id: number;
  gas_station_name: string;
  address: string;
  license: string;
  open_time: string;
  close_time: string;
  open: boolean;
  zone_id: number;
  image: string;
  service_days: string[];
}

export interface zoneJsonResponse {
  id: string;
  name: string
}

export interface gasTypeJsonResponse {
  id: string;
  name: string;
}

export interface priceJsonResponse {
  id: string;
  gas_station_id: number;
  gas_type_id: number;
  lt_price: number;
}