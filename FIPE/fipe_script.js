// Função para aplicar a máscara de dinheiro no campo de valor máximo
$(document).ready(function() {
    $('#valorMaximo').maskMoney({
        prefix: 'R$ ',
        thousands: '.',
        decimal: ','
    });
    
    $('#mediaKmAno').maskMoney({
        suffix: ' KM',
        thousands: '.',
        decimal: '',
        precision: 0
    });
});

// Função para lidar com mudanças nos checkboxes de versão
function handleCheckboxChange(checkbox) {
    const modeloDiv = checkbox.closest('.modelo');
    const checkboxes = modeloDiv.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
}

// Função para lidar com mudanças nos checkboxes da tabela FIPE
function handleTabelaFipeChange(checkbox) {
    const checkboxes = document.querySelectorAll('input[name="tabela_fipe[]"]');
    
    checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
}

// Função para adicionar novo modelo
function addModelo() {
    const form = document.getElementById('carForm');
    const newModelo = document.createElement('div');
    newModelo.classList.add('modelo');
    newModelo.innerHTML = `
        <label>Modelo do carro:</label>
        <input type="text" name="modelo[]" placeholder="Ex: Argo, Wrangler, etc." required>
        <div>
            <label>Ano / Modelo:</label>
            <select name="ano_modelo[]">
                <option value="">Selecione o ano / modelo</option>
                <option value="2024/2024">2024/2024</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2025/2025">2025/2025</option>
                <option value="2025/2026">2025/2026</option>
                <option value="2026/2026">2026/2026</option>
                <option value="2026/2027">2026/2027</option>
            </select>
        </div>
        <label>Selecione as versões que são válidas para oferta:</label>
        <div>
            <input type="checkbox" name="versao_todas[]" value="todas" onchange="handleCheckboxChange(this)"> Todas as versões
        </div>
        <div>
            <input type="checkbox" name="versao_exceto[]" value="exceto" onchange="handleCheckboxChange(this)"> Exceto versões:
            <input type="text" name="versao_exceto_text[]" placeholder="Ex: 1.3, Limited Flex, etc.">
        </div>
        <div>
            <input type="checkbox" name="versao_exclusivamente[]" value="exclusivamente" onchange="handleCheckboxChange(this)"> Exclusivamente nas versões:
            <input type="text" name="versao_exclusivamente_text[]" placeholder="Ex: 1.3, Limited Flex, etc.">
        </div>
        
        <button type="button" class="remove-button" onclick="removeModelo(this)">Remover modelo</button>
        <br><br>
    `;
    form.insertBefore(newModelo, form.querySelector('button[onclick="addModelo()"]'));
}

// Função para remover modelo
function removeModelo(button) {
    const modeloDiv = button.closest('.modelo');
    modeloDiv.remove();
}

