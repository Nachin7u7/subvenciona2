import { getGasStations } from "./gasStationService";
import { getGasTypes } from "./gasStationService";
import { getZones } from "./gasStationService";
import { getPricesByGasStationId } from "./gasStationService";
import { getloadForGasStation } from "./loadService";
import { getTicketsByLoad } from "./ticketService";
import { getUsers } from "./authService";
import type { GetLoadByGasStationResponse } from "./models/loadModels";
import type { GetPricesByGasStationResponse } from "./models/gasStationModels";
import type { GetTicketsByLoadResponse } from "./models/ticketModels";


export async function getAdminDashboardData(gasStationUserId: number) {
    const users = await getUsers();
    const gasStations = await getGasStations();
    const gasTypes = await getGasTypes();
    const zones = await getZones();

    const myStation = gasStations.find(gs => gs.adminFullname && users.find((u: { id: string; name: any; lastname: any; }) => u.id === String(gasStationUserId) && `${u.name} ${u.lastname}` === gs.adminFullname));
    let prices: GetPricesByGasStationResponse[] = [];
    let loads: GetLoadByGasStationResponse[] = [];
    let tickets: GetTicketsByLoadResponse[] = [];
    if (myStation) {
        prices = await getPricesByGasStationId((myStation as any).gasStationId);
        loads = await getloadForGasStation((myStation as any).gasStationId);
        tickets = (await Promise.all(loads.map(l => getTicketsByLoad(l.id)))).flat();
    }

    return {
        users,
        gasStations,
        gasTypes,
        zones,
        myStation,
        prices,
        loads,
        tickets
    };
}