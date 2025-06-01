export class NetworkError extends Error {
  constructor(original: any) {
    super("Error de red: " + (original.message || original));
    this.name = "NetworkError";
  }
}