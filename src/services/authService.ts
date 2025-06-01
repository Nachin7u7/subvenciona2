import jsonServerInstance from "../api/jsonServerInstance";
import { NetworkError } from "./errors/commonErrors";
import { CustomerNotFoundError, GasStationNotFoundError, InvalidCredentialsError, NoRoleAssignedError, UserRegistrationError } from "./errors/authErrors";
import type { LoginCustomerResponse, LoginGasStationResponse, RegisterCustomerRequest, RegisterGasStationRequest, RegisterUserRequest } from "./models/authModels";
import { formatTimeOnly } from "../helper/formatTimeHelper";

const USER_URL = "users";
const CUSTOMER_DATA_URL = "gas_station_data";
const GAS_STATION_DATA_URL = "customer_data";

export const login = async (
  email: string,
  password: string
): Promise<LoginCustomerResponse | LoginGasStationResponse> => {
  let user: { id: number; name: string; lastname: string; email: string };
  try {
    const userRes = await jsonServerInstance.get(USER_URL, {
      params: { email, password },
    });
    if (!Array.isArray(userRes.data) || userRes.data.length === 0) {
      throw new InvalidCredentialsError();
    }
    user = userRes.data[0];
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      throw err;
    }
    throw new NetworkError(err);
  }

  try {
    const customerRes = await jsonServerInstance.get(CUSTOMER_DATA_URL, {
      params: { user_id: user.id },
    });
    if (Array.isArray(customerRes.data) && customerRes.data.length > 0) {
      const customer = customerRes.data[0];
      return {
        fullname: `${user.name} ${user.lastname}`,
        email: user.email,
        license: customer.license,
        carPlate: customer.car_plate,
        rol: "customer",
      } as LoginCustomerResponse;
    } else {
      throw new CustomerNotFoundError();
    }
  } catch (err) {
    if (!(err instanceof CustomerNotFoundError)) {
      throw new NetworkError(err);
    }
  }

  try {
    const gasStationRes = await jsonServerInstance.get(GAS_STATION_DATA_URL, {
      params: { user_id: user.id },
    });
    if (Array.isArray(gasStationRes.data) && gasStationRes.data.length > 0) {
      const gs = gasStationRes.data[0];
      return {
        gasSatationName: gs.gas_station_name,
        adminFullname: `${user.name} ${user.lastname}`,
        adminEmail: user.email,
        address: gs.address,
        license: gs.license,
        openTime: new Date(gs.open_time),
        closeTime: new Date(gs.close_time),
        open: gs.open,
        rol: "admin",
        serviceDays: gs.service_days,
      } as LoginGasStationResponse;
    } else {
      throw new GasStationNotFoundError();
    }
  } catch (err) {
    if (err instanceof GasStationNotFoundError) {
      throw new NoRoleAssignedError();
    }
    throw new NetworkError(err);
  }
};

const registerUser = async (
  payload: RegisterUserRequest
): Promise<number> => {
  try {
    const allUsersRes = await jsonServerInstance.get(USER_URL);
    const maxId =
      allUsersRes.data.reduce(
        (acc: number, u: { id: number }) => Math.max(acc, u.id || 0), 0
      ) || 0;
    const newId = maxId + 1;

    const usersWithSameEmail = await jsonServerInstance.get(USER_URL, {
      params: { email: payload.email }
    })

    if (!Array.isArray(usersWithSameEmail.data) || usersWithSameEmail.data.length === 0) {
      throw new UserRegistrationError();
    }

    await jsonServerInstance.post(USER_URL, {
      id: newId,
      name: payload.name,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
    });

    return newId;
  } catch (err) {
    throw new NetworkError(err);
  }
};

export const registerCustomer = async (
  payload: RegisterCustomerRequest
): Promise<void> => {
  let newUserId: number;
  try {
    newUserId = await registerUser(payload.user);
  } catch (err) {
    if (err instanceof NetworkError || err instanceof UserRegistrationError) {
      throw err;
    }
    throw new NetworkError(err);
  }

  try {
    const allCustRes = await jsonServerInstance.get(CUSTOMER_DATA_URL);
    const maxCustId =
      allCustRes.data.reduce(
        (acc: number, c: { id: number }) => Math.max(acc, c.id || 0), 0
      ) || 0;
    const newCustId = maxCustId + 1;

    await jsonServerInstance.post(CUSTOMER_DATA_URL, {
      id: newCustId,
      user_id: newUserId,
      license: payload.license,
      car_plate: payload.car_plate,
    });
  } catch (err) {
    throw new NetworkError(err);
  }

};


export const registerGasStation = async (
  payload: RegisterGasStationRequest
): Promise<void> => {
  let newAdminId: number;
  try {
    newAdminId = await registerUser(payload.user);
  } catch (err) {
    if (err instanceof NetworkError || err instanceof UserRegistrationError) {
      throw err;
    }
    throw new NetworkError(err)
  }

  try {
    const allGSRes = await jsonServerInstance.get(GAS_STATION_DATA_URL);
    const maxGSId =
      allGSRes.data.reduce(
        (acc: number, gs: { id: number }) => Math.max(acc, gs.id || 0), 0
      ) || 0;
    const newGSId = maxGSId + 1;

    await jsonServerInstance.post(GAS_STATION_DATA_URL, {
      id: newGSId,
      user_id: newAdminId,
      gas_station_name: payload.gasSatationName,
      address: payload.address,
      license: payload.license,
      open_time: formatTimeOnly(payload.openTime),
      close_time: formatTimeOnly(payload.closeTime),
      open: payload.open,
      service_days: payload.serviceDays
    });
  } catch (err) {
    throw new NetworkError(err);
  }
};