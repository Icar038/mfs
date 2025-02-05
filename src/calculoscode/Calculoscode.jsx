import { format } from "date-fns";
import * as XLSX from "xlsx";
//
//
//
export const calculateRevisional = (data) => {
  const { valorPrincipal, taxaJuros, taxaJuroscorreta, parcelas, amortizacao } = data;

  const resultadoDetalhado = [];
  let saldoDevedor = parseFloat(valorPrincipal);
  let saldoDevedorCorreto = parseFloat(valorPrincipal);

  const taxaMensal = parseFloat(taxaJuros) / 100;
  const taxaMensalCorreta = parseFloat(taxaJuroscorreta) / 100;

  let totalPago = 0;
  let totalCorreto = 0;
  let totalDiferenca = 0;

  if (amortizacao === "price") {
    const coeficiente = (taxaMensal * Math.pow(1 + taxaMensal, parcelas)) / (Math.pow(1 + taxaMensal, parcelas) - 1);
    const coeficienteCorreto = (taxaMensalCorreta * Math.pow(1 + taxaMensalCorreta, parcelas)) / (Math.pow(1 + taxaMensalCorreta, parcelas) - 1);

    const valorParcela = saldoDevedor * coeficiente;
    const valorParcelaCorreta = saldoDevedorCorreto * coeficienteCorreto;

    for (let i = 1; i <= parcelas; i++) {
      const juros = saldoDevedor * taxaMensal;
      const amortizacao = valorParcela - juros;
      saldoDevedor -= amortizacao;

      const jurosCorretos = saldoDevedorCorreto * taxaMensalCorreta;
      const amortizacaoCorreta = valorParcelaCorreta - jurosCorretos;
      saldoDevedorCorreto -= amortizacaoCorreta;

      const diferenca = valorParcela - valorParcelaCorreta;

      totalPago += valorParcela;
      totalCorreto += valorParcelaCorreta;
      totalDiferenca += diferenca;

      resultadoDetalhado.push({
        parcela: i,
        valorPago: valorParcela.toFixed(2),
        valorCorreto: valorParcelaCorreta.toFixed(2),
        diferenca: diferenca.toFixed(2),
        saldoDevedor: saldoDevedor.toFixed(2),
        saldoDevedorCorreto: saldoDevedorCorreto.toFixed(2),
      });
    }
  } else if (amortizacao === "sac") {
    const amortizacaoMensal = saldoDevedor / parcelas;
    const amortizacaoMensalCorreta = saldoDevedorCorreto / parcelas;

    for (let i = 1; i <= parcelas; i++) {
      const juros = saldoDevedor * taxaMensal;
      const valorParcela = amortizacaoMensal + juros;
      saldoDevedor -= amortizacaoMensal;

      const jurosCorretos = saldoDevedorCorreto * taxaMensalCorreta;
      const valorParcelaCorreta = amortizacaoMensalCorreta + jurosCorretos;
      saldoDevedorCorreto -= amortizacaoMensalCorreta;

      const diferenca = valorParcela - valorParcelaCorreta;

      totalPago += valorParcela;
      totalCorreto += valorParcelaCorreta;
      totalDiferenca += diferenca;

      resultadoDetalhado.push({
        parcela: i,
        valorPago: valorParcela.toFixed(2),
        valorCorreto: valorParcelaCorreta.toFixed(2),
        diferenca: diferenca.toFixed(2),
        saldoDevedor: saldoDevedor.toFixed(2),
        saldoDevedorCorreto: saldoDevedorCorreto.toFixed(2),
      });
    }
  }

  return {
    resultadoDetalhado,
    totalPago: totalPago.toFixed(2),
    totalCorreto: totalCorreto.toFixed(2),
    totalDiferenca: totalDiferenca.toFixed(2),
  };
};



//
//
//
//TRABALHISTA
export const calculateTrabalhista = (data) => {
  const {
    salarioBruto,
    datacontratacao,
    datademissao,
    "Motivo-trabalhista": motivo,
    "Aviso-previo": avisoPrevio,
    "Dependentes": dependentes,
    "FGTS-antes-contratação": saldoFgts,
    "Ferias-vencidas": feriasVencidas,
  } = data;

  // 1. Saldo de Salário
  const diasTrabalhados = (new Date(datademissao) - new Date(datacontratacao)) / (1000 * 60 * 60 * 24);
  const salarioDiario = salarioBruto / 30;
  const saldoSalario = diasTrabalhados * salarioDiario;

  // 2. Férias Proporcionais e Adquiridas
  const feriasProporcionais = salarioBruto / 12; // 1 mês proporcional
  const adicionalFerias = feriasVencidas > 0 ? feriasVencidas * (salarioBruto / 3) : 0;
  const totalFerias = feriasProporcionais + adicionalFerias;

  // 3. 13º Salário Proporcional
  const decimoTerceiroProporcional = (salarioBruto / 12) * (diasTrabalhados / 30);

  // 4. FGTS e Multa Rescisória
  const fgtsDepositado = salarioBruto * 0.08; // 8% do salário
  const multaFgts = saldoFgts * 0.4; // Multa de 40% do saldo

  // 5. Total Geral
  const total = saldoSalario + totalFerias + decimoTerceiroProporcional + multaFgts;

  return {
    Saldosalário: saldoSalario.toFixed(2),
    Feriasproporcionais: totalFerias.toFixed(2),
    decimoterceiroproporcional: decimoTerceiroProporcional.toFixed(2),
    MultaFGTS: multaFgts.toFixed(2),
    Totalcalc: total.toFixed(2),
  };
};





//
//
//
// CALCULAR PIS/PASEP
export const calculatePisPasep = (data) => {
  const { anoBase, mesesTrabalhados, beneficio } = data;

  // Validar os campos obrigatórios
  if (!anoBase || !mesesTrabalhados || !beneficio) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // Regras de valores para o cálculo
  const salarioMinimo = 1320; // Exemplo: Salário mínimo atual (pode ser atualizado conforme necessário)
  const valorMesTrabalhadoPis = salarioMinimo / 12; // Base por mês trabalhado para o PIS
  const valorMesTrabalhadoPasep = (salarioMinimo * 1.1) / 12; // Exemplo: Base ajustada para PASEP (10% maior)

  let totalBeneficio;

  // Diferenciar cálculos com base no tipo de benefício
  if (beneficio === "PIS") {
    totalBeneficio = valorMesTrabalhadoPis * mesesTrabalhados;
  } else if (beneficio === "PASEP") {
    totalBeneficio = valorMesTrabalhadoPasep * mesesTrabalhados;
  } else {
    throw new Error("Tipo de benefício inválido.");
  }

  return {
    totalBeneficio: totalBeneficio.toFixed(2),
    baseCalculo: salarioMinimo.toFixed(2),
    tipoBeneficio: beneficio,
  };
};





