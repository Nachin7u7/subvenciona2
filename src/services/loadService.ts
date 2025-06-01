import jsonServerInstance from "../api/jsonServerInstance";
import { formatTimeOnly } from "../helper/formatTimeHelper";
import { NetworkError, NotFoundError } from "./errors/commonErrors";
import type { gasTypeJsonResponse } from "./models/gasStationModels";
import type { CreateLoadRequest, GetLoadByGasStationForCustomerResponse, GetLoadByGasStationResponse, loadJsonResponse, loadPatchJsonResponse, UpdateLoadRequest } from "./models/loadModels";
import type { GetTicketsByLoadResponse } from "./models/ticketModels";
import { deleteTicketByLoad, getTicketsByLoad } from "./ticketService";

const LOAD_URL = "load";
const GAS_TYPE_URL = "gas_type";

export const getloadForCustomer = async (
  gasStationId: number
): Promise<GetLoadByGasStationForCustomerResponse[]> => {
  try {
    const loadResponse = await jsonServerInstance.get(LOAD_URL, {
      params: { gas_station_id: gasStationId }
    });

    if (!Array.isArray(loadResponse.data) || loadResponse.data.length === 0) {
      throw new NotFoundError("No se encontraron disposiciones de esta gasolinera");
    }

    const gasTypesResponse = await jsonServerInstance.get(GAS_TYPE_URL);
    if (!Array.isArray(gasTypesResponse.data)) {
      throw new NotFoundError("No se encontraron tipos de gasolina");
    }

    return loadResponse.data.map((load: loadJsonResponse) => {
      const gasTypes = load.gas_types?.map(
        (id) => gasTypesResponse.data.find((g: gasTypeJsonResponse) => g.id === String(id))?.name || ""
      ) || [];

      return {
        id: parseInt(load.id),
        quantityLt: load.quantity_lt,
        date: new Date(load.date),
        gasTypes,
        cancel: load.cancel
      } as GetLoadByGasStationForCustomerResponse;
    }) as GetLoadByGasStationForCustomerResponse[];
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err
    }
    throw new NetworkError(err);
  }
};

export const getloadForGasStation = async (
  gasStationId: number
): Promise<GetLoadByGasStationResponse[]> => {
  try {
    const loadResponse = await jsonServerInstance.get(LOAD_URL, {
      params: { gas_station_id: gasStationId }
    });

    if (!Array.isArray(loadResponse.data) || loadResponse.data.length === 0) {
      throw new NotFoundError("No se encontraron disposiciones de esta gasolinera");
    }

    const gasTypesResponse = await jsonServerInstance.get(GAS_TYPE_URL);
    if (!Array.isArray(gasTypesResponse.data)) {
      throw new NotFoundError("No se pudo obtener el listado de tipos de gas");
    }

    const loadsWithTickets: GetLoadByGasStationResponse[] = await Promise.all(
      loadResponse.data.map(async (load: loadJsonResponse) => {
        const gasTypes = load.gas_types?.map(
          (id) => gasTypesResponse.data.find((g: gasTypeJsonResponse) => g.id === String(id))?.name || ""
        ) || [];

        const tickets: GetTicketsByLoadResponse[] = await getTicketsByLoad(parseInt(load.id));

        return {
          id: parseInt(load.id),
          quantityLt: load.quantity_lt,
          date: new Date(load.date),
          gasTypes,
          tickets,
          cancel: load.cancel
        } as GetLoadByGasStationResponse;
      })
    );

    return loadsWithTickets;
  } catch (err) {
    if (err instanceof NetworkError) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const createLoad = async (request: CreateLoadRequest): Promise<void> => {
  try {
    const allLoadsResponse = await jsonServerInstance.get(LOAD_URL);
    if (!Array.isArray(allLoadsResponse.data)) {
      throw new NetworkError("Error al obtener las cargas existentes");
    }
    const maxId = allLoadsResponse.data.reduce(
      (acc: number, t: loadJsonResponse) => Math.max(acc, parseInt(t.id) || 0), 0
    ) || 0;

    const newId = maxId + 1

    await jsonServerInstance.post(LOAD_URL, {
      id: newId,
      gas_station_id: request.gasStationId,
      quantity_lt: request.quantityLt,
      date: request.date,
      gas_types: request.gasTypes,
      cancel: false
    });
  } catch (err) {
    throw new NetworkError(err);
  }
};

export const updateLoad = async (request: UpdateLoadRequest): Promise<void> => {
  try {
    const loadPatch: loadPatchJsonResponse = {};
    if (request.gasStationId !== undefined) loadPatch.gas_station_id = request.gasStationId;
    if (request.quantityLt !== undefined) loadPatch.quantity_lt = request.quantityLt;
    if (request.date !== undefined) loadPatch.date = formatTimeOnly(request.date);
    if (request.gasTypes !== undefined) loadPatch.gas_types = request.gasTypes;
    if (request.cancel !== undefined) {
      await deleteTicketByLoad(request.id);
      loadPatch.cancel = request.cancel;
    }

    const patchResponse = await jsonServerInstance.patch(`${LOAD_URL}/${request.id}`, loadPatch);

    if (!patchResponse.data) {
      throw new NetworkError("Error al actualizar la carga");
    }
  } catch (err) {
    if (err instanceof NetworkError) {
      throw err;
    }
    throw new NetworkError(err);
  }
};
