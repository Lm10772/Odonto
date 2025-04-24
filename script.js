document.getElementById('consultaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Pegar os valores do formulário
    const nomePaciente = document.getElementById('nomePaciente').value;
    const procedimento = document.getElementById('procedimento').value;
    const valorConsulta = parseFloat(document.getElementById('valorConsulta').value);
    const dataAtendimento = document.getElementById('dataAtendimento').value;
    const percentualComissao = parseFloat(document.getElementById('percentualComissao').value);

    // Calcular a comissão
    const comissao = (valorConsulta * percentualComissao) / 100;

    // Formatar a data para DD/MM/YYYY
    const dataFormatada = new Date(dataAtendimento).toLocaleDateString('pt-BR');

    // Criar objeto da consulta
    const consulta = {
        data: dataFormatada,
        paciente: nomePaciente,
        procedimento: procedimento,
        valor: valorConsulta.toFixed(2),
        comissao: comissao.toFixed(2)
    };

    // Salvar no localStorage
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));

    // Atualizar a tabela
    atualizarTabela();

    // Limpar o formulário
    this.reset();
    document.getElementById('valorConsulta').value = '0.00';
    document.getElementById('percentualComissao').value = '7';
});

function atualizarTabela() {
    const tbody = document.getElementById('historicoBody');
    const totalComissoesSpan = document.getElementById('totalComissoes');
    tbody.innerHTML = '';

    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    let totalComissoes = 0;

    consultas.forEach((consulta, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${consulta.data}</td>
            <td>${consulta.paciente}</td>
            <td>${consulta.procedimento}</td>
            <td>${consulta.valor}</td>
            <td>${consulta.comissao}</td>
            <td><button class="delete-btn" onclick="excluirConsulta(${index})">Excluir</button></td>
        `;
        tbody.appendChild(row);
        totalComissoes += parseFloat(consulta.comissao);
    });

    totalComissoesSpan.textContent = totalComissoes.toFixed(2);
}

function excluirConsulta(index) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.splice(index, 1); // Remove o registro no índice especificado
    localStorage.setItem('consultas', JSON.stringify(consultas)); // Atualiza o localStorage
    atualizarTabela(); // Atualiza a tabela na tela
}

// Carregar as consultas ao iniciar
window.onload = atualizarTabela;