//
//
//
//HORAS_EXTRAS
export const calculateHorasExtras = (data) => {
  const {
    iniciorelacaotrabalho,
    iniciohorasextras,
    finalhorasextras,
    jornadaMensal,
    adicionalporcenthex,
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO,
  } = data;

  const diasPorSemana = {
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO,
  };

  const adicional = parseFloat(adicionalporcenthex) / 100;
  const horasMensais = parseFloat(jornadaMensal?.replace("h", "")) || 0;

  if (horasMensais === 0) {
    throw new Error("Jornada mensal não pode ser zero.");
  }

  let totalHorasExtras = 0;
  let memoriaCalculo = [];
  let totalGeral = 0;

  // Converter período de ocorrência em meses
  const inicio = new Date(iniciohorasextras);
  const fim = new Date(finalhorasextras);
  const mesesOcorrencia = [];

  for (let d = new Date(inicio); d <= fim; d.setMonth(d.getMonth() + 1)) {
    mesesOcorrencia.push(new Date(d));
  }

  mesesOcorrencia.forEach((mes) => {
    const anoMes = format(mes, "MMM yyyy");
    const salarioMes = parseFloat(data[`salario-${anoMes}`]) || 0;

    console.log(`Salário para ${anoMes}: ${salarioMes}`); // Debugging log

    if (salarioMes === 0) {
      throw new Error(`Salário mensal para ${anoMes} não pode ser zero.`);
    }

    const salarioHora = salarioMes / horasMensais * (1 + adicional);

    if (salarioHora === 0) {
      throw new Error("Salário por hora não pode ser zero.");
    }

    // Calcular as horas extras do mês
    let horasExtrasMes = 0;
    let reflexoDSR = 0;
    let totalMes = 0;
    let diasUteis = 22; // Supondo média de dias úteis no mês
    let diasRepouso = 6;

    Object.entries(diasPorSemana).forEach(([dia, horas]) => {
      const [h, m] = horas.split(":").map(Number);
      const horasDia = h + m / 60;
      horasExtrasMes += horasDia * diasUteis / 6; // Aproximar com base nos dias úteis
    });

    const valorHorasExtras = horasExtrasMes * salarioHora;
    reflexoDSR = (valorHorasExtras / diasUteis) * diasRepouso;
    const fgts = valorHorasExtras * 0.08;

    totalMes = valorHorasExtras + reflexoDSR + fgts;

    memoriaCalculo.push({
      mes: mes.toLocaleString("pt-BR", { month: "long", year: "numeric" }),
      salario: salarioMes,
      horasExtras: horasExtrasMes.toFixed(2),
      valorHorasExtras: valorHorasExtras.toFixed(2),
      reflexoDSR: reflexoDSR.toFixed(2),
      fgts: fgts.toFixed(2),
      total: totalMes.toFixed(2),
    });

    totalHorasExtras += valorHorasExtras;
    totalGeral += totalMes;
  });

  console.log("Memória de Cálculo:", memoriaCalculo); // Debugging log

  return {
    memoriaCalculo,
    totalHorasExtras: totalHorasExtras.toFixed(2),
    totalGeral: totalGeral.toFixed(2),
  };
};





//
//
//
//RESISÃOTRABALHISTA
export const calculateRecisaoTrab = (data) => {
  const {
    salarioBase,
    dataAdmissao,
    dataDemissao,
    tipoRescisao,
    saldoFGTS,
    multaFGTS,
    diasTrabalhados,
  } = data;

  const salarioDia = salarioBase / 30;

  // Saldo de salário
  const saldoSalario = salarioDia * diasTrabalhados;

  // Férias proporcionais
  const mesesTrabalhados = Math.floor(
    (new Date(dataDemissao) - new Date(dataAdmissao)) / (1000 * 60 * 60 * 24 * 30)
  );
  const feriasProporcionais = (salarioBase / 12) * mesesTrabalhados;

  // Décimo terceiro proporcional
  const decimoTerceiroProporcional = (salarioBase / 12) * mesesTrabalhados;

  // Multa FGTS
  const multaFgtsValor =
    tipoRescisao === "semJustaCausa" ? saldoFGTS * (multaFGTS / 100) : 0;

  // Total a pagar
  const totalAPagar =
    saldoSalario + feriasProporcionais + decimoTerceiroProporcional + multaFgtsValor;

  return {
    saldoSalario,
    feriasProporcionais,
    decimoTerceiroProporcional,
    multaFgtsValor,
    totalAPagar,
  };
};




export const calculateApuracaodePontoHorasExtras = (data) => {
  const { jornadaMensal, adicionalHorasExtras, salarioBase, ...ponto } = data;

  // Validações de entrada
  if (!jornadaMensal || !adicionalHorasExtras || !salarioBase) {
    throw new Error("Por favor, preencha todos os campos obrigatórios.");
  }

  const horasMensais = parseFloat(jornadaMensal);
  const adicional = parseFloat(adicionalHorasExtras) / 100;
  const salario = parseFloat(salarioBase);

  // Valor da hora trabalhada
  const valorHora = salario / horasMensais;

  let totalHorasExtras = 0;
  let memoriaCalculo = [];

  // Calcular as horas extras para cada dia da semana
  Object.keys(ponto).forEach((key) => {
    if (key.includes("-entrada")) {
      const dia = key.split("-")[0];
      const entrada = ponto[key];
      const saida = ponto[`${dia}-saida`];

      if (entrada && saida) {
        const [hEntrada, mEntrada] = entrada.split(":").map(Number);
        const [hSaida, mSaida] = saida.split(":").map(Number);

        // Calcula as horas trabalhadas
        const horasTrabalhadas =
          hSaida + mSaida / 60 - (hEntrada + mEntrada / 60);

        // Horas extras (trabalhadas - jornada padrão diária)
        const horasExtras = horasTrabalhadas - 8;

        if (horasExtras > 0) {
          totalHorasExtras += horasExtras;

          memoriaCalculo.push({
            dia,
            horasExtras: horasExtras.toFixed(2),
            valorHorasExtras: (horasExtras * valorHora * (1 + adicional)).toFixed(2),
          });
        }
      }
    }
  });

  const totalValorHorasExtras = memoriaCalculo.reduce(
    (acc, item) => acc + parseFloat(item.valorHorasExtras),
    0
  );

  return {
    memoriaCalculo,
    totalHorasExtras: totalHorasExtras.toFixed(2),
    totalValorHorasExtras: totalValorHorasExtras.toFixed(2),
  };
};




//
//
//
// CÁLCULO DE LIQUIDAÇÃO DE SENTENÇA
export const calculateLiquidacaosentencainicial = (data) => {
  const {
    salarioBase,
    dataInicial,
    dataFinal,
    adicionalHorasExtras,
    horasExtrasSemanais,
    multaFgts,
  } = data;

  const salario = parseFloat(salarioBase) || 0;
  const adicional = parseFloat(adicionalHorasExtras) / 100 || 0;
  const horasSemanais = parseFloat(horasExtrasSemanais) || 0;
  const multaFgtsPorcentagem = parseFloat(multaFgts) / 100 || 0;

  if (!salario || !dataInicial || !dataFinal) {
    throw new Error("Salário, período inicial e final são obrigatórios.");
  }

  // Calcular o período em meses
  const inicio = new Date(dataInicial);
  const fim = new Date(dataFinal);
  const mesesTrabalhados = Math.ceil(
    (fim - inicio) / (1000 * 60 * 60 * 24 * 30)
  );

  // Salário por hora
  const salarioHora = salario / 220;

  // Horas extras totais
  const horasExtrasTotais = horasSemanais * 4 * mesesTrabalhados;

  // Valor das horas extras
  const valorHorasExtras = horasExtrasTotais * salarioHora * (1 + adicional);

  // Multa FGTS
  const multaFgtsValor = valorHorasExtras * multaFgtsPorcentagem;

  // Total geral
  const totalGeral = valorHorasExtras + multaFgtsValor;

  return {
    salario,
    mesesTrabalhados,
    horasExtrasTotais: horasExtrasTotais.toFixed(2),
    valorHorasExtras: valorHorasExtras.toFixed(2),
    multaFgtsValor: multaFgtsValor.toFixed(2),
    totalGeral: totalGeral.toFixed(2),
  };
};



