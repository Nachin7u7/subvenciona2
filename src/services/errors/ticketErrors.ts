export class TicketWithWrongData extends Error {
  constructor() {
    super("información de ticket incorrecta");
    this.name = "TicketWrongData";
  }
}

export class UniqueTicketPerLoad extends Error {
  constructor() {
    super("no puedes reservar más de una vez por disponibilidad");
    this.name = "UniqueTicketPerLoad"
  }
}