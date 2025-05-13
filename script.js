// Global variables
let textoFipeInserido = '';
let textoBonusUsadoInserido = '';
const images = [];
let currentIndex = 0;

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready - initializing...');

    // Initialize maskMoney for price and interest fields
    if (typeof $ !== 'undefined' && typeof $.fn.maskMoney !== 'undefined') {
        console.log('jQuery and maskMoney available - initializing...');
        
        $('#priceDE').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });

        $('#pricePOR').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });
        
        $('#valorEntradaReal').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });
        
        $('#valorParcela').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });
        
        $('#valorParcelaFinal').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });
        
        $('#taxaJuros').maskMoney({
            prefix: '',
            suffix: '%',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowNegative: false,
            allowZero: true
        });
        
        $('#valorEntradaPorcentagem').maskMoney({
            prefix: '',
            suffix: '%',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowNegative: false,
            allowZero: true
        });
		
		$('#bonusAcessorios').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });

        console.log('maskMoney initialization complete');
    } else {
        console.error('jQuery or maskMoney plugin not loaded properly');
        alert('Erro: Algumas funcionalidades podem não estar disponíveis. Por favor, recarregue a página.');
    }

    // Event listeners with null checks
    setupEventListeners();

    // Start background image rotation if there are images
    if (images.length > 0) {
        console.log('Starting background image rotation');
        setInterval(changeBackgroundImage, 5000);
    }
});

