import axios from "axios";


export async function getBANK(BANK) {

  try {
    const response = await axios.get(`https://brasilapi.com.br/api/banks/v1`);
    return response.data; // Retorna os dados da API
  } catch (error) {
    console.error("Erro ao buscar Banco:", error);
    throw error;
  }
}


// Buscar estados
export const getEstados = async () => {
  try {
    const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    return [];
  }
};

// Buscar municípios de um estado
export const getMunicipios = async (uf) => {
  try {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar municípios:", error);
    return [];
  }
};


//bahia
const apiUrltjba = "https://api-publica.datajud.cnj.jus.br/api_publica_tjba/_search";
const apiKey = "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";

export async function getProcesstjba(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjba, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}


//alagoas
const apiUrltjal = "https://api-publica.datajud.cnj.jus.br/api_publica_tjal/_search";

export async function getProcesstjal(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}


//sergipe
const apiUrltjse = "https://api-publica.datajud.cnj.jus.br/api_publica_tjse/_search";

export async function getProcesstjse(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjse, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}


//acre
const apiUrltjac = "https://api-publica.datajud.cnj.jus.br/api_publica_tjac/_search";

export async function getProcesstjac(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjac, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}


//amazonia
const apiUrltjam = "https://api-publica.datajud.cnj.jus.br/api_publica_tjam/_search";

export async function getProcesstjam(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjam, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}



//amapa
const apiUrltjap = "https://api-publica.datajud.cnj.jus.br/api_publica_tjap/_search";

export async function getProcesstjap(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjap, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//amapa
const apiUrltjce = "https://api-publica.datajud.cnj.jus.br/api_publica_tjce/_search";

export async function getProcesstjce(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjce, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//distrito federal e territorios
const apiUrltjdft = "https://api-publica.datajud.cnj.jus.br/api_publica_tjdft/_search";

export async function getProcesstjdft(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjdft, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//Espirito Santo
const apiUrltjes = "https://api-publica.datajud.cnj.jus.br/api_publica_tjes/_search";

export async function getProcesstjes(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjes, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//goias
const apiUrltjgo = "https://api-publica.datajud.cnj.jus.br/api_publica_tjgo/_search";

export async function getProcesstjgo(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjgo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//maranhao
const apiUrltjma = "https://api-publica.datajud.cnj.jus.br/api_publica_tjma/_search";

export async function getProcesstjma(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjma, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//minas
const apiUrltjmg = "https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search";

export async function getProcesstjmg(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjmg, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//mt sul
const apiUrltjms = "https://api-publica.datajud.cnj.jus.br/api_publica_tjms/_search";

export async function getProcesstjms(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjms, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}

//mt 
const apiUrltjmt = "https://api-publica.datajud.cnj.jus.br/api_publica_tjmt/_search";

export async function getProcesstjmt(numeroProcesso) {
  try {
    const response = await fetch(apiUrltjmt, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${apiKey}`
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { numeroProcesso: numeroProcesso } },
              { match: { numeroCPF: numeroProcesso } },
              { match: { numeroCNPJ: numeroProcesso } }
            ]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar processo:", error);
    throw error;
  }
}