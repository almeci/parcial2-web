# Travel Plans API

En el presente repositorio se encuentra implementada una API REST modular construida con NestJS, para gestión de planes de viaje.

## 1. Instalación y ejecución

### 1.1. Requisitos previos

- Node.js >= 18
- npm
- MongoDB Atlas

### 1.2. Instalación

```
npm install
```

### 1.3. Variables de entorno

Crear un archivo .env en la raíz del proyecto con la siguiente variable:

```
MONGODB_URI=mongodb+srv://reviewer:regxjxjInS9EOHwF@cluster0.gxb0tbi.mongodb.net/?appName=Cluster0
```

### 1.4. Ejecución

Ejecutar el siguiente comando:

```
npm start
```

La API estará disponible en http://localhost:3000.

No es necesario crear colecciones ni inicializar la base de datos manualmente ya que se está usando una instancia de MongoDB en la nube.

## 2. Arquitectura interna

### 2.1. CountriesModule (lógica interna)

- No expone controladores ni endpoints públicos.
- Contiene la entidad Country con los campos alphaCode (Alpha-3), name, region, capital, population y flagUrl.
- El CountriesService implementa la lógica de cache, donde busca el país por su código Alpha-3 en la base de datos local (MongoDB). Si no existe, delega la consulta al RestCountriesProvider. Finalmente, almacena el resultado en la base de datos para evitar llamadas externas repetidas.
- El RestCountriesProvider encapsula toda la comunicación con https://restcountries.com/v3.1.
- Exporta CountriesService para ser consumido por otros modulos mediante inyección de dependencias.

### 2.2. TravelPlansModule (interfaz pública)

- Único módulo con endpoints HTTP accesibles por el cliente.
- Importa CountriesModule para validar la existencia del país destino al crear un plan.
- Al ejecutar POST /travel-plans el servicio llama a CountriesService.resolveCountry() antes de persistir el plan para garantizar que el país existe (localmente o mediante la API externa).

### 2.3. Flujo de cache de países

Cuando se crea un plan de viaje, TravelPlansService invoca a CountriesService.resolveCountry() usando el código Alpha-3 del destino. El servicio busca dicho código en la base de datos local. Si el país ya existe, lo retorna directamente sin realizar ninguna llamada externa. Si no existe, delega la consulta al RestCountriesProvider, el cual consulta la API de RestCountries, mapea la respuesta a la entidad Country y la persiste en MongoDB antes de retornarla. Así cualquier consulta posterior al mismo país se resuelve localmente sin depender de la API externa.

## 3. Endpoints con ejemplos de peticiones

### 3.1. Crear un plan de viaje

POST http://localhost:3000/travel-plans

#### Body:

```
{
  "title": "Viaje por Colombia",
  "startDate": "2026-05-14",
  "endDate": "2026-05-30",
  "destinationAlphaCode": "COL",
  "userId": "6a062ecb2bd48f49d1e5c7f0"
}
```

![Crear plan de viaje](<images/Crear plan de viaje.png>)

### 3.2. Listar todos los planes

GET http://localhost:3000/travel-plans

![Listar planes](<images/Listar planes.png>)

### 3.3. Obtener un plan por ID

GET http://localhost:3000/travel-plans/6a062ecb2bd48f49d1e5c7f8

![Obtener un plan](<images/Obtener un plan.png>)

### 3.4. Eliminar un plan

DELETE http://localhost:3000/travel-plans/6a0631042bd48f49d1e5c7fc

![Eliminar plan](<images/Eliminar plan.png>)

### 3.5. Agregar un gasto a un plan

POST http://localhost:3000/travel-plans/6a0630c12bd48f49d1e5c7fa/expenses

#### Body:

```
{
  "description": "Transporte hasta el hotel",
  "amount": 40000,
  "category": "Transporte"
}
```

![Agregar gasto](<images/Agregar gasto.png>)

### 3.6. Crear un usuario

POST http://localhost:3000/users

#### Body:

```
{
  "name": "Camille Briones",
  "email": "camille.briones@email.com"
}
```

![Crear usuario](<images/Crear usuario.png>)

### 3.7. Obtener un usuario por ID

GET http://localhost:3000/users/6a07d20c4afa5caaf4b73a3a

![Obtener usuario](<images/Obtener usuario.png>)

## 4. Reporte de cambios parcial 2

Para agregar un gasto a un plan existente se usa la operación $push de MongoDB que permite insertar un nuevo elemento al final del arreglo expenses sin tener que reemplazar todo el documento. La instruccion findByIdAndUpdate busca el plan por su ID y aplica $push sobre el arreglo embebido en una sola operación, y así los gastos anteriores no se tocan y el nuevo queda almacenado directamente dentro del documento del plan de viaje.