//
//
//
// CÁLCULO DE SEGURO-DESEMPREGO
export const calculateSeguroDesemprego = (data) => {
  const { salarioMedio, mesesTrabalhados, numeroSolicitacoes } = data;

  const salario = parseFloat(salarioMedio) || 0;
  const meses = parseInt(mesesTrabalhados) || 0;
  const solicitacoes = parseInt(numeroSolicitacoes) || 0;

  if (!salario || !meses || !solicitacoes) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // Tabelas de faixas salariais e cálculos
  const faixa1 = 1980.90; // Valor da 1ª faixa
  const faixa2 = 2476.35; // Valor da 2ª faixa
  const tetoSeguro = 2811.60; // Teto do benefício

  let valorParcela = 0;

  if (salario <= faixa1) {
    valorParcela = salario * 0.8; // 80% do salário
  } else if (salario <= faixa2) {
    valorParcela = 1584.72 + (salario - faixa1) * 0.5; // 50% da diferença
  } else {
    valorParcela = tetoSeguro; // Valor máximo
  }

  // Determinar o número de parcelas
  let parcelas = 0;

  if (solicitacoes === 1) {
    if (meses >= 12) {
      parcelas = 5;
    } else if (meses >= 6) {
      parcelas = 4;
    }
  } else if (solicitacoes === 2) {
    if (meses >= 9) {
      parcelas = 5;
    } else if (meses >= 6) {
      parcelas = 4;
    }
  } else if (solicitacoes >= 3) {
    if (meses >= 24) {
      parcelas = 5;
    } else if (meses >= 6) {
      parcelas = 3;
    }
  }

  if (parcelas === 0) {
    throw new Error("O trabalhador não tem direito ao seguro-desemprego.");
  }

  // Total do benefício
  const totalBeneficio = valorParcela * parcelas;

  return {
    salario,
    meses,
    solicitacoes,
    valorParcela: valorParcela.toFixed(2),
    parcelas,
    totalBeneficio: totalBeneficio.toFixed(2),
  };
};



//
//
//
// Atualização de Débitos e Liquidação Civil
export const calculateAtualizacaoCivil = (data) => {
  const {
    valorPrincipal,
    dataInicioDebito,
    dataAtualizacao,
    taxaJurosMensais,
    indiceCorrecao,
  } = data;

  // Converter os valores recebidos em números válidos
  const valor = parseFloat(valorPrincipal) || 0;
  const jurosMensais = parseFloat(taxaJurosMensais) / 100 || 0;

  if (!valor || !dataInicioDebito || !dataAtualizacao || !indiceCorrecao) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const dataInicio = new Date(dataInicioDebito);
  const dataFinal = new Date(dataAtualizacao);

  if (dataInicio >= dataFinal) {
    throw new Error("A data de atualização deve ser posterior à data de início.");
  }

  // Calcular o número de meses entre as datas
  const diffTime = Math.abs(dataFinal - dataInicio);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

  // Índices de correção monetária simulados
  const indices = {
    IPCA: 0.005, // Exemplo: 0.5% ao mês
    INPC: 0.004, // Exemplo: 0.4% ao mês
    IGPM: 0.006, // Exemplo: 0.6% ao mês
  };

  const correcaoMensal = indices[indiceCorrecao] || 0;

  let valorAtualizado = valor;
  let memoriaCalculo = [];
  let totalJuros = 0;
  let totalCorrecao = 0;

  for (let i = 1; i <= diffMonths; i++) {
    // Calcular os juros e a correção do mês
    const juros = valorAtualizado * jurosMensais;
    const correcao = valorAtualizado * correcaoMensal;

    // Atualizar o valor total
    valorAtualizado += juros + correcao;

    // Registrar os valores na memória de cálculo
    memoriaCalculo.push({
      mes: i,
      juros: juros.toFixed(2),
      correcao: correcao.toFixed(2),
      totalMes: valorAtualizado.toFixed(2),
    });

    // Somar os totais de juros e correção
    totalJuros += juros;
    totalCorrecao += correcao;
  }

  return {
    valorAtualizado: valorAtualizado.toFixed(2),
    memoriaCalculo,
    totalJuros: totalJuros.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
  };
};



//
//
//
// Revisão do FGTS
export const calculateRevisaoFGTS = (data) => {
  const { saldoInicial, periodoInicio, periodoFim, taxaCorrecao } = data;

  if (!saldoInicial || !periodoInicio || !periodoFim || !taxaCorrecao) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const saldo = parseFloat(saldoInicial);
  const taxaMensal = parseFloat(taxaCorrecao) / 100;
  const dataInicio = new Date(periodoInicio);
  const dataFinal = new Date(periodoFim);

  if (dataInicio >= dataFinal) {
    throw new Error("A data final deve ser posterior à data de início.");
  }

  const meses = Math.ceil(
    (dataFinal - dataInicio) / (1000 * 60 * 60 * 24 * 30)
  );

  let saldoAtualizado = saldo;
  let memoriaCalculo = [];

  for (let i = 1; i <= meses; i++) {
    const correcao = saldoAtualizado * taxaMensal;
    saldoAtualizado += correcao;

    memoriaCalculo.push({
      mes: i,
      correcao: correcao.toFixed(2),
      saldoAtualizado: saldoAtualizado.toFixed(2),
    });
  }

  return {
    saldoAtualizado: saldoAtualizado.toFixed(2),
    totalCorrecao: memoriaCalculo.reduce(
      (acc, cur) => acc + parseFloat(cur.correcao),
      0
    ).toFixed(2),
    memoriaCalculo,
  };
};



//
//
//
// CÁLCULO DE PENSÃO ALIMENTÍCIA
export const calculatePensaoAlimenticia = (data) => {
  const {
    salarioBruto,
    percentualPensao,
    outrasRendas,
    deducoes,
  } = data;

  // Validação dos campos
  if (!salarioBruto || !percentualPensao) {
    throw new Error("Salário bruto e percentual da pensão são obrigatórios.");
  }

  // Convertendo os valores para cálculo
  const salario = parseFloat(salarioBruto) || 0;
  const percentual = parseFloat(percentualPensao) / 100 || 0;
  const rendasAdicionais = parseFloat(outrasRendas) || 0;
  const descontos = parseFloat(deducoes) || 0;

  // Cálculo do total bruto
  const totalBruto = salario + rendasAdicionais;

  // Aplicando descontos
  const totalLiquido = totalBruto - descontos;

  if (totalLiquido <= 0) {
    throw new Error("O valor líquido não pode ser negativo ou zero.");
  }

  // Cálculo da pensão alimentícia
  const valorPensao = totalLiquido * percentual;

  return {
    salarioBruto: salario.toFixed(2),
    outrasRendas: rendasAdicionais.toFixed(2),
    deducoes: descontos.toFixed(2),
    totalLiquido: totalLiquido.toFixed(2),
    percentual: (percentual * 100).toFixed(2),
    valorPensao: valorPensao.toFixed(2),
  };
};