function setupEventListeners() {
    console.log('Setting up event listeners...');
	
	
	    const dados = {
      "FIAT": {
		"ARGO": ["1.0 Flex Manual", "Drive 1.0 Flex Manual", "Drive 1.3 Flex Automático", "Trekking 1.3 Flex Automático"],
		"CRONOS": ["Drive 1.0 Flex Manual", "Drive 1.3 Flex Automático", "Precision 1.3 Flex Automático"],
		"DUCATO": ["Cargo Diesel Manual", "MaxiCargo Diesel Manual", "Multi Diesel Manual", "Minibus Confort 19L Diesel Manual", "Minibus Luxo 16L Diesel Manual", "Minibus Executivo 17L Diesel Manual"],
		"FASTBACK": ["T200 Flex Automático", "Audace T200 Hybrid Automático", "Impetus T200 Hybrid Automático", "Limited Edition T270 Flex Automático", "Abarth T270 Flex Automático"],
		"FIORINO": ["Endurance 1.3 Flex Manual"],
		"MOBI": ["Like 1.0 Flex Manual", "Trekking 1.0 Flex Manual"],
		"PULSE": ["Drive 1.3 Flex Automático", "Audace T200 Hybrid Automático", "Impetus T200 Hybrid Automático", "Abarth T270 Flex Automático"],
		"SCUDO": ["Cargo 1.5 Manual TurboDiesel", "Multi 1.5 Manual TurboDiesel"],
		"STRADA": ["Endurance 1.3 CP Flex Manual", "Freedom 1.3 CP Flex Manual", "Freedom 1.3 CD Flex Manual", "Volcano 1.3 CD Flex Manual", "Volcano 1.3 CD Flex Automático", "Ranch Turbo 200 CD Flex Automático", "Ultra Turbo 200 CD Flex Automático"],
		"TITANO": ["Endurance 2.2 4x4 Automático Diesel", "Volcano 2.2 4x4 Automático Diesel", "Ranch 2.2 4x4 Automático Diesel"],
		"TORO": ["Endurance T270 4x2 Flex Automático", "Freedom T270 4x2 Flex Automático", "Volcano T270 4x2 Flex Automático", "Ultra T270 Flex Automático", "Volcano 2.0 TurboDiesel 4x4 Automático", "Ranch 2.0 TurboDiesel 4x4 Automático"],
      },
      "JEEP": {
        "Renegade": ["1.3 TURBO T270 4X2 Flex automático", "SPORT T270 4X2 Flex automático", "ALTITUDE T270 4X2 Flex automático", "LONGITUDE T270 4X2 Flex automático", "SAHARA T270 4X2 Flex automático", "TRAILHAWK T270 4X4 Flex automático", "WILLYS T270 4X4 Flex automático"],
        "Compass": ["SPORT T270 Flex automático", "LONGITUDE T270 Flex automático", "LIMITED T270 Flex automático", "SERIE S T270 Flex automático", "OVERLAND HURRICANE GASOLINA automático", "BLACKHAWK HURRICANE GASOLINA automático", "4XE Hibrido PHEV automático"],
        "Commander": ["LONGITUDE 5L T270 Flex automático", "LIMITED T270 Flex automático", "OVERLAND T270 Flex automático", "OVERLAND 2.2 TurboDIESEL 4X4 automático", "OVERLAND HURRICANE 4X4 automático", "BLACKHAWK HURRICANE 4X4 automático"],
        "Wrangler": ["RUBICON 4x4 Gasolina automático"],
		"Gladiator": ["RUBICON 4x4 Gasolina automático"],
		"Grand Cherokee": ["4XE Hibrido PHEV"],
      },
      "RAM": {
        "Rampage": ["BIG HORN 2.2 TURBODIESEL AT9 4X4", "REBEL 2.2 TURBODIESEL AT9 4X4", "REBEL 2.0 TURBO GASOLINA AT9 4X4", "LARAMIE 2.2 TURBODIESEL AT9 4X4", "LARAMIE 2.0 TURBO GASOLINA AT9 4X4", "R/T 2.0 TURBO GASOLINA AT9 4X4"],
        "1500": ["LARAMIE 3.0 BITURBO GASOLINA AT8 4X4", "LARAMIE NIGHT EDITION 3.0 BITURBO GASOLINA AT8 4X4"],
        "2500": ["LARAMIE 6.7 TURBODIESEL AT6 4X4", "LARAMIE NIGHT EDITION 6.7 TURBODIESEL AT6 4X4"],
        "3500": ["LARAMIE 6.7 TURBODIESEL AT6 4X4", "LARAMIE NIGHT EDITION 6.7 TURBODIESEL AT6 4X4", "LIMITED LONGHORN 6.7 TURBODIESEL AT6 4X4"],
      }
    };

    const modeloSelect = document.getElementById("modelo");
    const versaoSelect = document.getElementById("versao");

    document.querySelectorAll('input[name="marca"]').forEach(radio => {
      radio.addEventListener("change", function () {
        const marca = this.value;
        modeloSelect.innerHTML = '<option value="">Selecione o modelo</option>';
        versaoSelect.innerHTML = '<option value="">Selecione a versão</option>';
        versaoSelect.disabled = true;

        if (dados[marca]) {
          modeloSelect.disabled = false;
          const modelos = Object.keys(dados[marca]);
          modelos.forEach(modelo => {
            const opt = document.createElement("option");
            opt.value = modelo;
            opt.textContent = modelo;
            modeloSelect.appendChild(opt);
          });
        } else {
          modeloSelect.disabled = true;
        }
      });
    });

    modeloSelect.addEventListener("change", function () {
      const marca = document.querySelector('input[name="marca"]:checked')?.value;
      const modelo = this.value;
      versaoSelect.innerHTML = '<option value="">Selecione a versão</option>';

      if (marca && modelo && dados[marca][modelo]) {
        versaoSelect.disabled = false;
        dados[marca][modelo].forEach(versao => {
          const opt = document.createElement("option");
          opt.value = versao;
          opt.textContent = versao;
          versaoSelect.appendChild(opt);
        });
      } else {
        versaoSelect.disabled = true;
      }
    });

    // Optional checkbox
    const opcionalCheckbox = document.getElementById("opcionalCheckbox");
    if (opcionalCheckbox) {
        opcionalCheckbox.addEventListener("change", function() {
            const nomeOpcional = document.getElementById("nomeOpcional");
            if (nomeOpcional) {
                nomeOpcional.style.display = this.checked ? "block" : "none";
                if (!this.checked) nomeOpcional.value = '';
            }
        });
    }

    // Chassi checkbox
    const chassiCheckbox = document.getElementById("chassiUnicoCheckbox");
    if (chassiCheckbox) {
        chassiCheckbox.addEventListener("change", function() {
            const numeroChassi = document.getElementById("numeroChassi");
            if (numeroChassi) {
                numeroChassi.style.display = this.checked ? "block" : "none";
                if (!this.checked) numeroChassi.value = '';
            }
        });
    }

    // Financing options
    const financiamentoCheckbox = document.getElementById("checkboxFinanciamento");
    if (financiamentoCheckbox) {
        financiamentoCheckbox.addEventListener("change", mostrarOpcoesFinanciamento);
    }

    // Entry type radios
    document.querySelectorAll('input[name="entradaTipo"]').forEach(radio => {
        radio.addEventListener("click", function() {
            mostrarCampoEntrada(this.value);
        });
    });
    
    // Final installment checkbox
    const parcelaFinalCheckbox = document.getElementById("checkboxParcelaFinal");
    if (parcelaFinalCheckbox) {
        parcelaFinalCheckbox.addEventListener("change", mostrarCamposParcelaFinal);
    }
    
    // Main buttons
    const criarTextoBtn = document.getElementById("criarTextoBtn");
    if (criarTextoBtn) criarTextoBtn.addEventListener("click", criarTexto);
    
    const inserirFipeBtn = document.getElementById("inserirFipeBtn");
    if (inserirFipeBtn) inserirFipeBtn.addEventListener("click", popupInserirFipe);
    
    const inserirBonusUsadoBtn = document.getElementById("inserirBonusUsadoBtn");
    if (inserirBonusUsadoBtn) inserirBonusUsadoBtn.addEventListener("click", popupBonusUsado);
    
    const limparTextoBtn = document.getElementById("limparTextoBtn");
    if (limparTextoBtn) limparTextoBtn.addEventListener("click", limparResultado);
    
    const copiarTextoBtn = document.getElementById("copiarTextoBtn");
    if (copiarTextoBtn) copiarTextoBtn.addEventListener("click", copiarTexto);
    
    // TL buttons
    const tlFipeBtn = document.querySelector(".tl-fipe-btn");
    if (tlFipeBtn) {
        tlFipeBtn.addEventListener("click", function() {
            window.open('https://ythallo89.github.io/texto_juridico_tabela_fipe/', '_blank');
        });
    }
    
    const tlBonusBtn = document.querySelector(".tl-bonus-usado-btn");
    if (tlBonusBtn) {
        tlBonusBtn.addEventListener("click", function() {
            window.open('https://ythallo89.github.io/texto_juridico_bonus_usado/', '_blank');
        });
    }

    console.log('Event listeners setup complete');
}

