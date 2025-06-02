export class NetworkError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(original: any) {
    super(`Error de red: ${original.message || original}`);
    this.name = "NetworkError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string){
    super(message)
    this.name = "NoItemsFound"
  }
}