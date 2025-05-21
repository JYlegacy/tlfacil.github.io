$(document).ready(function() {
    // Initialize mask money
    $('#valorBonus').maskMoney({
        prefix: 'R$ ',
        thousands: '.',
        decimal: ','
    });

    // Event delegation for dynamically added elements
    $(document).on('change', 'input[type="checkbox"]', function() {
        handleCheckboxChange(this);
    });

    $(document).on('click', '.remove-button', function() {
        removeModelo(this);
    });

    // Button event listeners
    $('#addModeloBtn').click(addModelo);
    $('#gerarTextoBtn').click(gerarTextoFinal);
    $('#copiarTextoBtn').click(copiarTexto);
});

function handleCheckboxChange(checkbox) {
    const modeloDiv = $(checkbox).closest('.modelo');
    const checkboxes = modeloDiv.find('input[type="checkbox"]');
    
    checkboxes.each(function() {
        if (this !== checkbox) {
            $(this).prop('checked', false);
        }
    });
}

function addModelo() {
    const newModelo = $(`
        <div class="modelo">            
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
                <input type="checkbox" name="versao_todas[]" value="todas"> Todas as versões
            </div>
            <div>
                <input type="checkbox" name="versao_exceto[]" value="exceto"> Exceto versões:
                <input type="text" name="versao_exceto_text[]" placeholder="Ex: 1.3, Limited Flex, etc.">
            </div>
            <div>
                <input type="checkbox" name="versao_exclusivamente[]" value="exclusivamente"> Exclusivamente nas versões:
                <input type="text" name="versao_exclusivamente_text[]" placeholder="Ex: 1.3, Limited Flex, etc.">
            </div>
            
            <button type="button" class="remove-button">Remover modelo</button>
            <br><br>
        </div>
    `);
    
    $('#carForm').find('#addModeloBtn').before(newModelo);
}

function removeModelo(button) {
    $(button).closest('.modelo').remove();
}

function gerarTextoFinal() {
    let textoFinal = 'Ação "Bônus no Usado". Condição válida para veículos';
    const modelos = $('.modelo');

    modelos.each(function(index) {
        const modelo = $(this).find('input[name="modelo[]"]').val();
        const anoModelo = $(this).find('select[name="ano_modelo[]"]').val();
        
        textoFinal += ` ${modelo}`;
        textoFinal += ` ${anoModelo}`;

        const checkboxTodas = $(this).find('input[name="versao_todas[]"]:checked');
        const checkboxExceto = $(this).find('input[name="versao_exceto[]"]:checked');
        const checkboxExclusivamente = $(this).find('input[name="versao_exclusivamente[]"]:checked');

        if (checkboxTodas.length > 0) {
            textoFinal += ` (todas as versões),`;
        } else if (checkboxExceto.length > 0) {
            const excetoText = $(this).find('input[name="versao_exceto_text[]"]').val();
            textoFinal += ` (exceto versões ${excetoText}),`;
        } else if (checkboxExclusivamente.length > 0) {
            const exclusivamenteText = $(this).find('input[name="versao_exclusivamente_text[]"]').val();
            textoFinal += ` (exclusivamente nas versões ${exclusivamenteText}),`;
        }
    });

    const valorBonus = $('#valorBonus').val();
    textoFinal += ` faturados na Italiana. A concessionária participante avaliará, com base em seus exclusivos critérios, o seminovo do cliente, com valorização a partir de ${valorBonus} na avaliação, que poderá ser usado como parte do pagamento, a depender da avaliação feita pela concessionária. `;

    $('#textoFinal').text(textoFinal);
}

function copiarTexto() {
    const textoFinal = $('#textoFinal').text();

    navigator.clipboard.writeText(textoFinal).then(() => {
        alert('Texto copiado para a área de transferência!');
    }).catch((error) => {
        console.error('Erro ao copiar texto: ', error);
    });
}