// Functions with enhanced error handling
function changeBackgroundImage() {
    try {
        if (images.length === 0) return;
        const parallax = document.getElementById("parallax");
        if (parallax) {
            parallax.style.backgroundImage = `url(${images[currentIndex]})`;
            currentIndex = (currentIndex + 1) % images.length;
        }
    } catch (error) {
        console.error('Error in changeBackgroundImage:', error);
    }
}

function mostrarOpcoesFinanciamento() {
    try {
        const opcoesFinanciamento = document.getElementById("opcoesFinanciamento");
        const checkbox = document.getElementById("checkboxFinanciamento");
        
        if (opcoesFinanciamento && checkbox) {
            opcoesFinanciamento.style.display = checkbox.checked ? "block" : "none";
        }
    } catch (error) {
        console.error('Error in mostrarOpcoesFinanciamento:', error);
    }
}

function mostrarCampoEntrada(value) {
    try {
        const campoEntradaPorcentagem = document.getElementById("campoEntradaPorcentagem");
        const campoEntradaReal = document.getElementById("campoEntradaReal");

        if (value === "porcentagem") {
            if (campoEntradaPorcentagem) campoEntradaPorcentagem.style.display = "block";
            if (campoEntradaReal) campoEntradaReal.style.display = "none";
            
            const entradaRealField = document.getElementById("valorEntradaReal");
            if (entradaRealField) entradaRealField.value = '';
        } else {
            if (campoEntradaReal) campoEntradaReal.style.display = "block";
            if (campoEntradaPorcentagem) campoEntradaPorcentagem.style.display = "none";
            
            const entradaPorcentagemField = document.getElementById("valorEntradaPorcentagem");
            if (entradaPorcentagemField) entradaPorcentagemField.value = '';
        }
    } catch (error) {
        console.error('Error in mostrarCampoEntrada:', error);
    }
}