// Função para gerar o texto final
function gerarTextoFinal() {
    const modelos = document.querySelectorAll('.modelo');
    let textoFinal = 'Ação "Avaliação de até 100% da FIPE no seu seminovo". Condição válida para a compra dos veículos';

    modelos.forEach((modeloDiv, index) => {
        const modelo = modeloDiv.querySelector('input[name="modelo[]"]').value;
        const anoModelo = modeloDiv.querySelector('select[name="ano_modelo[]"]').value;
        const versaoTodasCheckbox = modeloDiv.querySelector('input[name="versao_todas[]"]');
        const versaoExcetoCheckbox = modeloDiv.querySelector('input[name="versao_exceto[]"]');
        const versaoExcetoText = modeloDiv.querySelector('input[name="versao_exceto_text[]"]').value;
        const versaoExclusivamenteCheckbox = modeloDiv.querySelector('input[name="versao_exclusivamente[]"]');
        const versaoExclusivamenteText = modeloDiv.querySelector('input[name="versao_exclusivamente_text[]"]').value;

        textoFinal += ` ${modelo}`;
        textoFinal += ` ${anoModelo}`;
        if (versaoTodasCheckbox.checked) {
            textoFinal += ` (todas as versões)`;
        }
        if (versaoExcetoCheckbox.checked) {
            textoFinal += ` (exceto versões: ${versaoExcetoText})`;
        }
        if (versaoExclusivamenteCheckbox.checked) {
            textoFinal += ` (exclusivamente para versões: ${versaoExclusivamenteText})`;
        }
        textoFinal += ', ';
    });

    // Remove a última vírgula e espaço
    textoFinal = textoFinal.replace(/, $/, '');

    const mesReferencia = document.querySelector('select[name="mes_referencia_fipe"]').value;
    const anoReferencia = document.querySelector('select[name="ano_referencia_fipe"]').value;
    textoFinal += ` faturados na Italiana. O veículo seminovo que atender os critérios abaixo relacionados será avaliado no valor da Tabela FIPE (dados de referência de ${mesReferencia}/${anoReferencia})`;

    const valorMaximoAvaliacao = document.getElementById('valorMaximo').value;
    textoFinal += `, limitado ao valor de ${valorMaximoAvaliacao}. O veículo seminovo deve, necessariamente, enquadrar-se nos seguintes critérios: `;

    const tabelaFipeCheckboxes = document.querySelectorAll('input[name="tabela_fipe[]"]:checked');
    tabelaFipeCheckboxes.forEach((checkbox) => {
        const value = checkbox.value;
        if (value === 'qualquer_marca') {
            textoFinal += `seminovo de qualquer marca`;
        } else if (value === 'fiat_nacional') {
            textoFinal += `Fiat Nacional de qualquer modelo`;
        } else if (value === 'fiat_especifico') {
            const fiatModelo = document.querySelector('input[name="fiat_modelo"]').value;
            textoFinal += `Fiat ${fiatModelo}`;
        } else if (value === 'jeep_nacional') {
            textoFinal += `Jeep Nacional de qualquer modelo`;
        } else if (value === 'jeep_especifico') {
            const jeepModelo = document.querySelector('input[name="jeep_modelo"]').value;
            textoFinal += `Jeep ${jeepModelo}`;
        }
    });

    const anoMinimoFabricacao = document.querySelector('select[name="anoMinimoFabricacao"]').value;
    textoFinal += `, ano de fabricação a partir de ${anoMinimoFabricacao}`;

    const mediaKmAno = document.getElementById('mediaKmAno').value;
    textoFinal += `, com no máximo ${mediaKmAno} rodados por ano (considerando-se a média da quilometragem), em boas condições, pintura original, sem avarias e/ou problemas mecânicos, com todas as revisões de fábrica realizadas nas concessionárias e anotadas no manual e que tenha sido aprovado nos Laudos de Vistoria Veicular (EVC e Cautelar).`;

    const anoIpvaQuitado = document.querySelector('select[name="anoIpvaQuitado"]').value;
    textoFinal += ` O Seminovo dado como parte de pagamento deverá estar com o IPVA ${anoIpvaQuitado} quitado. Caso o cliente opte pela compra de um modelo ou versão de veículo 0KM abaixo do valor atribuído à FIPE do seu veículo usado, lhe será concedido pela concessionária um voucher com o crédito correspondente à diferença entre valor do veículo novo e usado. O crédito deverá ser utilizado, exclusivamente, em serviço e/ou produtos na Concessionária contratada. Essa promoção não contempla a devolução de valor em espécie. Não são elegíveis para essa oferta táxi, veículos importados, veículos comerciais e/ou modificados, veículos blindados, veículos com registros de sinistros, furtos, leilões e recuperados, veículos com avarias presentes, veículos que não tenham passado pelas revisões de fábrica nas concessionárias e anotadas no manual e veículos com qualquer tipo de ônus, débitos, dívidas, encargos, restrições e multas. Caso o automóvel usado na troca esteja em nome de Pessoa Jurídica e o novo automóvel será adquirido por Pessoa Física, deverá ser comprovado esse vínculo. Não são elegíveis à promoção os casos em que o automóvel usado esteja em nome de Pessoa Física diferente daquela que está adquirindo o veículo zero Km. No caso de o veículo usado estar em nome de parente de primeiro grau (esposa/marido/filho, filha/ pai ou mãe), o vínculo dessas pessoas deverá ser comprovado por meio de documentação complementar. Não serão aceitos outros níveis de parentesco que os citados acima.\n`;

    document.getElementById('textoFinal').textContent = textoFinal.trim();
}

// Função para copiar o texto gerado
function copiarTexto() {
    const texto = document.getElementById('textoFinal');
    const textarea = document.createElement('textarea');
    textarea.value = texto.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Texto copiado para a área de transferência.');
}