//
//
//
// CÁLCULO DE DISTRATO DE IMÓVEIS
export const calculateDistratoImoveis = (data) => {
  const {
    valorContrato,
    percentualRetencao,
    taxaMultaRescisoria,
    despesasAdministrativas,
    valorPagoComprador,
  } = data;

  // Validação dos campos
  if (!valorContrato || !percentualRetencao || !taxaMultaRescisoria || !valorPagoComprador) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
  }

  // Convertendo os valores para cálculo
  const contrato = parseFloat(valorContrato) || 0;
  const retencao = parseFloat(percentualRetencao) / 100 || 0;
  const multaRescisoria = parseFloat(taxaMultaRescisoria) / 100 || 0;
  const despesas = parseFloat(despesasAdministrativas) || 0;
  const pagoComprador = parseFloat(valorPagoComprador) || 0;

  // Cálculo dos valores
  const valorRetencao = contrato * retencao;
  const valorMulta = contrato * multaRescisoria;
  const totalDeducoes = valorRetencao + valorMulta + despesas;
  const valorRestituir = Math.max(0, pagoComprador - totalDeducoes);

  return {
    contrato: contrato.toFixed(2),
    valorRetencao: valorRetencao.toFixed(2),
    valorMulta: valorMulta.toFixed(2),
    despesas: despesas.toFixed(2),
    totalDeducoes: totalDeducoes.toFixed(2),
    valorRestituir: valorRestituir.toFixed(2),
  };
};



//
//
//
// REVISÃO DE ALUGUEL
export const calculateRevisaoAluguel = (data) => {
  const { valorAtualAluguel, dataInicio, dataFinal, indiceCorrecao, reajusteAdicional } = data;

  // Verifica se os campos obrigatórios foram preenchidos
  if (!valorAtualAluguel || !dataInicio || !dataFinal || !indiceCorrecao) {
    throw new Error("Todos os campos são obrigatórios para o cálculo.");
  }

  // Conversão dos valores
  const valorInicial = parseFloat(valorAtualAluguel) || 0;
  const reajustePercentual = parseFloat(reajusteAdicional) / 100 || 0;

  // Simulação dos índices de correção (valores fictícios, deve ser atualizado conforme necessidade)
  const indices = {
    IPCA: 0.005, // 0.5% ao mês
    INPC: 0.004, // 0.4% ao mês
    IGPM: 0.006, // 0.6% ao mês
  };

  const taxaCorrecao = indices[indiceCorrecao] || 0;

  // Cálculo do número de meses entre as datas
  const inicio = new Date(dataInicio);
  const final = new Date(dataFinal);
  const diffTime = Math.abs(final - inicio);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Aproximação de meses

  let valorCorrigido = valorInicial;
  let memoriaCalculo = [];

  for (let i = 1; i <= diffMonths; i++) {
    const correcao = valorCorrigido * taxaCorrecao;
    const reajuste = valorCorrigido * reajustePercentual;
    valorCorrigido += correcao + reajuste;

    memoriaCalculo.push({
      mes: i,
      correcao: correcao.toFixed(2),
      reajuste: reajuste.toFixed(2),
      totalMes: valorCorrigido.toFixed(2),
    });
  }

  return {
    valorCorrigido: valorCorrigido.toFixed(2),
    memoriaCalculo,
    totalCorrecao: memoriaCalculo.reduce((acc, cur) => acc + parseFloat(cur.correcao), 0).toFixed(2),
    totalReajuste: memoriaCalculo.reduce((acc, cur) => acc + parseFloat(cur.reajuste), 0).toFixed(2),
  };
};



//
//
//
//CALCULO DE HERANÇA
export const calculateHeranca = (data) => {
  const { valorHeranca, dividas, impostoITCMD, numHerdeiros, regimeBens, percentualConjuge } = data;

  const valorTotal = parseFloat(valorHeranca) || 0;
  const totalDividas = parseFloat(dividas) || 0;
  const imposto = parseFloat(impostoITCMD) / 100 || 0;
  const numHerdeirosValidos = parseInt(numHerdeiros) || 1;
  const percentualConjugeValidado = parseFloat(percentualConjuge) / 100 || 0;

  if (valorTotal <= 0 || numHerdeirosValidos <= 0) {
    throw new Error("Os valores de herança e número de herdeiros devem ser positivos.");
  }

  // Cálculo da herança líquida (após dívidas e impostos)
  const impostoValor = valorTotal * imposto;
  const herancaLiquida = valorTotal - totalDividas - impostoValor;

  if (herancaLiquida < 0) {
    throw new Error("O valor da herança líquida não pode ser negativo.");
  }

  let herancaConjuge = 0;
  let herancaPorHerdeiro = 0;

  if (regimeBens === "Comunhão Universal" || regimeBens === "Parcial") {
    herancaConjuge = herancaLiquida * percentualConjugeValidado;
  }

  const restanteHeranca = herancaLiquida - herancaConjuge;
  herancaPorHerdeiro = restanteHeranca / numHerdeirosValidos;

  return {
    herancaLiquida: herancaLiquida.toFixed(2),
    impostoValor: impostoValor.toFixed(2),
    herancaConjuge: herancaConjuge.toFixed(2),
    herancaPorHerdeiro: herancaPorHerdeiro.toFixed(2),
  };
};



//
//
//
//CALCULO DE DIVORCIO
export const calculateDivorcio = (data) => {
  const {
    valorBens,
    dividas,
    regimeBens,
    percentualConjuge,
    salarioPagante,
    numFilhos,
    pensaoPercentual,
    guardaDosFilhos
  } = data;

  const totalBens = parseFloat(valorBens) || 0;
  const totalDividas = parseFloat(dividas) || 0;
  const percentualDivisao = parseFloat(percentualConjuge) / 100 || 0;
  const salarioBasePagante = parseFloat(salarioPagante) || 0;
  const percentualPensao = parseFloat(pensaoPercentual) / 100 || 0;
  const filhos = parseInt(numFilhos) || 0;

  if (totalBens <= 0) {
    throw new Error("O valor total dos bens deve ser positivo.");
  }

  if (filhos > 0 && salarioBasePagante <= 0) {
    throw new Error("É necessário informar o salário do pagante para calcular a pensão.");
  }

  // Valor dos bens líquidos (subtrai dívidas)
  const bensLiquidos = totalBens - totalDividas;

  if (bensLiquidos < 0) {
    throw new Error("O valor líquido dos bens não pode ser negativo.");
  }

  let bensConjuge = 0;
  let bensOutroConjuge = 0;

  // Divisão conforme regime de bens
  if (regimeBens === "Comunhão Universal") {
    bensConjuge = bensLiquidos / 2;
    bensOutroConjuge = bensLiquidos / 2;
  } else if (regimeBens === "Parcial") {
    bensConjuge = bensLiquidos * percentualDivisao;
    bensOutroConjuge = bensLiquidos - bensConjuge;
  } else {
    bensConjuge = bensLiquidos; // Separação total: um dos cônjuges mantém os bens
    bensOutroConjuge = 0;
  }

  // Cálculo da pensão alimentícia
  let pensaoTotal = 0;
  if (filhos > 0 && guardaDosFilhos === "Conjuge 1") {
    pensaoTotal = salarioBasePagante * percentualPensao;
  } else if (filhos > 0 && guardaDosFilhos === "Conjuge 2") {
    pensaoTotal = salarioBasePagante * percentualPensao;
  }

  return {
    bensLiquidos: bensLiquidos.toFixed(2),
    bensConjuge: bensConjuge.toFixed(2),
    bensOutroConjuge: bensOutroConjuge.toFixed(2),
    pensaoTotal: pensaoTotal.toFixed(2),
  };
};