function mostrarCamposParcelaFinal() {
    try {
        const camposParcelaFinal = document.getElementById("camposParcelaFinal");
        const checkbox = document.getElementById("checkboxParcelaFinal");
        
        if (camposParcelaFinal && checkbox) {
            camposParcelaFinal.style.display = checkbox.checked ? "block" : "none";
        }
    } catch (error) {
        console.error('Error in mostrarCamposParcelaFinal:', error);
    }
}

function popupInserirFipe() {
    try {
        const textoInserido = prompt("Por favor, insira o texto da FIPE:");
        if (textoInserido !== null) {
            textoFipeInserido = textoInserido;
            criarTexto();
        }
    } catch (error) {
        console.error('Error in popupInserirFipe:', error);
        alert('Ocorreu um erro ao inserir o texto da FIPE. Por favor, tente novamente.');
    }
}

function popupBonusUsado() {
    try {
        const textoInserido = prompt("Por favor, insira o texto do Bônus / Supervalorização no Usado:");
        if (textoInserido !== null) {
            textoBonusUsadoInserido = textoInserido;
            criarTexto();
        }
    } catch (error) {
        console.error('Error in popupBonusUsado:', error);
        alert('Ocorreu um erro ao inserir o texto do Bônus. Por favor, tente novamente.');
    }
}

// Função para excluir texto FIPE e BÔNUS NO USADO do texto final
function limparResultado() {
			// Redefine as variáveis globais
			textoFipeInserido = '';
			textoBonusUsadoInserido = '';
    
			// Atualiza o texto final
			criarTexto();
		}
		
