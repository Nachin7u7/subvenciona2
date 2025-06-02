# 🚀 Gasolina Ya

**Gasolina Ya** es una aplicación frontend desarrollada con React + Vite + TypeScript que permite a los usuarios gestionar reservas de combustible en gasolineras mediante un sistema de tickets. Está diseñada para facilitar la coordinación entre los clientes que desean reservar combustible y los administradores de las estaciones que gestionan la disponibilidad del mismo.

---

## ✨ Características principales

- Registro e inicio de sesión para clientes y administradores.
- Gestión de reservas (tickets) de combustible por parte de los clientes.
- Administración de depósitos y disponibilidad de combustible por parte de los administradores.
- Transición de estado de los tickets: `Pendiente`, `Realizado` y `Cancelado`.
- Cancelación de tickets por parte del cliente.
- Confirmación o cancelación de tickets por parte del administrador.
- Simulación de backend mediante `json-server`.

---

## ⚙️ Instalación y ejecución local

> Asegúrate de tener **Node.js** y **npm** instalados en tu sistema.

1. **Clonar el repositorio:**
```bash
 git clone [https://github.com/tu-usuario/gasolina-ya.git](https://github.com/Nachin7u7/subvenciona2.git)
 cd subvenciona2
```
2. **Instalar las dependencias:**
```bash
npm install
```
3. **Ejecutar el proyecto**
```bash
npm run jserver
``` 
```bash
npm run dev
``` 
## 🛠️ Estructura del sistema
Roles de usuario

### 🧑 Cliente

- Se registra e inicia sesión en la plataforma.
- Puede visualizar las disponibilidades de combustible.
- Puede generar un ticket de reserva.
- Puede cancelar sus propios tickets (solo si están en estado `Pendiente`).

### 🛠️ Administrador

- Se registra e inicia sesión en la plataforma.
- Puede añadir depósitos de combustible indicando tipo y fecha de llegada.
- Puede ver todos los tickets creados por los clientes.
- Puede cambiar el estado de un ticket a `Realizado` o `Cancelado`.

---
### Estados del ticket
- `Pendiente`: Ticket creado por un cliente, en espera de confirmación o acción.
- `Realizado`: El ticket fue confirmado y completado por el administrador.
- `Cancelado`: Puede ser cancelado tanto por el cliente como por el administrador.
