import jsonServerInstance from "../api/jsonServerInstance";
import { NetworkError, NotFoundError } from "./errors/commonErrors";
import type { userJsonResponse } from "./models/authModels";
import type { gasStationDataJsonResponse, gasTypeJsonResponse, GetGasStationResponse, GetPricesByGasStationResponse, zoneJsonResponse, priceJsonResponse, CreatePriceRequest, UpdatePriceRequest, GetGasTypeResponse, GetZoneResponse } from "./models/gasStationModels";

const USER_URL = "users";
const GAS_STATION_DATA_URL = "customer_data";
const ZONE_URL = "zone";
const GAS_TYPE_URL = "gas_type";
const PRICES_URL = "prices";

export const getGasStations = async (): Promise<GetGasStationResponse[]> => {
  try {
    const [gasStationResponse, usersResponse, zonesResponse] = await Promise.all([
      jsonServerInstance.get(GAS_STATION_DATA_URL),
      jsonServerInstance.get(USER_URL),
      jsonServerInstance.get(ZONE_URL)
    ]);

    if (!Array.isArray(gasStationResponse.data)) {
      throw new NotFoundError("No se encontraron Gasolineras");
    }

    return gasStationResponse.data.map((gasStation: gasStationDataJsonResponse) => {
      const user = usersResponse.data.find((u: userJsonResponse) => u.id === String(gasStation.user_id));
      const zone = zonesResponse.data.find((z: zoneJsonResponse) => z.id === String(gasStation.zone_id));

      return {
        gasSatationName: gasStation.gas_station_name,
        adminFullname: user ? `${user.name} ${user.lastname}` : "Administrador desconocido",
        address: gasStation.address,
        license: gasStation.license,
        openTime: new Date(gasStation.open_time),
        closeTime: new Date(gasStation.close_time),
        open: gasStation.open,
        zone: zone?.name || "Zona desconocida",
        serviceDays: gasStation.service_days
      } as GetGasStationResponse;
    }) as GetGasStationResponse[];
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err
    }
    throw new NetworkError(err);
  }
};

export const getGasStationById = async (
  id: number
): Promise<GetGasStationResponse> => {
  try {
    const [gasStationResponse, usersResponse, zonesResponse] = await Promise.all([
      jsonServerInstance.get(`${GAS_STATION_DATA_URL}/${id}`),
      jsonServerInstance.get(USER_URL),
      jsonServerInstance.get(ZONE_URL)
    ]);

    const gasStation = gasStationResponse.data as gasStationDataJsonResponse;
    if (!gasStation) {
      throw new NotFoundError("Gasolinera no encontrada");
    }

    const user = usersResponse.data.find((u: userJsonResponse) => u.id === String(gasStation.user_id));
    const zone = zonesResponse.data.find((z: zoneJsonResponse) => z.id === String(gasStation.zone_id));

    return {
      gasSatationName: gasStation.gas_station_name,
      adminFullname: user ? `${user.name} ${user.lastname}` : "Administrador desconocido",
      address: gasStation.address,
      license: gasStation.license,
      openTime: new Date(gasStation.open_time),
      closeTime: new Date(gasStation.close_time),
      open: gasStation.open,
      zone: zone?.name || "Zona desconocida",
      serviceDays: gasStation.service_days
    };
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err
    }
    throw new NetworkError(err)
  }
};

export const getGasTypes = async (): Promise<GetGasTypeResponse[]> => {
  try {
    const gasTypesResponse = await jsonServerInstance.get(GAS_TYPE_URL)
    if (!Array.isArray(gasTypesResponse.data)) {
      throw new NotFoundError("No se encontraron tipos de combustibles")
    }
    return gasTypesResponse.data.map((gasType: gasTypeJsonResponse) => {
      return {
        id: parseInt(gasType.id),
        name: gasType.name
      } as GetGasTypeResponse;
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err
    }
    throw new NetworkError(err)
  }
}

export const getZones = async (): Promise<GetZoneResponse[]> => {
  try {
    const zoneResponse = await jsonServerInstance.get(ZONE_URL)
    if (!Array.isArray(zoneResponse.data)) {
      throw new NotFoundError("No se encontraron zonas disponibles")
    }
    return zoneResponse.data.map((zone: zoneJsonResponse) => {
      return {
        id: parseInt(zone.id),
        name: zone.name
      } as GetZoneResponse;
    })
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err
    }
    throw new NetworkError(err)
  }
}

export const getPricesByGasStationId = async (
  gasStationId: number
): Promise<GetPricesByGasStationResponse[]> => {
  try {
    const [pricesResponse, gasTypesResponse] = await Promise.all([
      jsonServerInstance.get(PRICES_URL, { params: { gas_station_id: gasStationId } }),
      jsonServerInstance.get(GAS_TYPE_URL)
    ])

    if (!Array.isArray(pricesResponse.data) || pricesResponse.data.length === 0) {
      throw new NotFoundError("No se encontraron los presios de esta gasolinera")
    }
    return pricesResponse.data.map((price: priceJsonResponse) => {
      const gasType = gasTypesResponse.data.find((g: gasTypeJsonResponse) => parseInt(g.id) === price.gas_type_id)?.name || "";

      return {
        id: parseInt(price.id),
        gasStationId: price.gas_station_id,
        gasType: gasType,
        ltPrice: price.lt_price
      } as GetPricesByGasStationResponse;
    }) as GetPricesByGasStationResponse[];

  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const createPrice = async (
  request: CreatePriceRequest
): Promise<void> => {
  try {
    const priceResponse = await jsonServerInstance.get(PRICES_URL);

    if (!Array.isArray(priceResponse.data)) {
      throw new NetworkError("No se encontro precios previos")
    }

    const maxId = priceResponse.data.reduce(
      (acc: number, p: priceJsonResponse) => Math.max(acc, parseInt(p.id) || 0), 0
    ) || 0;

    const newId = maxId + 1;
    await jsonServerInstance.post(PRICES_URL, {
      id: newId,
      gas_station_id: request.gasStationId,
      gas_type_id: request.gasTypeId,
      lt_price: request.ltPrice
    })

  } catch (err) {
    if (err instanceof NetworkError) {
      throw err;
    }
    throw new NetworkError(err);
  }
};
export const updatePrice = async (
  request: UpdatePriceRequest
): Promise<void> => {
  try {
    const priceResponse = await jsonServerInstance.get(`${PRICES_URL}/${request.id}`);
    const price = priceResponse.data as priceJsonResponse;
    if (!price) {
      throw new NotFoundError("Precio no encontrado");
    }

    const patchResponse = await jsonServerInstance.patch(`
      ${PRICES_URL}/${request.id}
    `, {
      lt_price: request.ltPrice
    });

    if (!patchResponse.data) {
      throw new NetworkError("Error al actualizar el precio");
    }

  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new NetworkError(err);
  }
};

export const deletePrice = async (
  id: number
): Promise<void> => {
  try {
    const priceResponse = await jsonServerInstance.get(`${PRICES_URL}/${id}`);
    if (!priceResponse) {
      throw new NotFoundError("No existe un precio que borrar");
    }
    await jsonServerInstance.delete(`${PRICES_URL}/${id}`);
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new NetworkError(err)
  }
}
