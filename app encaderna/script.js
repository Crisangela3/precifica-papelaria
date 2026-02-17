let itensNaProducao = [];
let contadorSegredo = 0;

function adicionarInsumo() {
    const nome = document.getElementById('insumoNome').value;
    const precoT = parseFloat(document.getElementById('insumoPrecoTotal').value);
    const qtdT = parseFloat(document.getElementById('insumoQtdTotal').value);
    const qtdU = parseFloat(document.getElementById('insumoQtdUso').value);

    if (nome && precoT && qtdT && qtdU) {
        const custoReal = (precoT / qtdT) * qtdU;
        itensNaProducao.push({ nome, custo: custoReal, qtdU });
        atualizarInterface();
        limparCamposInsumo();
    } else {
        alert("Ops! Preencha todos os campos do material para calcular.");
    }
}

function atualizarInterface() {
    const lista = document.getElementById('listaProducao');
    lista.innerHTML = "";
    let somaMat = 0;
    itensNaProducao.forEach(item => {
        somaMat += item.custo;
        lista.innerHTML += `<li>${item.nome} <span>R$ ${item.custo.toFixed(2)}</span></li>`;
    });
    document.getElementById('custoMat').innerText = `R$ ${somaMat.toFixed(2)}`;
    
    const tempo = parseFloat(document.getElementById('tempo').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const lucro = parseFloat(document.getElementById('lucro').value) || 0;
    const maoObra = (valorHora / 60) * tempo;
    const subtotal = somaMat + maoObra;
    const total = subtotal + (subtotal * (lucro / 100));
    document.getElementById('precoFinal').innerText = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
}

function limparCamposInsumo() {
    document.getElementById('insumoNome').value = "";
    document.getElementById('insumoPrecoTotal').value = "";
    document.getElementById('insumoQtdTotal').value = "";
    document.getElementById('insumoQtdUso').value = "";
}

function mostrarFormulario() {
    if (itensNaProducao.length === 0) {
        alert("Adicione os materiais primeiro para gerar o orçamento!");
        return;
    }
    document.getElementById('gavetaCadastro').style.display = 'block';
    document.getElementById('btnAtivar').style.display = 'none';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

async function finalizarProcesso() {
    const cli = {
        nome: document.getElementById('cliNome').value,
        whats: document.getElementById('cliWhats').value,
        email: document.getElementById('cliEmail').value,
        prod: document.getElementById('produtoNome').value || "Produto de Papelaria",
        valor: document.getElementById('precoFinal').innerText
    };

    if (!cli.nome || !cli.whats) {
        alert("Por favor, informe seu nome e WhatsApp para receber o orçamento.");
        return;
    }

    let mala = JSON.parse(localStorage.getItem('malaDireta')) || [];
    mala.push({...cli, data: new Date().toLocaleDateString('pt-br')});
    localStorage.setItem('malaDireta', JSON.stringify(mala));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setTextColor(155, 134, 189);
    doc.text("ORÇAMENTO - CRIA DO PAPEL", 20, 20);
    doc.setTextColor(0, 0, 0);
    doc.text(`Cliente: ${cli.nome}`, 20, 40);
    doc.text(`Produto: ${cli.prod}`, 20, 50);
    doc.text(`Valor Estimado: ${cli.valor}`, 20, 60);
    doc.save(`Orcamento_${cli.nome}.pdf`);

    alert("Prontinho! Seu orçamento foi gerado com sucesso.");
    limparTudo();
}

function limparTudo() {
    itensNaProducao = [];
    document.getElementById('listaProducao').innerHTML = "";
    document.getElementById('precoFinal').innerText = "R$ 0,00";
    document.getElementById('custoMat').innerText = "R$ 0,00";
    document.getElementById('gavetaCadastro').style.display = 'none';
    document.getElementById('btnAtivar').style.display = 'block';
    document.querySelectorAll('input').forEach(i => i.value = "");
}

function acessoSegredo() {
    contadorSegredo++;
    if (contadorSegredo === 5) {
        const modal = document.getElementById('modalMala');
        const lista = document.getElementById('listaClientes');
        const dados = JSON.parse(localStorage.getItem('malaDireta')) || [];
        lista.innerHTML = dados.length ? dados.map(c => `<p style='font-size:0.8rem;border-bottom:1px solid #ddd'><b>${c.nome}</b> - ${c.whats}<br><small>${c.prod} (${c.data})</small></p>`).join("") : "Nenhum cliente salvo.";
        modal.style.display = "block";
        contadorSegredo = 0;
    }
}

function fecharMala() { document.getElementById('modalMala').style.display = "none"; }