//
//
//
// Parcelamento CPC 916
export const calculateParcelamentoCPC916 = (data) => {
  const {
    valorDivida,
    jurosMensais,
    indiceCorrecao,
    numeroParcelas,
  } = data;

  const totalDivida = parseFloat(valorDivida) || 0;
  const taxaJuros = parseFloat(jurosMensais) / 100 || 0;
  const parcelas = parseInt(numeroParcelas) || 0;

  if (totalDivida <= 0 || parcelas <= 0) {
    throw new Error("O valor da dívida e o número de parcelas devem ser positivos.");
  }
  
  if (parcelas > 6) {
    throw new Error("O parcelamento pelo art. 916 do CPC permite no máximo 6 parcelas.");
  }

  // Valor da entrada obrigatória de 30%
  const entrada = totalDivida * 0.3;

  // Saldo restante após a entrada
  let saldoParcelado = totalDivida - entrada;

  // Índices de correção (simulação)
  const indices = {
    IPCA: 0.005,  // 0.5% ao mês
    INPC: 0.004,  // 0.4% ao mês
    IGPM: 0.006,  // 0.6% ao mês
  };

  const correcaoMensal = indices[indiceCorrecao] || 0;
  let memoriaCalculo = [];
  let totalJuros = 0;
  let totalCorrecao = 0;
  let valorTotalParcelas = 0;

  // Cálculo das parcelas restantes com juros e correção monetária
  for (let i = 1; i <= parcelas; i++) {
    const juros = saldoParcelado * taxaJuros;
    const correcao = saldoParcelado * correcaoMensal;
    const valorParcela = (saldoParcelado / parcelas) + juros + correcao;

    totalJuros += juros;
    totalCorrecao += correcao;
    valorTotalParcelas += valorParcela;

    memoriaCalculo.push({
      parcela: i,
      juros: juros.toFixed(2),
      correcao: correcao.toFixed(2),
      valorParcela: valorParcela.toFixed(2),
    });
  }

  return {
    entrada: entrada.toFixed(2),
    totalParcelas: parcelas,
    valorTotalParcelas: valorTotalParcelas.toFixed(2),
    totalJuros: totalJuros.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    memoriaCalculo,
  };
};



//
//
//
// Atualizacao Fazenda
export const calculateAtualizacaoFazenda = (data) => {
  const {
    valorPrincipal,
    dataInicioDebito,
    dataAtualizacao,
    indiceCorrecao,
    taxaJurosMensais,
    multaPercentual,
  } = data;

  const valor = parseFloat(valorPrincipal) || 0;
  const jurosMensais = parseFloat(taxaJurosMensais) / 100 || 0;
  const multa = parseFloat(multaPercentual) / 100 || 0;

  if (!valor || !dataInicioDebito || !dataAtualizacao || !indiceCorrecao) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const dataInicio = new Date(dataInicioDebito);
  const dataFinal = new Date(dataAtualizacao);

  if (dataInicio >= dataFinal) {
    throw new Error("A data de atualização deve ser posterior à data de início.");
  }

  // Obter o número total de meses entre as datas
  const diffTime = Math.abs(dataFinal - dataInicio);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

  // Índices de correção monetária (exemplos)
  const indices = {
    IPCA: 0.005, // 0.5% ao mês
    INPC: 0.004, // 0.4% ao mês
    IGPM: 0.006, // 0.6% ao mês
    SELIC: 0.007, // 0.7% ao mês
    TR: 0.003, // 0.3% ao mês
  };

  const correcaoMensal = indices[indiceCorrecao] || 0;

  let valorAtualizado = valor;
  let memoriaCalculo = [];
  let totalJuros = 0;
  let totalCorrecao = 0;

  for (let i = 1; i <= diffMonths; i++) {
    const juros = valorAtualizado * jurosMensais;
    const correcao = valorAtualizado * correcaoMensal;

    valorAtualizado += juros + correcao;
    totalJuros += juros;
    totalCorrecao += correcao;

    memoriaCalculo.push({
      mes: i,
      juros: juros.toFixed(2),
      correcao: correcao.toFixed(2),
      totalMes: valorAtualizado.toFixed(2),
    });
  }

  // Aplicação de multa (se houver)
  const valorMulta = valor * multa;
  valorAtualizado += valorMulta;

  return {
    valorAtualizado: valorAtualizado.toFixed(2),
    memoriaCalculo,
    totalJuros: totalJuros.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    valorMulta: valorMulta.toFixed(2),
  };
};



//
//
//
// Planejamento Sucessorio
export const calculatePlanejamentoSucessorio = (data) => {
  const {
    valorPatrimonio,
    quantidadeHerdeiros,
    percentualDisponivel,
    percentualLegitima,
    regimeBens,
    percentualItcmd,
  } = data;

  const patrimonioTotal = parseFloat(valorPatrimonio) || 0;
  const herdeiros = parseInt(quantidadeHerdeiros) || 1;
  const itcmd = parseFloat(percentualItcmd) / 100 || 0;
  const legitima = parseFloat(percentualLegitima) / 100 || 0;
  const disponivel = parseFloat(percentualDisponivel) / 100 || 0;

  if (!patrimonioTotal || !herdeiros || !regimeBens) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // Cálculo do ITCMD sobre o patrimônio total
  const impostoItcmd = patrimonioTotal * itcmd;

  // Cálculo da herança legítima (parte obrigatória para herdeiros necessários)
  const herancaLegitima = patrimonioTotal * legitima;

  // Cálculo da parte disponível (pode ser destinada por testamento)
  const herancaDisponivel = patrimonioTotal * disponivel;

  // Divisão entre herdeiros
  const valorPorHerdeiro = herancaLegitima / herdeiros;

  // Adaptação ao regime de bens
  let direitoConjuge = 0;
  if (regimeBens === "Comunhão Parcial") {
    direitoConjuge = patrimonioTotal * 0.5;
  } else if (regimeBens === "Comunhão Universal") {
    direitoConjuge = patrimonioTotal;
  } else if (regimeBens === "Separação Total") {
    direitoConjuge = 0;
  }

  return {
    patrimonioTotal: patrimonioTotal.toFixed(2),
    herancaLegitima: herancaLegitima.toFixed(2),
    herancaDisponivel: herancaDisponivel.toFixed(2),
    impostoItcmd: impostoItcmd.toFixed(2),
    direitoConjuge: direitoConjuge.toFixed(2),
    valorPorHerdeiro: valorPorHerdeiro.toFixed(2),
  };
};



