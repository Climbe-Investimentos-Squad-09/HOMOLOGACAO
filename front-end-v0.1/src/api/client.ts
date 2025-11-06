//------------------------------------------------------------------------------------------------
//Arquivo central que configura o Axios e exporta a instância única usada pelos outros módulos.
//------------------------------------------------------------------------------------------------

import axios from "../../node_modules/axios/index";

const apiClient = axios.create({
  baseURL:'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

export default apiClient;