// Função para COPIAR texto final
function copiarTexto() {
            const textoGerado = document.getElementById('textoGerado').textContent;
            navigator.clipboard.writeText(textoGerado).then(() => {
                alert('Texto copiado para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });
        }

function criarTexto() {
    try {
        console.log('Creating text...');
        
        // Get all field values with null checks
        const marca = document.querySelector('input[name="marca"]:checked')?.value || '';
        const modelo = getValue("modelo");
        const versao = getValue("versao");
        const anoModelo = getValue("anoModelo");
        const chassiUnico = getCheckboxValue("chassiUnicoCheckbox");
        const numeroChassi = getValue("numeroChassi");
        const opcional = getCheckboxValue("opcionalCheckbox");
        const nomeOpcional = getValue("nomeOpcional");
        const cor = getRadioValue("cor");
        const nomeCor = getValue("nomeCor");
        const priceDE = getValue("priceDE");
        const pricePOR = getValue("pricePOR");
        const comusadonatroca = getCheckboxValue("comusadonatroca");
        const financiamento = getCheckboxValue("checkboxFinanciamento");
        const taxa = getValue("taxaJuros");
        const entradaPorcentagem = getValue("valorEntradaPorcentagem");
        const entradaReal = getValue("valorEntradaReal");
        const quantidadeParcelas = getValue("quantidadeParcelas");
        const valorParcela = getValue("valorParcela");
        const carencia = getValue("carencia");
        const ipvaGratis = getCheckboxValue("ipvaGratis");
		const emplacamentoGratis = getCheckboxValue("emplacamentoGratis");
		const revisãoGratis = getCheckboxValue("revisãoGratis");
		const bonusAcessorios = getValue("bonusAcessorios");
        const entradaCartao = getCheckboxValue("entradaCartao");
        const tipoCliente = getValue("tipoCliente");
        const validade = getValue("validade");
        const valorParcelaBalaoFinal = getValue("valorParcelaFinal");
        const numeroParcelaFinal = getValue("numeroParcelaFinal");

        // Validate required fields
        if (!validade) {
            alert('Por favor, insira uma data de validade.');
            return;
        }

        // Format date
        const partesData = validade.split("-");
        const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

        // Build the text
        let textoFinal = `${marca} ${modelo} ${versao}`;
        textoFinal += `, 0km`;
        textoFinal += `, ${anoModelo}, `;

        if (chassiUnico && numeroChassi) {
            textoFinal += `chassi final ${numeroChassi}, `;
        }

        if (opcional && nomeOpcional) {
            textoFinal += `opcional incluso ${nomeOpcional}, `;
        } else {
            textoFinal += "sem opcional, ";
        }

        textoFinal += `cor ${cor} `;
        textoFinal += `${nomeCor}, com valor à vista `;
        textoFinal += `de ${priceDE}`;

        if (pricePOR && pricePOR.trim() !== '') {
            textoFinal += ` por ${pricePOR}`;
        }
        
        if (comusadonatroca) {
            textoFinal += ", com seu seminovo na troca";
        }
        
        textoFinal += `. `;
        
        if (textoFipeInserido.trim() !== '') {
            textoFinal += ` ${textoFipeInserido}. `;
        }
        
        if (textoBonusUsadoInserido.trim() !== '') {
            textoFinal += ` ${textoBonusUsadoInserido}. `;
        }
        
        if (financiamento) {
            textoFinal += `Financiamento com taxa a partir de ${taxa} a.m., `;

            if (entradaPorcentagem) {
                textoFinal += `com entrada de ${entradaPorcentagem} `;
            } else if (entradaReal) {
                textoFinal += `com entrada de ${entradaReal} `;
            }

            textoFinal += `e saldo em ${quantidadeParcelas}x `;

            if (valorParcela && valorParcela.trim() !== "") {
                textoFinal += `de ${valorParcela}, `;
            }

            if (getCheckboxValue("checkboxParcelaFinal") && numeroParcelaFinal) {
                textoFinal += `mais uma ${numeroParcelaFinal}ª `;
                textoFinal += `parcela residual de ${valorParcelaBalaoFinal}, `;
            }

            textoFinal += `com ${carencia} dias de carência para pagamento da 1ª parcela, na modalidade crédito direto ao consumidor – cdc, pessoa física, incluindo tarifas, custos e impostos (i.O.F.). Todas as propostas estarão sujeitas a aprovação de crédito pelo banco STELLANTIS. `;
        }

        if (ipvaGratis) {
            textoFinal += "Ação \"IPVA GRÁTIS\". O veículo divulgado neste anúncio terá o valor correspondente ao IPVA do ano atual custeados pela concessionária Italiana. ";
        }
		
		if (emplacamentoGratis) {
            textoFinal += "Ação \"EMPLACAMENTO GRÁTIS\". O veículo divulgado neste anúncio terá o valor correspondente a taxa de emplacamento do ano atual custeados pela concessionária Italiana. ";
        }
		
		if (revisãoGratis) {
            textoFinal += "Ação \"1ª REVISÃO GRÁTIS\". O veículo divulgado neste anúncio terá o valor correspondente a 1ª revisão de quilometragem registrada no manual de garantia do veículo custeados pela concessionária Italiana. ";
        }
		
		
        if (bonusAcessorios && bonusAcessorios.trim() !== '') {
            textoFinal += ` "Ação \"BÔNUS EM ACESSÓRIOS\". Será bonificado ao cliente o valor de ${bonusAcessorios} em acessórios para serem instalados no veículo comprado. Não será possível resgatar o valor total ou parcial deste bônus em dinheiro ou transferido para outra pessoa. `;
        }

        if (entradaCartao) {
            textoFinal += "Entrada facilitada no cartão de crédito da operadora LUCREE, em até 21 vezes com incidência de juros do cartão de acordo com o parcelamento solicitado. ";
        }

        textoFinal += `Ofertas citadas acima são exclusivas para ${tipoCliente}, `;
        textoFinal += `válido até ${dataFormatada} ou enquanto durar o estoque, prevalecendo o que ocorrer primeiro. `;
        textoFinal += "Oferta não cumulativa com outras ofertas vigentes da Stellantis ou da Rede de Concessionárias Italiana. Imagens meramente ilustrativas. Consulte os demais termos e condições em nossa central de atendimento.";

        // Display the generated text
        const textoGerado = document.getElementById("textoGerado");
        if (textoGerado) {
            textoGerado.textContent = textoFinal;
        }
    } catch (error) {
        console.error('Error in criarTexto:', error);
        alert('Ocorreu um erro ao gerar o texto. Por favor, verifique os campos e tente novamente.');
    }
}

// Helper functions
function getValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value : '';
}

function getCheckboxValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.checked : false;
}

function getRadioValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : '';
}