//
//
//
// Previdencia RGPS
export const calculatePrevidenciaRGPS = (data) => {
  const {
    tipoBeneficio,
    salarioMedio,
    tempoContribuicao,
    idade,
    fatorPrevidenciario,
    percentualRevisao,
    contribuicaoMensal,
  } = data;

  const salario = parseFloat(salarioMedio) || 0;
  const tempo = parseInt(tempoContribuicao) || 0;
  const idadeAtual = parseInt(idade) || 0;
  const fator = parseFloat(fatorPrevidenciario) || 1;
  const percentualRev = parseFloat(percentualRevisao) / 100 || 0;
  const contribuicao = parseFloat(contribuicaoMensal) || 0;

  if (!salario || !tempo || !tipoBeneficio) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  let valorBeneficio = 0;

  if (tipoBeneficio === "Aposentadoria Por Idade") {
    valorBeneficio = salario * 0.7 + (tempo * 0.01 * salario);
  } else if (tipoBeneficio === "Aposentadoria Por Tempo de Contribuição") {
    valorBeneficio = salario * fator;
  } else if (tipoBeneficio === "Aposentadoria Especial") {
    valorBeneficio = salario;
  } else if (tipoBeneficio === "Pensão Por Morte") {
    valorBeneficio = salario * 0.6;
  } else if (tipoBeneficio === "Auxílio-Doença") {
    valorBeneficio = salario * 0.91;
  }

  const revisaoValor = valorBeneficio * (1 + percentualRev);
  const contribuicaoTotal = contribuicao * tempo;

  return {
    valorBeneficio: valorBeneficio.toFixed(2),
    revisaoValor: revisaoValor.toFixed(2),
    contribuicaoTotal: contribuicaoTotal.toFixed(2),
  };
};


//
//
//
// Restituicao INSS
export const calculateRestituicaoINSS = (data) => {
  const { salarioTotal, contribuicaoTotal, tetoINSS } = data;

  const salario = parseFloat(salarioTotal) || 0;
  const contribuicao = parseFloat(contribuicaoTotal) || 0;
  const teto = parseFloat(tetoINSS) || 0;

  if (!salario || !contribuicao || !teto) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // Cálculo da contribuição máxima permitida
  const contribuicaoPermitida = teto * 12;

  // Valor passível de restituição
  const valorRestituicao = contribuicao > contribuicaoPermitida ? contribuicao - contribuicaoPermitida : 0;

  return {
    salarioTotal: salario.toFixed(2),
    contribuicaoTotal: contribuicao.toFixed(2),
    tetoINSS: teto.toFixed(2),
    contribuicaoPermitida: contribuicaoPermitida.toFixed(2),
    valorRestituicao: valorRestituicao.toFixed(2),
  };
};



//
//
//
// Analise Previdenciaria
export const calculateAnalisePrevidenciaria = (data) => {
  const { idade, tempoContribuicao, regraEscolhida, salarioMedio } = data;

  const idadeAtual = parseInt(idade) || 0;
  const tempoContribuicaoAtual = parseInt(tempoContribuicao) || 0;
  const salarioBase = parseFloat(salarioMedio) || 0;

  if (!idadeAtual || !tempoContribuicaoAtual || !regraEscolhida || !salarioBase) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // Definição das regras de aposentadoria (exemplo simplificado)
  const regrasAposentadoria = {
    "Regra 85/95 Progressiva": { idadeMinima: 0, tempoMinimo: 0, pontosNecessarios: 95 },
    "Idade Mínima Progressiva": { idadeMinima: 62, tempoMinimo: 15 },
    "Tempo de Contribuição": { idadeMinima: 0, tempoMinimo: 35 },
  };

  const regra = regrasAposentadoria[regraEscolhida];

  if (!regra) {
    throw new Error("Regra de aposentadoria inválida.");
  }

  let elegivel = false;
  let tempoFaltante = 0;
  let idadeFaltante = 0;
  let pontosAtuais = idadeAtual + tempoContribuicaoAtual;

  if (regra.pontosNecessarios) {
    elegivel = pontosAtuais >= regra.pontosNecessarios;
    tempoFaltante = regra.pontosNecessarios - pontosAtuais;
  } else {
    elegivel = idadeAtual >= regra.idadeMinima && tempoContribuicaoAtual >= regra.tempoMinimo;
    idadeFaltante = regra.idadeMinima - idadeAtual;
    tempoFaltante = regra.tempoMinimo - tempoContribuicaoAtual;
  }

  // Cálculo da aposentadoria estimada (exemplo simplificado)
  const percentualBeneficio = tempoContribuicaoAtual >= 35 ? 1 : tempoContribuicaoAtual / 35;
  const beneficioEstimado = salarioBase * percentualBeneficio;

  return {
    elegivel,
    regraEscolhida,
    tempoContribuicaoAtual,
    idadeAtual,
    pontosAtuais,
    idadeFaltante: idadeFaltante > 0 ? idadeFaltante : 0,
    tempoFaltante: tempoFaltante > 0 ? tempoFaltante : 0,
    beneficioEstimado: beneficioEstimado.toFixed(2),
  };
};



//
//
//
// BPC LOAS
export const calculateBPCLOAS = (data) => {
  const { idade, rendaFamiliarTotal, numeroMembrosFamilia, possuiDeficiencia } = data;

  const idadeAtual = parseInt(idade) || 0;
  const rendaFamiliar = parseFloat(rendaFamiliarTotal) || 0;
  const membrosFamilia = parseInt(numeroMembrosFamilia) || 1; // Evita divisão por zero
  const temDeficiencia = possuiDeficiencia === "sim";

  if (!idadeAtual || !rendaFamiliar || !membrosFamilia) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // Cálculo da renda per capita
  const rendaPerCapita = rendaFamiliar / membrosFamilia;

  // O critério básico para concessão do BPC é renda per capita inferior a 1/4 do salário mínimo
  const salarioMinimo = 1412.00; // Valor atualizado do salário mínimo
  const limiteRendaPerCapita = salarioMinimo / 4; 

  // Verificação da elegibilidade
  const elegivelIdade = idadeAtual >= 65;
  const elegivelRenda = rendaPerCapita <= limiteRendaPerCapita;
  const elegivelDeficiencia = temDeficiencia;

  let elegivel = elegivelIdade || elegivelDeficiencia; // Pode ser concedido por idade ou deficiência
  elegivel = elegivel && elegivelRenda; // Precisa cumprir o critério de renda

  return {
    idadeAtual,
    rendaPerCapita: rendaPerCapita.toFixed(2),
    limiteRendaPerCapita: limiteRendaPerCapita.toFixed(2),
    elegivel,
    motivoElegibilidade: elegivel
      ? "Atende aos critérios de renda e condição"
      : "Não atende aos critérios exigidos",
  };
};



//
//
//
// Liquidacao Sentenca Previdenciaria
export const calculateLiquidacaoSentencaPrevidenciaria = (data) => {
  const {
    dataInicioBeneficio,
    dataFimBeneficio,
    valorMensalBeneficio,
    indiceCorrecao,
    jurosMoratorios,
  } = data;

  const valorBase = parseFloat(valorMensalBeneficio) || 0;

  if (!dataInicioBeneficio || !dataFimBeneficio || valorBase <= 0) {
    throw new Error("Todos os campos são obrigatórios e o valor do benefício deve ser maior que zero.");
  }

  const inicio = new Date(dataInicioBeneficio);
  const fim = new Date(dataFimBeneficio);

  if (inicio >= fim) {
    throw new Error("A data de término deve ser posterior à data de início.");
  }

  // Dicionário de índices de correção monetária (exemplo de valores)
  const indicesCorrecao = {
    IPCA: 0.005, // 0.5% ao mês
    INPC: 0.004, // 0.4% ao mês
    IGPM: 0.006, // 0.6% ao mês
  };

  const taxaCorrecao = indicesCorrecao[indiceCorrecao] || 0;
  const taxaJuros = parseFloat(jurosMoratorios) / 100 || 0;

  let memoriaCalculo = [];
  let valorAtualizado = 0;
  let totalJuros = 0;
  let totalCorrecao = 0;

  // Loop para calcular mês a mês
  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    let correcao = valorBase * taxaCorrecao;
    let juros = (valorBase + correcao) * taxaJuros;

    valorAtualizado += valorBase + correcao + juros;
    totalCorrecao += correcao;
    totalJuros += juros;

    memoriaCalculo.push({
      mes: dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      beneficioOriginal: valorBase.toFixed(2),
      correcao: correcao.toFixed(2),
      juros: juros.toFixed(2),
      totalMes: (valorBase + correcao + juros).toFixed(2),
    });

    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return {
    valorAtualizado: valorAtualizado.toFixed(2),
    totalJuros: totalJuros.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    memoriaCalculo,
  };
};



