import axios from 'axios';

const api = axios.create({
  //url base para las peticiones
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json", //indicamos que es en formato json
  },
});

export default api;