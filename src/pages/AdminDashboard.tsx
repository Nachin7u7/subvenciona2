import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack
} from "@mui/material";
import AdminTickets from "../components/AdminTickets";
import gasLogo from "../assets/gasolinaYaProfile.png";

const LOGGED_USER_ID = 2; // Ricardo nota para despues: simulacion de usuario logeado

const fetchAllData = async () => {
    const endpoints = [
        "users",
        "gas_station_data",
        "zone",
        "customer_data",
        "prices",
        "tickets",
        "ticket_state",
        "load",
        "gas_type"
    ];
    const baseUrl = "http://localhost:3000";
    const results = await Promise.all(
        endpoints.map(endpoint =>
            fetch(`${baseUrl}/${endpoint}`).then(res => {
                if (!res.ok) throw new Error(`No se pudo cargar ${endpoint}`);
                return res.json();
            })
        )
    );
    const data: any = {};
    endpoints.forEach((endpoint, i) => {
        data[endpoint] = results[i];
    });
    return data;
};

function CapacityModal({ open, onClose, onSave }: any) {
    const [capacity, setCapacity] = useState("");
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Agregar capacidad de gasolina</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Capacidad en litros"
                    type="number"
                    fullWidth
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={() => { onSave(capacity); setCapacity(""); onClose(); }} variant="contained">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function EditStationModal({ open, onClose, station, onSave }: any) {
    const [form, setForm] = useState({
        gas_station_name: station?.gas_station_name || "",
        address: station?.address || "",
        open_time: station?.open_time?.slice(11, 16) || "",
        close_time: station?.close_time?.slice(11, 16) || ""
    });

    React.useEffect(() => {
        if (station) {
            setForm({
                gas_station_name: station.gas_station_name || "",
                address: station.address || "",
                open_time: station.open_time?.slice(11, 16) || "",
                close_time: station.close_time?.slice(11, 16) || ""
            });
        }
    }, [station, open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Editar perfil de la gasolinera</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Nombre"
                        value={form.gas_station_name}
                        onChange={e => setForm(f => ({ ...f, gas_station_name: e.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Dirección"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Horario de apertura"
                        type="time"
                        value={form.open_time}
                        onChange={e => setForm(f => ({ ...f, open_time: e.target.value }))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Horario de cierre"
                        type="time"
                        value={form.close_time}
                        onChange={e => setForm(f => ({ ...f, close_time: e.target.value }))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={() => { onSave(form); onClose(); }} variant="contained">
                    Guardar cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const Dashboard: React.FC = () => {
    const [db, setDb] = useState<any>(null);
    const [showCapacityModal, setShowCapacityModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchAllData().then(setDb);
    }, []);

    if (!db) return <div>Cargando...</div>;

    const myStation = db.gas_station_data.find((g: any) => {
        return g.user_id === LOGGED_USER_ID ? g : null;
    });


    if (!myStation) return <div>No tienes una estación asignada.</div>;

    const myTickets = db.tickets.filter((t: any) => t.gas_station_id === myStation.id);

    return (
        <div style={{ padding: 32, background: "#f5f5f5", minHeight: "100vh" }}>
            <Box
                sx={{
                    mb: 4,
                    p: 3,
                    background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                    borderRadius: 3,
                    boxShadow: "0 4px 24px rgba(25, 118, 210, 0.10)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <img
                    src={gasLogo}
                    alt="station"
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        padding: 6,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        color: "#fff",
                        fontWeight: 700,
                        letterSpacing: 1,
                        mb: 0.5,
                        textAlign: "center"
                    }}
                >
                    {myStation?.gas_station_name || "Gasolinera"}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        ml: "auto",
                        background: "#fff",
                        color: "#1976d2",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
                        "&:hover": { background: "#e3f2fd" }
                    }}
                    onClick={() => setShowEditModal(true)}
                >
                    Editar perfil
                </Button>
            </Box>
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
                    onClick={() => setShowCapacityModal(true)}
                >
                    Agregar capacidad de gasolina
                </Button>
                <CapacityModal
                    open={showCapacityModal}
                    onClose={() => setShowCapacityModal(false)}
                    onSave={(cap: any) => alert(`Capacidad registrada: ${cap} litros`)}
                />
                <EditStationModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    station={myStation}
                    onSave={(data: any) => alert("Cambios guardados:\n" + JSON.stringify(data, null, 2))}
                />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 700 }}>
                Próximos turnos
            </Typography>
            <AdminTickets
                tickets={myTickets}
                gasTypes={db.gas_type}
                customers={db.customer_data}
                users={db.users}
                onDelete={() => alert("Turno eliminado (simulado)")}
            />
        </div>
    );
};

export default Dashboard;
