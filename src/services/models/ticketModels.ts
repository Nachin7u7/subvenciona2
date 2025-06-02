export interface GetTicketsByCustomerResponse {
  id: number;
  ticketNumber: number;
  date: Date;
  details: {
    gasType: string;
    ticketState: string;
    quantityLt: number;
    amount: number;
  };
  gasStation: {
    gasSatationName: string;
    address: string;
  }
};

export interface GetTicketsByLoadResponse {
  id: number;
  ticketNumber: number;
  date: Date;
  details: {
    gasType: string;
    ticketState: string;
    quantityLt: number;
    amount: number;
  };
};

export interface CreateTicketRequest {
  gasStationId: number;
  customerDataId: number;
  loadId: number;
  ticketNumber: number;
  date: Date;
  details: {
    gas_type_id: number;
    ticket_state_id: number;
    quantity_lt: number;
    amount: number;
  };
};

export interface ticketJsonResponse {
  id: string,
  gas_station_id: number,
  customer_data_id: number,
  load_id: number,
  ticket_number: number,
  date: string,
  details: {
    gas_type_id: number,
    ticket_state_id: number,
    quantity_lt: number,
    amount: number
  }
}

export interface ticketStateJsonResponse {
  id: string;
  name: string;
}