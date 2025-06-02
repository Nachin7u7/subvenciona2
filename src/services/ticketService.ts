import jsonServerInstance from "../api/jsonServerInstance";
import { formatDateTime } from "../helper/formatTimeHelper";
import { NetworkError, NotFoundError } from "./errors/commonErrors";
import { TicketWithWrongData, UniqueTicketPerLoad } from "./errors/ticketErrors";
import type { gasStationDataJsonResponse, gasTypeJsonResponse } from "./models/gasStationModels";
import type {
  GetTicketsByCustomerResponse,
  GetTicketsByLoadResponse,
  CreateTicketRequest,
  ticketJsonResponse,
  ticketStateJsonResponse,
} from "./models/ticketModels";

const GAS_STATION_DATA_URL = "gas_station_data";
const TICKET_URL = "tickets";
const TICKET_STATE_URL = "ticket_state";
const GAS_TYPE_URL = "gas_type";

export const getTicketsByCustomer = async (
  customerDataId: number
): Promise<GetTicketsByCustomerResponse[]> => {
  try {
    const [ticketsRes, gasStationsRes, ticketStateRes, gasTypesRes] = await Promise.all([
      jsonServerInstance.get(TICKET_URL, { params: { customer_data_id: customerDataId } }),
      jsonServerInstance.get(GAS_STATION_DATA_URL),
      jsonServerInstance.get(TICKET_STATE_URL),
      jsonServerInstance.get(GAS_TYPE_URL)
    ]);

    if (!Array.isArray(ticketsRes.data) || ticketsRes.data.length === 0) {
      throw new NotFoundError("No se encontraron tickets para este cliente");
    }

    const gasStations = gasStationsRes.data;
    const ticketStates = ticketStateRes.data;
    const gasTypes = gasTypesRes.data;

    return ticketsRes.data.map((ticket: ticketJsonResponse) => {
      const gasStation: gasStationDataJsonResponse = gasStations.find(
        (g: gasStationDataJsonResponse) => g.id === String(ticket.gas_station_id));
      const gasType: gasTypeJsonResponse = gasTypes.find(
        (g: gasTypeJsonResponse) => g.id === String(ticket.details.gas_type_id));
      const ticketState: ticketStateJsonResponse = ticketStates.find(
        (s: ticketStateJsonResponse) => s.id === String(ticket.details.ticket_state_id));

      if (!gasStation || !gasType || !ticketState) {
        throw new TicketWithWrongData();
      }

      return {
        id: parseInt(ticket.id),
        ticketNumber: ticket.ticket_number,
        date: new Date(ticket.date),
        details: {
          gasType: gasType?.name || "",
          ticketState: ticketState?.name || "",
          quantityLt: ticket.details.quantity_lt,
          amount: ticket.details.amount
        },
        gasStation: {
          gasStationName: gasStation?.gas_station_name || "",
          address: gasStation?.address || ""
        }
      } as GetTicketsByCustomerResponse;
    });
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof TicketWithWrongData) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const getTicketsByLoad = async (
  loadId: number
): Promise<GetTicketsByLoadResponse[]> => {
  try {
    const [ticketsRes, ticketStateRes, gasTypesRes] = await Promise.all([
      jsonServerInstance.get(TICKET_URL, { params: { load_id: loadId } }),
      jsonServerInstance.get(TICKET_STATE_URL),
      jsonServerInstance.get(GAS_TYPE_URL)
    ]);
    if (!Array.isArray(ticketsRes.data) || ticketsRes.data.length === 0) {
      throw new NotFoundError("No se encontraron tickets para esta carga");
    }

    const ticketStates = ticketStateRes.data;
    const gasTypes = gasTypesRes.data;

    return ticketsRes.data.map((ticket: ticketJsonResponse) => {
      const gasType: gasTypeJsonResponse = gasTypes.find(
        (g: gasTypeJsonResponse) => g.id === String(ticket.details.gas_type_id));
      const ticketState: ticketStateJsonResponse = ticketStates.find(
        (s: ticketStateJsonResponse) => s.id === String(ticket.details.ticket_state_id));
      if (!gasType || !ticketState) {
        throw new TicketWithWrongData();
      }

      return {
        id: parseInt(ticket.id),
        ticketNumber: ticket.ticket_number,
        date: new Date(ticket.date),
        details: {
          gasType: gasType?.name || "",
          ticketState: ticketState?.name || "",
          quantityLt: ticket.details.quantity_lt,
          amount: ticket.details.amount
        }
      } as GetTicketsByLoadResponse;
    });
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof TicketWithWrongData) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const createTicket = async (
  payload: CreateTicketRequest
): Promise<void> => {
  try {
    const ticketsRes = await jsonServerInstance.get(TICKET_URL);
    const tickets = ticketsRes.data;
    const maxId = tickets.reduce(
      (acc: number, t: ticketJsonResponse) => Math.max(acc, parseInt(t.id) || 0), 0
    ) || 0;
    const newId = maxId + 1;

    const ticketForSameLoad = await jsonServerInstance.get(TICKET_URL, {
      params: {
        load_id: payload.loadId,
        customer_data_id: payload.customerDataId
      }
    })

    if (!Array.isArray(ticketForSameLoad.data) || ticketForSameLoad.data.length !== 0) {
      throw new UniqueTicketPerLoad;
    }

    await jsonServerInstance.post(TICKET_URL, {
      id: newId,
      gas_station_id: payload.gasStationId,
      customer_data_id: payload.customerDataId,
      load_id: payload.loadId,
      ticket_numbet: payload.ticketNumber,
      date: formatDateTime(payload.date),
      details: payload.details
    });
  } catch (err) {
    if (err instanceof UniqueTicketPerLoad) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const deleteTicket = async (
  ticket_id: number,
  finished: boolean
): Promise<void> => {
  try {
    const newState = finished ? 2 : 3;

    const ticketResponse = await jsonServerInstance.get(`${TICKET_URL}/${ticket_id}`);

    if (!ticketResponse.data) {
      throw new NotFoundError("El ticket especificado no existe");
    }
    const { details } = ticketResponse.data as ticketJsonResponse;

    await jsonServerInstance.patch(`${TICKET_URL}/${ticket_id}`, {
      details: {
        ...details,
        ticket_state_id: newState
      }
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const deleteTicketByLoad = async (loadId: number): Promise<void> => {
  try {
    const tickets = await getTicketsByLoad(loadId);
    for (const ticket of tickets) {
      if (ticket.details.ticketState !== "Realizado") {
        const details = ticket.details;
        await jsonServerInstance.patch(`${TICKET_URL}/${ticket.id}`, {
          details: {
            ...details,
            ticket_state_id: 3
          }
        });
      }
    }
  } catch (err) {
    throw new NetworkError(err);
  }
};