//
//
//
// Contribuicoes Atraso
export const calculateContribuicoesAtraso = (data) => {
  const {
    dataInicioContribuicao,
    dataFimContribuicao,
    tipoContribuinte,
    valorBase,
    indiceCorrecao,
    jurosMoratorios,
  } = data;

  const valor = parseFloat(valorBase) || 0;
  if (!dataInicioContribuicao || !dataFimContribuicao || valor <= 0) {
    throw new Error("Todos os campos são obrigatórios e o valor base deve ser maior que zero.");
  }

  const inicio = new Date(dataInicioContribuicao);
  const fim = new Date(dataFimContribuicao);

  if (inicio >= fim) {
    throw new Error("A data final deve ser posterior à data inicial.");
  }

  // Índices de correção monetária (exemplo de valores)
  const indices = {
    IPCA: 0.005, // 0.5% ao mês
    INPC: 0.004, // 0.4% ao mês
    IGPM: 0.006, // 0.6% ao mês
  };

  const taxaCorrecao = indices[indiceCorrecao] || 0;
  const taxaJuros = parseFloat(jurosMoratorios) / 100 || 0;

  let memoriaCalculo = [];
  let valorAtualizado = 0;
  let totalJuros = 0;
  let totalCorrecao = 0;

  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    let correcao = valor * taxaCorrecao;
    let juros = (valor + correcao) * taxaJuros;

    valorAtualizado += valor + correcao + juros;
    totalCorrecao += correcao;
    totalJuros += juros;

    memoriaCalculo.push({
      mes: dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      contribuicaoOriginal: valor.toFixed(2),
      correcao: correcao.toFixed(2),
      juros: juros.toFixed(2),
      totalMes: (valor + correcao + juros).toFixed(2),
    });

    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return {
    valorAtualizado: valorAtualizado.toFixed(2),
    totalJuros: totalJuros.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    memoriaCalculo,
  };
};




//
//
//
// Complementacao Previdenciaria
export const calculateComplementacaoPrevidenciaria = (data) => {
  const {
    tipoComplementacao,
    dataInicio,
    dataFinal,
    valorContribuicaoAtual,
    indiceCorrecao,
    aliquotaPrevidenciaria,
  } = data;

  const valor = parseFloat(valorContribuicaoAtual) || 0;
  if (!dataInicio || !dataFinal || valor <= 0 || !aliquotaPrevidenciaria) {
    throw new Error("Todos os campos são obrigatórios e o valor da contribuição deve ser maior que zero.");
  }

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFinal);

  if (inicio >= fim) {
    throw new Error("A data final deve ser posterior à data inicial.");
  }

  // Índices de correção monetária (exemplo de valores)
  const indices = {
    IPCA: 0.005, // 0.5% ao mês
    INPC: 0.004, // 0.4% ao mês
    IGPM: 0.006, // 0.6% ao mês
  };

  const taxaCorrecao = indices[indiceCorrecao] || 0;
  const aliquota = parseFloat(aliquotaPrevidenciaria) / 100 || 0;

  let memoriaCalculo = [];
  let valorCorrigido = 0;
  let totalJuros = 0;
  let totalCorrecao = 0;
  let totalContribuicao = 0;

  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    let correcao = valor * taxaCorrecao;
    let contribuicao = (valor + correcao) * aliquota;

    valorCorrigido += valor + correcao;
    totalContribuicao += contribuicao;
    totalCorrecao += correcao;

    memoriaCalculo.push({
      mes: dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      contribuicaoOriginal: valor.toFixed(2),
      correcao: correcao.toFixed(2),
      contribuicaoCorrigida: contribuicao.toFixed(2),
      totalMes: (valor + correcao + contribuicao).toFixed(2),
    });

    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return {
    valorCorrigido: valorCorrigido.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    totalContribuicao: totalContribuicao.toFixed(2),
    memoriaCalculo,
  };
};



//
//
//
// RPPS Uniao
export const calculateRPPSUniao = (data) => {
  const {
    tipoPlanejamento,
    dataInicioContribuicao,
    dataFinalContribuicao,
    valorContribuicaoAtual,
    indiceCorrecao,
    tempoContribuicao,
    aliquotaPrevidenciaria,
  } = data;

  const valor = parseFloat(valorContribuicaoAtual) || 0;
  if (!dataInicioContribuicao || !dataFinalContribuicao || valor <= 0 || !aliquotaPrevidenciaria) {
    throw new Error("Todos os campos são obrigatórios e o valor da contribuição deve ser maior que zero.");
  }

  const inicio = new Date(dataInicioContribuicao);
  const fim = new Date(dataFinalContribuicao);

  if (inicio >= fim) {
    throw new Error("A data final deve ser posterior à data inicial.");
  }

  // Índices de correção monetária (exemplo de valores)
  const indices = {
    IPCA: 0.005, // 0.5% ao mês
    INPC: 0.004, // 0.4% ao mês
    IGPM: 0.006, // 0.6% ao mês
  };

  const taxaCorrecao = indices[indiceCorrecao] || 0;
  const aliquota = parseFloat(aliquotaPrevidenciaria) / 100 || 0;

  let memoriaCalculo = [];
  let valorCorrigido = 0;
  let totalCorrecao = 0;
  let totalContribuicao = 0;

  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    let correcao = valor * taxaCorrecao;
    let contribuicao = (valor + correcao) * aliquota;

    valorCorrigido += valor + correcao;
    totalContribuicao += contribuicao;
    totalCorrecao += correcao;

    memoriaCalculo.push({
      mes: dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      contribuicaoOriginal: valor.toFixed(2),
      correcao: correcao.toFixed(2),
      contribuicaoCorrigida: contribuicao.toFixed(2),
      totalMes: (valor + correcao + contribuicao).toFixed(2),
    });

    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return {
    valorCorrigido: valorCorrigido.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    totalContribuicao: totalContribuicao.toFixed(2),
    memoriaCalculo,
  };
};




