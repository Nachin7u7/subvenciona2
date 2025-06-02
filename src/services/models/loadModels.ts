import type { GetTicketsByLoadResponse } from "./ticketModels";

export interface GetLoadByGasStationResponse {
  id: number;
  quantityLt: number;
  date: Date;
  gasTypes: string[];
  tickets: GetTicketsByLoadResponse[]
  cancel: boolean;
}

export interface GetLoadByGasStationForCustomerResponse {
  id: number;
  quantityLt: number;
  date: Date;
  gasTypes: string[];
  cancel: boolean;
}

export interface CreateLoadRequest {
  gasStationId: number;
  quantityLt: number;
  date: Date;
  gasTypes: number[];
}

export interface UpdateLoadRequest {
  id: number;
  gasStationId?: number;
  quantityLt?: number;
  date?: Date;
  gasTypes?: number[];
  cancel?: boolean;
}

export interface loadJsonResponse {
  id: string;
  gas_station_id: number;
  quantity_lt: number;
  date: string;
  gas_types: number[];
  cancel: boolean;
}

export interface loadPatchJsonResponse {
  gas_station_id?: number;
  quantity_lt?: number;
  date?: string;
  gas_types?: number[];
  cancel?: boolean;
}