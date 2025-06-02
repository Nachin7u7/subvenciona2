export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciales inválidas");
    this.name = "InvalidCredentialsError";
  }
}

export class CustomerNotFoundError extends Error {
  constructor() {
    super("No se encontró información de cliente");
    this.name = "CustomerNotFoundError";
  }
}

export class GasStationNotFoundError extends Error {
  constructor() {
    super("No se encontró información de estación de servicio");
    this.name = "GasStationNotFoundError";
  }
}

export class NoRoleAssignedError extends Error {
  constructor() {
    super("El usuario no tiene rol asignado");
    this.name = "NoRoleAssignedError";
  }
}

export class UserRegistrationError extends Error {
  constructor() {
    super("Este correo ya está en uso");
    this.name = "UserRegistrationError";
  }
}