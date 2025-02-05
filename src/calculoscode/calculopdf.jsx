import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generatePDF = (calcType, result, formData) => {
  const doc = new jsPDF();

  if (calcType === "revisional") {
    doc.text("Cálculo Revisional", 14, 20);

    // Adicionar tabela com os detalhes das parcelas
    doc.text("Detalhamento das Parcelas:", 14, 30);
    const tableData = result.resultadoDetalhado.map((item) => [
      item.parcela,
      `R$ ${item.valorPago}`,
      `R$ ${item.valorCorreto}`,
      `R$ ${item.diferenca}`,
      `R$ ${item.saldoDevedor}`,
      `R$ ${item.saldoDevedorCorreto}`,
    ]);

    doc.autoTable({
      head: [[
        "Parcela",
        "Valor Pago",
        "Valor Correto",
        "Diferença",
        "Saldo Devedor",
        "Saldo Devedor Correto",
      ]],
      body: tableData,
      startY: 40,
    });

    // Adicionar resumo final
    doc.text("Resumo do Cálculo:", 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Pago Incorretamente: R$ ${result.totalPago}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Total Correto: R$ ${result.totalCorreto}`, 14, doc.lastAutoTable.finalY + 30);
    doc.text(`Diferença: R$ ${result.totalDiferenca}`, 14, doc.lastAutoTable.finalY + 40);






  } else if (calcType === "trabalhista") {
    doc.text("Cálculo Trabalhista", 14, 20);
    // Resumo dos resultados
    doc.text("Resumo do Cálculo Trabalhista:", 14, 30);
    doc.text(`Saldo de Salário: R$ ${result.Saldosalário}`, 14, 40);
    doc.text(`Férias Proporcionais: R$ ${result.Feriasproporcionais}`, 14, 50);
    doc.text(`13º Proporcional: R$ ${result.decimoterceiroproporcional}`, 14, 60);
    doc.text(`Multa FGTS: R$ ${result.MultaFGTS}`, 14, 70);
    doc.text(`Total Geral: R$ ${result.Totalcalc}`, 14, 80);

    // Detalhamento completo em tabela
    doc.autoTable({
      head: [["Descrição", "Valor (R$)"]],
      body: [
        ["Saldo de Salário", result.Saldosalário],
        ["Férias Proporcionais", result.Feriasproporcionais],
        ["13º Proporcional", result.decimoterceiroproporcional],
        ["Multa FGTS", result.MultaFGTS],
        ["Total Geral", result.Totalcalc],
      ],
      startY: 90,
    });

  } else if (calcType === "Simulador-Verbas-Extras") {
    doc.text("Cálculo de Horas-Extras e Reflexos", 14, 20);

    // Dados iniciais
    doc.text("Dados do Período e Configuração:", 14, 30);
    doc.text(`Início da relação de trabalho: ${formData.iniciorelacaotrabalho}`, 14, 40);
    doc.text(
      `Período de ocorrência das horas-extras: de ${formData.iniciohorasextras} a ${formData.finalhorasextras}`,
      14,
      50
    );
    doc.text(`Jornada: ${formData.jornadaMensal}`, 14, 60);
    doc.text(`Adicional de hora-extra: ${formData.adicionalporcenthex}%`, 14, 70);

    // Horas extras por dia da semana
    doc.text("Horas-extras por dia da semana:", 14, 80);
    const dias = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];
    const horasPorDia = dias.map((dia) => [
      dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase(),
      formData[dia],
    ]);

    doc.autoTable({
      head: [["Dia da Semana", "Horas-extras"]],
      body: horasPorDia,
      startY: 90,
    });

    // Valor total
    doc.text(
      `Valor total das horas-extras e reflexos: R$ ${result.totalGeral}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Tabelas detalhadas por mês
    doc.text("Memória de Cálculo:", 14, doc.lastAutoTable.finalY + 20);
    const tableData = result.memoriaCalculo.map((mes) => [
      mes.mes,
      `R$ ${mes.salario.toFixed(2)}`,
      mes.horasExtras,
      `R$ ${mes.valorHorasExtras}`,
      `R$ ${mes.reflexoDSR}`,
      `R$ ${mes.fgts}`,
      `R$ ${mes.total}`,
    ]);

    doc.autoTable({
      head: [
        [
          "Mês",
          "Salário",
          "Horas-extras",
          "Valor Horas-extras",
          "Reflexo no DSR",
          "FGTS",
          "Total do Mês",
        ],
      ],
      body: tableData,
      startY: doc.lastAutoTable.finalY + 30,
    });

  // CÁLCULO DE PIS/PASEP
  } else if (calcType === "pisPasep") {
  doc.text("Cálculo PIS/PASEP", 14, 20);

 // Resumo do cálculo
 doc.text("Resumo do Benefício:", 14, 30);
 doc.text(`Ano Base: ${formData.anoBase}`, 14, 40);
 doc.text(`Meses Trabalhados: ${formData.mesesTrabalhados}`, 14, 50);
 doc.text(`Benefício Selecionado: ${formData.beneficio}`, 14, 60);

 // Detalhes do cálculo
 doc.text("Detalhes do Cálculo:", 14, 80);
 doc.text(`Salário Mínimo Base: R$ ${result.baseCalculo}`, 14, 90);
 doc.text(`Tipo de Benefício: ${result.tipoBeneficio}`, 14, 100);
 doc.text(`Total do Benefício: R$ ${result.totalBeneficio}`, 14, 110);



  } else if (calcType === "Apuracao-de-Ponto-Horas-Extras") {
    doc.text("Apuração de Ponto e Horas Extras", 14, 20);

    // Resumo dos resultados
    doc.text("Resumo:", 14, 30);
    doc.text(`Total de Horas Extras: ${result.totalHorasExtras || "N/A"}`, 14, 40);
    doc.text(
      `Valor Total das Horas Extras: R$ ${
        parseFloat(result.totalValorHorasExtras || 0).toFixed(2)
      }`,
      14,
      50
    );

    // Verificar a memória de cálculo antes de gerar a tabela
    if (result.memoriaCalculo && result.memoriaCalculo.length > 0) {
      // Tabela detalhada
      doc.autoTable({
        head: [["Dia", "Horas Extras", "Valor das Horas Extras (R$)"]],
        body: result.memoriaCalculo.map((item) => [
          item.dia || "N/A",
          item.horasExtras || "0",
          parseFloat(item.valorHorasExtras || 0).toFixed(2),
        ]),
        startY: 60,
      });
    } else {
      doc.text("Nenhum registro de horas extras encontrado.", 14, 60);
    }

    // Informações gerais do formulário (se necessário)
    doc.text("Informações Adicionais:", 14, doc.lastAutoTable?.finalY + 20 || 80);
    doc.text(`Salário Base: R$ ${formData.salarioBase || "N/A"}`, 14, doc.lastAutoTable?.finalY + 30 || 90);
    doc.text(`Jornada Mensal: ${formData.jornadaMensal || "N/A"} horas`, 14, doc.lastAutoTable?.finalY + 40 || 100);

  } else if (calcType === "Liquidacao-sentenca-inicial") {
    doc.text("Liquidação de Sentença", 14, 20);

    // Dados gerais
    doc.text("Resumo do Cálculo:", 14, 30);
    doc.text(`Salário Base: R$ ${result.salario}`, 14, 40);
    doc.text(`Período Trabalhado: ${formData.dataInicial} a ${formData.dataFinal}`, 14, 50);
    doc.text(`Meses Trabalhados: ${result.mesesTrabalhados}`, 14, 60);
    doc.text(`Total de Horas Extras: ${result.horasExtrasTotais}`, 14, 70);
    doc.text(`Valor Total das Horas Extras: R$ ${result.valorHorasExtras}`, 14, 80);
    doc.text(`Multa FGTS: R$ ${result.multaFgtsValor}`, 14, 90);
    doc.text(`Total Geral: R$ ${result.totalGeral}`, 14, 100);

    // Tabela detalhada
    doc.autoTable({
      head: [["Descrição", "Valor (R$)"]],
      body: [
        ["Horas Extras Totais", result.horasExtrasTotais],
        ["Valor das Horas Extras", result.valorHorasExtras],
        ["Multa FGTS", result.multaFgtsValor],
        ["Total Geral", result.totalGeral],
      ],
      startY: 110,
    });

  } else if (calcType === "Seguro-desemprego") {
    doc.text("Cálculo do Seguro-Desemprego", 14, 20);

    // Resumo dos resultados
    doc.text("Resumo do Cálculo:", 14, 30);
    doc.text(`Salário Médio: R$ ${result.salario}`, 14, 40);
    doc.text(`Meses Trabalhados: ${result.meses}`, 14, 50);
    doc.text(`Solicitações Anteriores: ${result.solicitacoes}`, 14, 60);
    doc.text(`Valor da Parcela: R$ ${result.valorParcela}`, 14, 70);
    doc.text(`Número de Parcelas: ${result.parcelas}`, 14, 80);
    doc.text(`Total do Benefício: R$ ${result.totalBeneficio}`, 14, 90);

    // Tabela detalhada
    doc.autoTable({
      head: [["Descrição", "Valor (R$)"]],
      body: [
        ["Salário Médio", result.salario],
        ["Meses Trabalhados", result.meses],
        ["Solicitações Anteriores", result.solicitacoes],
        ["Valor da Parcela", result.valorParcela],
        ["Número de Parcelas", result.parcelas],
        ["Total do Benefício", result.totalBeneficio],
      ],
      startY: 100,
    });

  } else if (calcType === "Atualizacao-Debitos-Liquidação-Civil") {
    doc.text("Atualização de Débitos e Liquidação Civil", 14, 20);

    // Dados iniciais
    doc.text("Dados Iniciais:", 14, 30);
    doc.text(`Valor Principal: R$ ${formData?.valorPrincipal || "N/A"}`, 14, 40);
    doc.text(`Data de Início: ${formData?.dataInicioDebito || "N/A"}`, 14, 50);
    doc.text(`Data de Atualização: ${formData?.dataAtualizacao || "N/A"}`, 14, 60);
    doc.text(`Taxa de Juros Mensais: ${formData?.taxaJurosMensais || "N/A"}%`, 14, 70);
    doc.text(`Índice de Correção Monetária: ${formData?.indiceCorrecao || "N/A"}`, 14, 80);

    // Verificar se há resultados para evitar erro
    if (result?.memoriaCalculo && result.memoriaCalculo.length > 0) {
      // Resumo do cálculo
      doc.text("Resumo do Cálculo:", 14, 90);
      doc.text(`Valor Atualizado: R$ ${result.valorAtualizado || "N/A"}`, 14, 100);
      doc.text(`Total de Juros: R$ ${result.totalJuros || "N/A"}`, 14, 110);
      doc.text(`Total de Correção Monetária: R$ ${result.totalCorrecao || "N/A"}`, 14, 120);

      // Tabela detalhada
      doc.autoTable({
        head: [["Mês", "Juros (R$)", "Correção (R$)", "Total do Mês (R$)"]],
        body: result.memoriaCalculo.map((item) => [
          item.mes || "N/A",
          item.juros || "0.00",
          item.correcao || "0.00",
          item.totalMes || "0.00",
        ]),
        startY: 130,
      });
    } else {
      // Exibir mensagem no PDF caso não existam resultados
      doc.text("Nenhum cálculo foi encontrado para exibir.", 14, 90);
    }
  } else if (calcType === "Atualizacao-Debitos-Liquidação-Civil") {
    doc.text("Atualização de Débitos e Liquidação Civil", 14, 20);
  
    // Dados iniciais
    doc.text("Dados Iniciais:", 14, 30);
    doc.text(`Valor Principal: R$ ${result.valorPrincipal}`, 14, 40); // Corrigir o valor principal
    doc.text(`Data de Início: ${formData.dataInicioDebito}`, 14, 50);
    doc.text(`Data de Atualização: ${result.dataAtualizacao}`, 14, 60); // Corrigir a data de atualização
    doc.text(`Taxa de Juros Mensais: ${formData.taxaJurosMensais}%`, 14, 70);
    doc.text(`Índice de Correção Monetária: ${result.indiceCorrecao}`, 14, 80); // Corrigir o índice de correção monetária

    // Detalhamento completo em tabela
    doc.autoTable({
      head: [["Descrição", "Valor (R$)"]],
      body: [
        ["Saldo Salário", result.saldoSalario],
        ["Férias Proporcionais", result.feriasProporcionais],
        ["Décimo Terceiro Proporcional", result.decimoTerceiroProporcional],
        ["Multa FGTS Valor", result.multaFgtsValor],
        ["Total a Pagar", result.totalAPagar],
      ],
      startY: 90,
    });
  



    // Revisão do FGTS
  } else if (calcType === "Revisao-FGTS") {
  doc.text("Revisão do FGTS", 14, 20);

  // Resumo dos resultados
  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Saldo Inicial: R$ ${formData.saldoInicial}`, 14, 40);
  doc.text(`Período: ${formData.periodoInicio} a ${formData.periodoFim}`, 14, 50);
  doc.text(`Taxa de Correção Mensal: ${formData.taxaCorrecao}%`, 14, 60);
  doc.text(`Saldo Atualizado: R$ ${result.saldoAtualizado}`, 14, 70);
  doc.text(`Total de Correção: R$ ${result.totalCorrecao}`, 14, 80);

  // Detalhamento do cálculo
  doc.autoTable({
    head: [["Mês", "Correção (R$)", "Saldo Atualizado (R$)"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      item.correcao,
      item.saldoAtualizado,
    ]),
    startY: 90,
  });




  // PENSÃO ALIMENTÍCIA
  } else if (calcType === "Pensao-Alimenticia") {
  doc.text("Cálculo de Pensão Alimentícia", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Salário Bruto: R$ ${formData.salarioBruto}`, 14, 40);
  doc.text(`Outras Rendas: R$ ${formData.outrasRendas}`, 14, 50);
  doc.text(`Deduções: R$ ${formData.deducoes}`, 14, 60);
  doc.text(`Percentual da Pensão: ${result.percentual}%`, 14, 70);
  doc.text(`Valor Total da Pensão: R$ ${result.valorPensao}`, 14, 80);

  // Detalhamento em tabela
  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Salário Bruto", result.salarioBruto],
      ["Outras Rendas", result.outrasRendas],
      ["Deduções", result.deducoes],
      ["Total Líquido", result.totalLiquido],
      ["Percentual da Pensão", `${result.percentual}%`],
      ["Valor da Pensão", result.valorPensao],
    ],
    startY: 90,
  });




  
  // DISTRATO DE IMÓVEIS
  } else if (calcType === "Distrato-Imoveis") {
  doc.text("Cálculo de Distrato de Imóveis", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Valor do Contrato: R$ ${formData.valorContrato}`, 14, 40);
  doc.text(`Percentual de Retenção: ${formData.percentualRetencao}%`, 14, 50);
  doc.text(`Taxa de Multa Rescisória: ${formData.taxaMultaRescisoria}%`, 14, 60);
  doc.text(`Despesas Administrativas: R$ ${formData.despesasAdministrativas}`, 14, 70);
  doc.text(`Valor Pago pelo Comprador: R$ ${formData.valorPagoComprador}`, 14, 80);

  // Tabela detalhada
  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Valor do Contrato", result.contrato],
      ["Valor da Retenção", result.valorRetencao],
      ["Valor da Multa Rescisória", result.valorMulta],
      ["Despesas Administrativas", result.despesas],
      ["Total de Deduções", result.totalDeducoes],
      ["Valor a Restituir", result.valorRestituir],
    ],
    startY: 90,
  });





// Revisão de Aluguel
// Geração de PDF para Revisão de Aluguel
  } else if (calcType === "Revisao-Alugueis") {
  if (!result || !result.memoriaCalculo || result.memoriaCalculo.length === 0) {
    doc.text("Nenhum cálculo foi encontrado para exibir.", 14, 20);
  } else {
    doc.text("Revisão de Aluguel", 14, 20);
    doc.text(`Valor Atual do Aluguel: R$ ${formData.valorAtualAluguel}`, 14, 30);
    doc.text(`Data de Início: ${formData.dataInicio}`, 14, 40);
    doc.text(`Data Final: ${formData.dataFinal}`, 14, 50);
    doc.text(`Índice de Correção: ${formData.indiceCorrecao}`, 14, 60);
    doc.text(`Reajuste Adicional: ${formData.reajusteAdicional}%`, 14, 70);

    doc.text("Memória de Cálculo:", 14, 80);
    doc.autoTable({
      head: [["Mês", "Correção Monetária (R$)", "Reajuste Adicional (R$)", "Total (R$)"]],
      body: result.memoriaCalculo.map((mes) => [
        mes.mes,
        mes.correcao,
        mes.adicional,
        mes.totalMes,
      ]),
      startY: 90,
    });

    doc.text(`Valor Corrigido: R$ ${result.valorCorrigido}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total de Correções: R$ ${result.totalCorrecao}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Total de Reajustes: R$ ${result.totalReajuste}`, 14, doc.lastAutoTable.finalY + 30);
  }



//
//
// CALCULO HERANCA
  } else if (calcType === "Heranca") {
  doc.text("Cálculo de Herança", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Herança Líquida: R$ ${result.herancaLiquida}`, 14, 40);
  doc.text(`Imposto ITCMD: R$ ${result.impostoValor}`, 14, 50);
  doc.text(`Herança para o Cônjuge: R$ ${result.herancaConjuge}`, 14, 60);
  doc.text(`Herança por Herdeiro: R$ ${result.herancaPorHerdeiro}`, 14, 70);

  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Herança Líquida", result.herancaLiquida],
      ["Imposto ITCMD", result.impostoValor],
      ["Herança para o Cônjuge", result.herancaConjuge],
      ["Herança por Herdeiro", result.herancaPorHerdeiro],
    ],
    startY: 80,
  });






  } else if (calcType === "Divorcio") {
  doc.text("Cálculo de Divórcio", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Bens Líquidos: R$ ${result.bensLiquidos}`, 14, 40);
  doc.text(`Bens para o Cônjuge 1: R$ ${result.bensConjuge}`, 14, 50);
  doc.text(`Bens para o Cônjuge 2: R$ ${result.bensOutroConjuge}`, 14, 60);
  doc.text(`Pensão Alimentícia: R$ ${result.pensaoTotal}`, 14, 70);

  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Bens Líquidos", result.bensLiquidos],
      ["Bens para o Cônjuge 1", result.bensConjuge],
      ["Bens para o Cônjuge 2", result.bensOutroConjuge],
      ["Pensão Alimentícia", result.pensaoTotal],
    ],
    startY: 80,
  });






  } else if (calcType === "Parcelamento-CPC-916") {
  doc.text("Parcelamento de Dívida - Art. 916 CPC", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Entrada (30%): R$ ${result.entrada}`, 14, 40);
  doc.text(`Total de Parcelas: ${result.totalParcelas}`, 14, 50);
  doc.text(`Valor Total das Parcelas: R$ ${result.valorTotalParcelas}`, 14, 60);
  doc.text(`Total de Juros: R$ ${result.totalJuros}`, 14, 70);
  doc.text(`Total de Correção Monetária: R$ ${result.totalCorrecao}`, 14, 80);

  // Tabela detalhada
  doc.autoTable({
    head: [["Parcela", "Juros (R$)", "Correção (R$)", "Valor Parcela (R$)"]],
    body: result.memoriaCalculo.map((item) => [
      item.parcela,
      item.juros,
      item.correcao,
      item.valorParcela,
    ]),
    startY: 90,
  });




} else if (calcType === "Atualizacao-Debitos-Fazenda-Publica") {
  doc.text("Atualização de Débitos - Fazenda Pública", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Valor Original: R$ ${formData.valorPrincipal}`, 14, 40);
  doc.text(`Data do Débito: ${formData.dataInicioDebito}`, 14, 50);
  doc.text(`Data de Atualização: ${formData.dataAtualizacao}`, 14, 60);
  doc.text(`Índice de Correção: ${formData.indiceCorrecao}`, 14, 70);
  doc.text(`Juros Moratórios: R$ ${result.totalJuros}`, 14, 80);
  doc.text(`Correção Monetária: R$ ${result.totalCorrecao}`, 14, 90);
  doc.text(`Multa Moratória: R$ ${result.valorMulta}`, 14, 100);
  doc.text(`Valor Atualizado: R$ ${result.valorAtualizado}`, 14, 110);

  // Tabela detalhada
  doc.autoTable({
    head: [["Mês", "Juros (R$)", "Correção (R$)", "Total Mês (R$)"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      item.juros,
      item.correcao,
      item.totalMes,
    ]),
    startY: 120,
  });




} else if (calcType === "Planejamento-Sucessorio") {
  doc.text("Planejamento Sucessório", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Patrimônio Total: R$ ${result.patrimonioTotal}`, 14, 40);
  doc.text(`Herança Legítima: R$ ${result.herancaLegitima}`, 14, 50);
  doc.text(`Herança Disponível: R$ ${result.herancaDisponivel}`, 14, 60);
  doc.text(`Imposto ITCMD: R$ ${result.impostoItcmd}`, 14, 70);
  doc.text(`Regime de Bens: ${formData.regimeBens}`, 14, 80);
  doc.text(`Direito do Cônjuge: R$ ${result.direitoConjuge}`, 14, 90);
  doc.text(`Valor por Herdeiro: R$ ${result.valorPorHerdeiro}`, 14, 100);

  // Tabela detalhada
  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Patrimônio Total", result.patrimonioTotal],
      ["Herança Legítima", result.herancaLegitima],
      ["Herança Disponível", result.herancaDisponivel],
      ["Imposto ITCMD", result.impostoItcmd],
      ["Direito do Cônjuge", result.direitoConjuge],
      ["Valor por Herdeiro", result.valorPorHerdeiro],
    ],
    startY: 110,
  });





} else if (calcType === "Planejamento-Concessao-Revisao-RGPS") {
  doc.text("Planejamento, Concessão, Revisão e Restabelecimento [RGPS]", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Tipo de Benefício: ${formData.tipoBeneficio}`, 14, 40);
  doc.text(`Salário Médio de Contribuição: R$ ${formData.salarioMedio}`, 14, 50);
  doc.text(`Tempo de Contribuição: ${formData.tempoContribuicao} anos`, 14, 60);
  doc.text(`Idade Atual: ${formData.idade} anos`, 14, 70);
  doc.text(`Fator Previdenciário: ${formData.fatorPrevidenciario}`, 14, 80);
  doc.text(`Percentual de Revisão: ${formData.percentualRevisao}%`, 14, 90);
  doc.text(`Contribuição Mensal Total: R$ ${result.contribuicaoTotal}`, 14, 100);
  doc.text(`Valor Inicial do Benefício: R$ ${result.valorBeneficio}`, 14, 110);
  doc.text(`Valor do Benefício Após Revisão: R$ ${result.revisaoValor}`, 14, 120);

  // Tabela detalhada
  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Salário Médio", formData.salarioMedio],
      ["Tempo de Contribuição", formData.tempoContribuicao + " anos"],
      ["Idade", formData.idade + " anos"],
      ["Fator Previdenciário", formData.fatorPrevidenciario],
      ["Percentual de Revisão", formData.percentualRevisao + "%"],
      ["Contribuição Total", result.contribuicaoTotal],
      ["Valor Inicial do Benefício", result.valorBeneficio],
      ["Valor Após Revisão", result.revisaoValor],
    ],
    startY: 130,
  });




} else if (calcType === "Restituicao-INSS-Acima-Teto") {
  doc.text("Restituição de INSS acima do teto", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Salário Total: R$ ${formData.salarioTotal}`, 14, 40);
  doc.text(`Contribuição Total ao INSS: R$ ${formData.contribuicaoTotal}`, 14, 50);
  doc.text(`Teto Máximo do INSS: R$ ${formData.tetoINSS}`, 14, 60);
  doc.text(`Contribuição Permitida: R$ ${result.contribuicaoPermitida}`, 14, 70);
  doc.text(`Valor Restituível: R$ ${result.valorRestituicao}`, 14, 80);

  // Tabela detalhada
  doc.autoTable({
    head: [["Descrição", "Valor (R$)"]],
    body: [
      ["Salário Total", result.salarioTotal],
      ["Contribuição Total", result.contribuicaoTotal],
      ["Teto INSS", result.tetoINSS],
      ["Contribuição Permitida", result.contribuicaoPermitida],
      ["Valor a Restituir", result.valorRestituicao],
    ],
    startY: 90,
  });


} else if (calcType === "Analise-Previdenciaria-Rapida") {
  doc.text("Análise Previdenciária Rápida", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Regra Escolhida: ${result.regraEscolhida}`, 14, 40);
  doc.text(`Idade Atual: ${result.idadeAtual}`, 14, 50);
  doc.text(`Tempo de Contribuição Atual: ${result.tempoContribuicaoAtual} anos`, 14, 60);
  doc.text(`Pontos Atuais: ${result.pontosAtuais}`, 14, 70);
  doc.text(`Idade Faltante: ${result.idadeFaltante} anos`, 14, 80);
  doc.text(`Tempo Faltante: ${result.tempoFaltante} anos`, 14, 90);
  doc.text(`Benefício Estimado: R$ ${result.beneficioEstimado}`, 14, 100);

  // Tabela detalhada
  doc.autoTable({
    head: [["Descrição", "Valor"]],
    body: [
      ["Regra Escolhida", result.regraEscolhida],
      ["Idade Atual", result.idadeAtual],
      ["Tempo de Contribuição Atual", result.tempoContribuicaoAtual],
      ["Pontos Atuais", result.pontosAtuais],
      ["Idade Faltante", result.idadeFaltante],
      ["Tempo Faltante", result.tempoFaltante],
      ["Benefício Estimado", `R$ ${result.beneficioEstimado}`],
    ],
    startY: 110,
  });




} else if (calcType === "Analise-BPC-LOAS") {
  doc.text("Análise de Requisitos do BPC/LOAS", 14, 20);

  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Idade do Requerente: ${result.idadeAtual} anos`, 14, 40);
  doc.text(`Renda Per Capita Familiar: R$ ${result.rendaPerCapita}`, 14, 50);
  doc.text(`Limite Máximo de Renda Per Capita: R$ ${result.limiteRendaPerCapita}`, 14, 60);
  doc.text(`Elegível ao Benefício: ${result.elegivel ? "Sim" : "Não"}`, 14, 70);
  doc.text(`Motivo: ${result.motivoElegibilidade}`, 14, 80);

  // Tabela detalhada
  doc.autoTable({
    head: [["Descrição", "Valor"]],
    body: [
      ["Idade do Requerente", `${result.idadeAtual} anos`],
      ["Renda Per Capita", `R$ ${result.rendaPerCapita}`],
      ["Limite de Renda", `R$ ${result.limiteRendaPerCapita}`],
      ["Elegibilidade", result.elegivel ? "Aprovado" : "Negado"],
      ["Motivo", result.motivoElegibilidade],
    ],
    startY: 90,
  });




} else if (calcType === "Liquidacao-Sentenca-Previdenciaria") {
  doc.text("Liquidação de Sentença Previdenciária", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo:", 14, 30);
  doc.text(`Valor Atualizado: R$ ${result.valorAtualizado}`, 14, 40);
  doc.text(`Total de Juros: R$ ${result.totalJuros}`, 14, 50);
  doc.text(`Total da Correção: R$ ${result.totalCorrecao}`, 14, 60);

  // Tabela detalhada
  doc.autoTable({
    head: [["Mês", "Benefício Original", "Correção", "Juros", "Total do Mês"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      `R$ ${item.beneficioOriginal}`,
      `R$ ${item.correcao}`,
      `R$ ${item.juros}`,
      `R$ ${item.totalMes}`,
    ]),
    startY: 70,
  });




} else if (calcType === "Contribuicoes-Atraso") {
  doc.text("Cálculo de Contribuições em Atraso", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo:", 14, 30);
  doc.text(`Valor Atualizado: R$ ${result.valorAtualizado}`, 14, 40);
  doc.text(`Total de Juros: R$ ${result.totalJuros}`, 14, 50);
  doc.text(`Total da Correção: R$ ${result.totalCorrecao}`, 14, 60);

  // Tabela detalhada
  doc.autoTable({
    head: [["Mês", "Contribuição Original", "Correção", "Juros", "Total do Mês"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      `R$ ${item.contribuicaoOriginal}`,
      `R$ ${item.correcao}`,
      `R$ ${item.juros}`,
      `R$ ${item.totalMes}`,
    ]),
    startY: 70,
  });





} else if (calcType === "Complementacao-Previdenciaria") {
  doc.text("Cálculo de Complementação Previdenciária", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo:", 14, 30);
  doc.text(`Valor Corrigido: R$ ${result.valorCorrigido}`, 14, 40);
  doc.text(`Total da Correção: R$ ${result.totalCorrecao}`, 14, 50);
  doc.text(`Total de Contribuição Corrigida: R$ ${result.totalContribuicao}`, 14, 60);

  // Tabela detalhada
  doc.autoTable({
    head: [["Mês", "Contribuição Original", "Correção", "Contribuição Corrigida", "Total"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      `R$ ${item.contribuicaoOriginal}`,
      `R$ ${item.correcao}`,
      `R$ ${item.contribuicaoCorrigida}`,
      `R$ ${item.totalMes}`,
    ]),
    startY: 70,
  });





} else if (calcType === "RPPS-Uniao-Planejamento-Concessao-Revisao") {
  doc.text("Cálculo RPPS União - Planejamento, Concessão e Revisão", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo:", 14, 30);
  doc.text(`Valor Corrigido: R$ ${result.valorCorrigido}`, 14, 40);
  doc.text(`Total da Correção: R$ ${result.totalCorrecao}`, 14, 50);
  doc.text(`Total de Contribuição Corrigida: R$ ${result.totalContribuicao}`, 14, 60);

  // Tabela detalhada
  doc.autoTable({
    head: [["Mês", "Contribuição Original", "Correção", "Contribuição Corrigida", "Total"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      `R$ ${item.contribuicaoOriginal}`,
      `R$ ${item.correcao}`,
      `R$ ${item.contribuicaoCorrigida}`,
      `R$ ${item.totalMes}`,
    ]),
    startY: 70,
  });





} else if (calcType === "RPPS-Estados-Planejamento-Concessao-Revisao") {
  doc.text("Cálculo RPPS Estados - Planejamento, Concessão e Revisão", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo:", 14, 30);
  doc.text(`Estado: ${formData.estado}`, 14, 40);
  doc.text(`Valor Corrigido: R$ ${result.valorCorrigido}`, 14, 50);
  doc.text(`Total da Correção: R$ ${result.totalCorrecao}`, 14, 60);
  doc.text(`Total de Contribuição Corrigida: R$ ${result.totalContribuicao}`, 14, 70);

  // Tabela detalhada
  doc.autoTable({
    head: [["Mês", "Contribuição Original", "Correção", "Contribuição Corrigida", "Total"]],
    body: result.memoriaCalculo.map((item) => [
      item.mes,
      `R$ ${item.contribuicaoOriginal}`,
      `R$ ${item.correcao}`,
      `R$ ${item.contribuicaoCorrigida}`,
      `R$ ${item.totalMes}`,
    ]),
    startY: 80,
  });


} else if (calcType === "RPPS-Municipios-Planejamento-Concessao-Revisao") {
    doc.text("RPPS Municípios - Planejamento, Concessão e Revisão", 14, 20);

    // Dados gerais
    doc.text(`Estado: ${formData.estado}`, 14, 30);
    doc.text(`Município: ${formData.municipio}`, 14, 40);
    doc.text(`Tipo de Planejamento: ${formData.tipoPlanejamento}`, 14, 50);
    doc.text(`Data de Início da Contribuição: ${formData.dataInicioContribuicao}`, 14, 60);
    doc.text(`Data Final da Contribuição: ${formData.dataFinalContribuicao}`, 14, 70);
    doc.text(`Valor de Contribuição Atual: R$ ${formData.valorContribuicaoAtual}`, 14, 80);
    doc.text(`Índice de Correção: ${formData.indiceCorrecao}`, 14, 90);
    doc.text(`Tempo de Contribuição: ${formData.tempoContribuicao} anos`, 14, 100);
    doc.text(`Alíquota Previdenciária: ${formData.aliquotaPrevidenciaria}%`, 14, 110);

    // Resultados
    doc.text(`Valor Corrigido: R$ ${result.valorCorrigido}`, 14, 120);
    doc.text(`Total de Correção: R$ ${result.totalCorrecao}`, 14, 130);
    doc.text(`Total de Contribuição: R$ ${result.totalContribuicao}`, 14, 140);

    // Tabela detalhada
    doc.autoTable({
      head: [["Mês", "Contribuição Original", "Correção", "Contribuição Corrigida", "Total do Mês"]],
      body: result.memoriaCalculo.map((item) => [
        item.mes,
        `R$ ${item.contribuicaoOriginal}`,
        `R$ ${item.correcao}`,
        `R$ ${item.contribuicaoCorrigida}`,
        `R$ ${item.totalMes}`,
      ]),
      startY: 150,
    });



    // Superendividamento - Direito Bancário
} else if (calcType === "Superendividamento") {
  doc.text("Cálculo de Superendividamento", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo do Cálculo:", 14, 30);
  doc.text(`Renda Disponível: R$ ${result.rendaDisponivel}`, 14, 40);
  doc.text(`Percentual da Renda Comprometida: ${result.percentualComprometido}%`, 14, 50);
  doc.text(`Nova Parcela Refinanciada: R$ ${result.novaParcela}`, 14, 60);
  doc.text(`Total Pago após Refinanciamento: R$ ${result.totalPago}`, 14, 70);

  doc.autoTable({
    head: [["Descrição", "Valor"]],
    body: [
      ["Renda Disponível", `R$ ${result.rendaDisponivel}`],
      ["% da Renda Comprometida", `${result.percentualComprometido}%`],
      ["Nova Parcela Refinanciada", `R$ ${result.novaParcela}`],
      ["Total Pago no Refinanciamento", `R$ ${result.totalPago}`],
    ],
    startY: 80,
  });




// Revisão da RMC e RCC com HISCRE
 {/* } else if (calcType === "Revisao-RMC-RCC") {
  doc.text("Revisão da RMC e RCC", 14, 20);

  // Resumo do cálculo
  doc.text("Resumo da Revisão:", 14, 30);
  doc.text(`Parcela Revisada: R$ ${result.parcelaCorrigida}`, 14, 40);
  doc.text(`Total Pago com Correção: R$ ${result.totalPagoCorrigido}`, 14, 50);
  doc.text(`Diferença por Parcela: R$ ${result.diferencaParcela}`, 14, 60);
  doc.text(`Total da Diferença: R$ ${result.totalDiferenca}`, 14, 70);

  if (result.extratoParcelas?.length > 0) {
    doc.text("Detalhamento do HISCRE:", 14, 80);
    doc.autoTable({
      head: [["Parcela", "Valor Pago", "Juros Cobrados"]],
      body: result.extratoParcelas.map((item) => [
        item.parcela,
        `R$ ${item.valorPago.toFixed(2)}`,
        `R$ ${item.jurosCobrados.toFixed(2)}`,
      ]),
      startY: 90,
    });
  } */}
  


}
  doc.save("calculo.pdf");
};

