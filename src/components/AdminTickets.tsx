import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Typography, Divider, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteTicket, updateTicketState, fetchTickets } from "../services/ticketService";

function AdminTickets({ tickets = [], users = [] }: any) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [currentTickets, setCurrentTickets] = useState(tickets);

    useEffect(() => {
        setCurrentTickets(tickets);
    }, [tickets]);

    const refreshTickets = async () => {
        try {
            const updatedTickets = await fetchTickets();
            setCurrentTickets(updatedTickets);
        } catch (error) {
            console.error("Error actualizando los tickets:", error);
        }
    };

    const handleDelete = async (ticketId: number) => {
        try {
            await deleteTicket(ticketId, false);
            await refreshTickets();
        } catch (error) {
            console.error("Error eliminando el ticket:", error);
        }
    };

    const handleComplete = async (ticketId: number) => {
        try {
            await updateTicketState(ticketId, "Realizado");
            await refreshTickets();
        } catch (error) {
            console.error("Error completando el ticket:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {(currentTickets || []).map((ticket: any) => {
                const user = (users || []).find((u: any) => parseInt(u.id) === parseInt(ticket.customerId)) || null;

                return (
                    <Card
                        key={ticket.id}
                        sx={{
                            width: 340,
                            m: 2,
                            borderRadius: 3,
                            boxShadow: "0 4px 16px rgba(25, 118, 210, 0.08)",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <CardHeader
                            avatar={
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        background: "#e3f2fd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        color: "#1976d2",
                                        fontSize: 20
                                    }}
                                >
                                    {user ? user.name[0] : "?"}
                                </div>
                            }
                            title={
                                <Typography variant="subtitle1" fontWeight={700} color="primary">
                                    {user ? `${user.name} ${user.lastname}` : "Desconocido"}
                                </Typography>
                            }
                            subheader={
                                <Typography variant="caption" color="text.secondary">
                                    Turno #{parseInt(ticket.ticketNumber) || ticket.ticket_number}
                                </Typography>
                            }
                            sx={{ pb: 0 }}
                        />
                        <CardContent sx={{ pt: 1 }}>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <b>Tipo de gasolina:</b> {ticket.details.gasType || "No especificado"}
                                </Typography>
                                <Typography variant="body2">
                                    <b>Cantidad:</b> {ticket.details.quantityLt || "No especificado"} lt
                                </Typography>
                                <Typography variant="body2">
                                    <b>Monto:</b> {ticket.details.amount || "No especificado"} Bs
                                </Typography>
                                <Typography variant="body2">
                                    <b>Estado del ticket:</b> {ticket.details.ticketState || "No especificado"}
                                </Typography>
                                <Typography variant="body2">
                                    <b>Fecha:</b>{" "}
                                    {typeof ticket.date === "string"
                                        ? `${ticket.date.slice(0, 10)} ${ticket.date.slice(11, 16)}`
                                        : ticket.date instanceof Date
                                            ? `${ticket.date.toLocaleDateString()} ${ticket.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                            : "Fecha no disponible"}
                                </Typography>
                            </Stack>
                        </CardContent>
                        <Divider />
                        <div style={{ padding: 16, paddingTop: 8, display: "flex", gap: 8 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                fullWidth
                                onClick={() => {
                                    setSelectedTicketId(ticket.id);
                                    setOpenModal(true);
                                }}
                                disabled={ticket.details.ticketState !== "Pendiente"}
                            >
                                Eliminar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                fullWidth
                                onClick={() => handleComplete(ticket.id)}
                                disabled={ticket.details.ticketState !== "Pendiente"}
                            >
                                Completar
                            </Button>
                        </div>
                    </Card>
                );
            })}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedTicketId) {
                                handleDelete(selectedTicketId);
                            }
                            setOpenModal(false);
                        }}
                        color="error"
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AdminTickets;