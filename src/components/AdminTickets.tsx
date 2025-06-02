import { Card, CardHeader, CardContent, Typography, Divider, Stack, Button } from "@mui/material";

function AdminTickets({ tickets = [], customers = [], users = [], onDelete }: any) {

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {(tickets || []).map((ticket: any) => {
                const customer = (customers || []).find((c: any) => c.id === ticket.customer_data_id);
                const user = (users || []).find((u: any) => u.id === (customer ? customer.user_id : null));

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
                                    Turno #{ticket.ticket_number}
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
                            <Button variant="outlined" color="error" size="small" fullWidth onClick={() => onDelete(ticket.id)}>
                                Eliminar
                            </Button>
                            <Button variant="outlined" color="primary" size="small" fullWidth>
                                Editar
                            </Button>
                            <Button variant="outlined" color="secondary" size="small" fullWidth>
                                Mover
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

export default AdminTickets;