//
//
//
// RPPS Estados
export const calculateRPPSEstados = (data) => {
  const {
    estado,
    tipoPlanejamento,
    dataInicioContribuicao,
    dataFinalContribuicao,
    valorContribuicaoAtual,
    indiceCorrecao,
    tempoContribuicao,
    aliquotaPrevidenciaria,
  } = data;

  const valor = parseFloat(valorContribuicaoAtual) || 0;
  if (!dataInicioContribuicao || !dataFinalContribuicao || valor <= 0 || !aliquotaPrevidenciaria) {
    throw new Error("Todos os campos são obrigatórios e o valor da contribuição deve ser maior que zero.");
  }

  const inicio = new Date(dataInicioContribuicao);
  const fim = new Date(dataFinalContribuicao);

  if (inicio >= fim) {
    throw new Error("A data final deve ser posterior à data inicial.");
  }

  // Índices de correção monetária (exemplo de valores)
  const indices = {
    IPCA: 0.005,
    INPC: 0.004,
    IGPM: 0.006,
  };

  const taxaCorrecao = indices[indiceCorrecao] || 0;
  const aliquota = parseFloat(aliquotaPrevidenciaria) / 100 || 0;

  let memoriaCalculo = [];
  let valorCorrigido = 0;
  let totalCorrecao = 0;
  let totalContribuicao = 0;

  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    let correcao = valor * taxaCorrecao;
    let contribuicao = (valor + correcao) * aliquota;

    valorCorrigido += valor + correcao;
    totalContribuicao += contribuicao;
    totalCorrecao += correcao;

    memoriaCalculo.push({
      mes: dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      contribuicaoOriginal: valor.toFixed(2),
      correcao: correcao.toFixed(2),
      contribuicaoCorrigida: contribuicao.toFixed(2),
      totalMes: (valor + correcao + contribuicao).toFixed(2),
    });

    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return {
    valorCorrigido: valorCorrigido.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    totalContribuicao: totalContribuicao.toFixed(2),
    memoriaCalculo,
  };
};



//
//
//
// RPPS Municipios
export const calculateRPPSMunicipios = (data) => {
  const {
    estado,
    municipio,
    tipoPlanejamento,
    dataInicioContribuicao,
    dataFinalContribuicao,
    valorContribuicaoAtual,
    indiceCorrecao,
    tempoContribuicao,
    aliquotaPrevidenciaria,
  } = data;

  const valor = parseFloat(valorContribuicaoAtual) || 0;
  if (!dataInicioContribuicao || !dataFinalContribuicao || valor <= 0 || !aliquotaPrevidenciaria) {
    throw new Error("Todos os campos são obrigatórios e o valor da contribuição deve ser maior que zero.");
  }

  const inicio = new Date(dataInicioContribuicao);
  const fim = new Date(dataFinalContribuicao);

  if (inicio >= fim) {
    throw new Error("A data final deve ser posterior à data inicial.");
  }

  // Índices de correção monetária (exemplo de valores)
  const indices = {
    IPCA: 0.005,
    INPC: 0.004,
    IGPM: 0.006,
  };

  const taxaCorrecao = indices[indiceCorrecao] || 0;
  const aliquota = parseFloat(aliquotaPrevidenciaria) / 100 || 0;

  let memoriaCalculo = [];
  let valorCorrigido = 0;
  let totalCorrecao = 0;
  let totalContribuicao = 0;

  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    let correcao = valor * taxaCorrecao;
    let contribuicao = (valor + correcao) * aliquota;

    valorCorrigido += valor + correcao;
    totalContribuicao += contribuicao;
    totalCorrecao += correcao;

    memoriaCalculo.push({
      mes: dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      contribuicaoOriginal: valor.toFixed(2),
      correcao: correcao.toFixed(2),
      contribuicaoCorrigida: contribuicao.toFixed(2),
      totalMes: (valor + correcao + contribuicao).toFixed(2),
    });

    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return {
    valorCorrigido: valorCorrigido.toFixed(2),
    totalCorrecao: totalCorrecao.toFixed(2),
    totalContribuicao: totalContribuicao.toFixed(2),
    memoriaCalculo,
  };
};




//
//
//
// SUPERENDIVIDAMENTO - Direito Bancário
export const calculateSuperendividamento = (data) => {
  const {
    rendaMensal,
    totalDividas,
    despesasFixas,
    parcelasRefinanciamento,
    taxaJuros,
  } = data;

  const renda = parseFloat(rendaMensal) || 0;
  const dividas = parseFloat(totalDividas) || 0;
  const despesas = parseFloat(despesasFixas) || 0;
  const parcelas = parseInt(parcelasRefinanciamento) || 1;
  const jurosMensal = parseFloat(taxaJuros) / 100 || 0;

  if (renda === 0 || dividas === 0 || parcelas === 0) {
    throw new Error("Todos os campos devem ser preenchidos corretamente.");
  }

  // Cálculo da capacidade de pagamento (renda líquida disponível)
  const rendaDisponivel = renda - despesas;
  const percentualComprometido = (dividas / renda) * 100;

  // Cálculo do novo valor da parcela com refinanciamento
  const parcelaRefinanciada =
    (dividas * (jurosMensal * Math.pow(1 + jurosMensal, parcelas))) /
    (Math.pow(1 + jurosMensal, parcelas) - 1);

  return {
    rendaDisponivel: rendaDisponivel.toFixed(2),
    percentualComprometido: percentualComprometido.toFixed(2),
    novaParcela: parcelaRefinanciada.toFixed(2),
    totalPago: (parcelaRefinanciada * parcelas).toFixed(2),
  };
};



 {/*
//
//
//
// REVISÃO DA RMC E RCC COM HISCRE
export const calculateRevisaoRMCRCC = (data) => {
  const {
    valorTotalEmprestimo,
    taxaJurosAnual,
    numeroParcelas,
    valorParcelaAtual,
    historicoCredito, // Arquivo enviado pelo usuário
  } = data;

  const valorInicial = parseFloat(valorTotalEmprestimo) || 0;
  const taxaJuros = parseFloat(taxaJurosAnual) / 100 || 0;
  const parcelas = parseInt(numeroParcelas) || 1;
  const parcelaAtual = parseFloat(valorParcelaAtual) || 0;

  if (valorInicial === 0 || parcelas === 0) {
    throw new Error("Todos os campos devem ser preenchidos corretamente.");
  }

  // Se um arquivo foi enviado, processamos os dados
  let extratoParcelas = [];
  if (historicoCredito) {
    const reader = new FileReader();
    const file = historicoCredito;

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        extratoParcelas = data.map((row) => ({
          parcela: row["Parcela"] || 0,
          valorPago: parseFloat(row["Valor Pago"]) || 0,
          jurosCobrados: parseFloat(row["Juros"]) || 0,
        }));

        // Comparação dos valores com o cálculo teórico
        const taxaJurosMensal = Math.pow(1 + taxaJuros, 1 / 12) - 1;
        const parcelaCorrigida =
          (valorInicial * (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, parcelas))) /
          (Math.pow(1 + taxaJurosMensal, parcelas) - 1);

        const totalPagoCorrigido = parcelaCorrigida * parcelas;
        const totalPagoAtual = parcelaAtual * parcelas;
        const totalDiferenca = totalPagoAtual - totalPagoCorrigido;

        resolve({
          extratoParcelas,
          parcelaCorrigida: parcelaCorrigida.toFixed(2),
          totalPagoCorrigido: totalPagoCorrigido.toFixed(2),
          diferencaParcela: (parcelaAtual - parcelaCorrigida).toFixed(2),
          totalDiferenca: totalDiferenca.toFixed(2),
        });
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  return {
    parcelaCorrigida: "Erro ao processar arquivo",
    totalPagoCorrigido: "Erro ao processar arquivo",
    diferencaParcela: "Erro ao processar arquivo",
    totalDiferenca: "Erro ao processar arquivo",
  };
};  */}