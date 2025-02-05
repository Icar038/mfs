import axios from "axios";


export async function getCNPJ(cnpj) {

  try {
    const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    return response.data; // Retorna os dados da API
  } catch (error) {
    console.error("Erro ao buscar CNPJ:", error);
    throw error;
  }
}

