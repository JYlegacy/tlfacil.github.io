// script.js - Gerador de Texto para Anúncios de Veículos (com dados externos)

/**
 * VARIÁVEIS GLOBAIS
 */
let textoFipeInserido = '';
let textoBonusUsadoInserido = '';

// Cache para modelos já carregados
const modelosCarregados = new Set();

// ==============================================
// INICIALIZAÇÃO DA PÁGINA
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    // Modo escuro automático
    const darkModeButton = document.getElementById('darkModeButton');
    const icon = darkModeButton.querySelector('.material-symbols-outlined');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }

    // Inicializa máscaras monetárias
    if (typeof $ !== 'undefined' && typeof $.fn.maskMoney !== 'undefined') {
        $('#priceDE, #pricePOR, #valorEntradaReal, #valorParcela, #valorParcelaFinal, #bonusAcessorios, #valorBonusUsado').maskMoney({
            prefix: 'R$ ',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowZero: false,
            allowNegative: false
        });
        $('#taxaJuros, #valorEntradaPorcentagem').maskMoney({
            prefix: '',
            suffix: '%',
            thousands: '.',
            decimal: ',',
            precision: 2,
            allowNegative: false,
            allowZero: true
        });
    } else {
        console.error('jQuery or maskMoney plugin not loaded');
    }

    // Carrega o arquivo de marcas (modelos por marca)
    carregarMarcas(() => {
        setupEventListeners();
    });

    // Inicia rotação de fundo se houver imagens
    // if (images.length > 0) setInterval(changeBackgroundImage, 5000);
});

// ==============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS
// ==============================================

function carregarMarcas(callback) {
    const script = document.createElement('script');
    script.src = 'js/marcas.js';
    script.onload = () => {
        if (callback) callback();
    };
    script.onerror = () => {
        console.error('Erro ao carregar marcas.js');
        alert('Erro ao carregar dados das marcas. Recarregue a página.');
    };
    document.head.appendChild(script);
}

function carregarModelo(marca, modelo, callback) {
    const chave = `${marca}/${modelo}`;
    if (modelosCarregados.has(chave)) {
        if (callback) callback();
        return;
    }

    // Converte nome do modelo para nome de arquivo:
    // - Substitui espaços por "_"
    // - Remove caracteres especiais, se necessário
    const nomeArquivo = modelo.replace(/ /g, '_') + '.js';
    const caminho = `js/${marca}/${nomeArquivo}`;
    
    const script = document.createElement('script');
    script.src = caminho;
    script.onload = () => {
        modelosCarregados.add(chave);
        if (callback) callback();
    };
    script.onerror = () => {
        console.error(`Erro ao carregar modelo: ${caminho}`);
        alert(`Dados do modelo ${modelo} não encontrados.`);
    };
    document.head.appendChild(script);
}

// ==============================================
// CONFIGURAÇÃO DE LISTENERS (modificada)
// ==============================================

function setupEventListeners() {
    // ... (todos os listeners que não dependem de dados embutidos)
    // Mantenha o código original, mas substitua as partes que acessam dados embutidos.

    // Exemplo: ao selecionar marca, preenche modelo usando window.marcas
    document.querySelectorAll('input[name="marca"]').forEach(radio => {
        radio.addEventListener("change", function() {
            const marca = this.value;
            const modeloSelect = document.getElementById("modelo");
            modeloSelect.innerHTML = '<option value="">Selecione o modelo</option>';
            document.getElementById("versao").innerHTML = '<option value="">Selecione a versão</option>';
            document.getElementById("versao").disabled = true;
            document.getElementById("nomeCor").innerHTML = '<option value="">Selecione a Cor</option>';
            document.getElementById("nomeCor").disabled = true;

            if (window.marcas && window.marcas[marca]) {
                modeloSelect.disabled = false;
                window.marcas[marca].forEach(modelo => {
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

    // Ao selecionar modelo, carrega os dados daquele modelo e preenche versões
    const modeloSelect = document.getElementById("modelo");
    modeloSelect.addEventListener("change", function() {
        const marca = document.querySelector('input[name="marca"]:checked')?.value;
        const modelo = this.value;
        const versaoSelect = document.getElementById("versao");
        versaoSelect.innerHTML = '<option value="">Selecione a versão</option>';
        versaoSelect.disabled = true;
        document.getElementById("nomeCor").innerHTML = '<option value="">Selecione a Cor</option>';
        document.getElementById("nomeCor").disabled = true;

        if (marca && modelo) {
            carregarModelo(marca, modelo, () => {
                // Após carregar, popula versões
                const dadosModelo = window.modelData?.[marca]?.[modelo];
                if (dadosModelo && dadosModelo.versoes) {
                    versaoSelect.disabled = false;
                    dadosModelo.versoes.forEach(versao => {
                        const opt = document.createElement("option");
                        opt.value = versao;
                        opt.textContent = versao;
                        versaoSelect.appendChild(opt);
                    });
                } else {
                    console.warn(`Nenhum dado encontrado para ${marca} ${modelo}`);
                }
            });
        }
    });

    // Ao selecionar versão, carrega cores
    const versaoSelect = document.getElementById("versao");
    versaoSelect.addEventListener("change", function() {
        const marca = document.querySelector('input[name="marca"]:checked')?.value;
        const modelo = document.getElementById("modelo").value;
        const versao = this.value;
        const nomeCorSelect = document.getElementById("nomeCor");
        nomeCorSelect.innerHTML = '<option value="">Selecione a Cor</option>';
        nomeCorSelect.disabled = true;

        if (marca && modelo && versao) {
            // Garante que os dados do modelo já estejam carregados (pode já estar)
            const dadosModelo = window.modelData?.[marca]?.[modelo];
            if (dadosModelo && dadosModelo.cores && dadosModelo.cores[versao]) {
                dadosModelo.cores[versao].forEach(cor => {
                    const opt = document.createElement("option");
                    opt.value = cor;
                    opt.textContent = cor;
                    nomeCorSelect.appendChild(opt);
                });
                nomeCorSelect.disabled = false;
            } else {
                console.warn(`Cores não encontradas para ${marca} ${modelo} ${versao}`);
            }
        }
    });

    // Listeners para checkboxes diversos
	
	// Checkbox do "Chassi Único"
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

    // Checkbox do "Opcional"
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
	
		// Campo para "SEMINOVO DE MODELO ESPECIFICO NA TROCA"
	const comusadonatrocaSelect = document.getElementById("comusadonatroca");
	if (comusadonatrocaSelect) {
		comusadonatrocaSelect.addEventListener("change", function() {
			const modeloEspecificoTroca = document.getElementById("modeloEspecificoTroca");
			if (modeloEspecificoTroca) {
				// Mostra o campo apenas se a opção "modelo específico" for selecionada
				if (this.value === "seminovo de modelo específico na troca") {
					modeloEspecificoTroca.style.display = "block";
				} else {
					modeloEspecificoTroca.style.display = "none";
					modeloEspecificoTroca.value = ''; // Limpa o valor
				}
			}
		});
	}
	
	// Checkbox do "Supervalorização do Usado / Bônus Trade-in:"
    const bonusUsadoCheckbox = document.getElementById("bonusUsadoCheckbox");
    if (bonusUsadoCheckbox) {
        bonusUsadoCheckbox.addEventListener("change", function() {
            const valorBonusUsado = document.getElementById("valorBonusUsado");
            if (valorBonusUsado) {
                valorBonusUsado.style.display = this.checked ? "inline-block" : "none";
                if (!this.checked) valorBonusUsado.value = '';
                
                // Ativar máscara monetária se o campo for exibido
                if (this.checked && typeof $.fn.maskMoney !== 'undefined') {
                    $('#valorBonusUsado').maskMoney({
                        prefix: 'R$ ',
                        thousands: '.',
                        decimal: ',',
                        precision: 2,
                        allowZero: false,
                        allowNegative: false
                    });
                }
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
    
    // Checkbox da opção "Parcela final" do financiamento
    const parcelaFinalCheckbox = document.getElementById("checkboxParcelaFinal");
    if (parcelaFinalCheckbox) {
        parcelaFinalCheckbox.addEventListener("change", mostrarCamposParcelaFinal);
    }
	
	
	
	// Função para Checkbox de REVISÃO GRÁTIS
	const revisaoCheckbox = document.getElementById("revisãoGratis");
	if (revisaoCheckbox) {
		revisaoCheckbox.addEventListener("change", function() {
			const opcoesRevisao = document.getElementById("opcoesRevisao");
			if (opcoesRevisao) {
				opcoesRevisao.style.display = this.checked ? "block" : "none";
				
				// Se desmarcar, limpa todas as opções de revisão
				if (!this.checked) {
					document.querySelectorAll('.opcaoRevisao').forEach(checkbox => {
						checkbox.checked = false;
					});
				}
			}
		});
	}	
	
	// Checkbox do "Bônus em Acessórios"
	const bonusAcessoriosCheckbox = document.getElementById("bonusAcessoriosCheckbox");
	if (bonusAcessoriosCheckbox) {
		bonusAcessoriosCheckbox.addEventListener("change", function() {
			const bonusAcessorios = document.getElementById("bonusAcessorios");
			if (bonusAcessorios) {
				bonusAcessorios.style.display = this.checked ? "block" : "none";
				if (!this.checked) bonusAcessorios.value = '';
			}
		});
	}
	
    
    // Botões do final do formulário
    const criarTextoBtn = document.getElementById("criarTextoBtn");
    if (criarTextoBtn) criarTextoBtn.addEventListener("click", criarTexto);
    
    const inserirFipeBtn = document.getElementById("inserirFipeBtn");
    if (inserirFipeBtn) inserirFipeBtn.addEventListener("click", popupInserirFipe);
    
       
    const limparTextoBtn = document.getElementById("limparTextoBtn");
    if (limparTextoBtn) limparTextoBtn.addEventListener("click", limparResultado);
    
    const copiarTextoBtn = document.getElementById("copiarTextoBtn");
    if (copiarTextoBtn) copiarTextoBtn.addEventListener("click", copiarTexto);
	
	// NOVO: Botão para criar briefing
    const criarBriefingBtn = document.getElementById("criarBriefingBtn");
    if (criarBriefingBtn) criarBriefingBtn.addEventListener("click", criarBriefing);
	
    
    // Redirecionamento do botão FIPE para o formulário de TABELA FIPE
    const tlFipeBtn = document.querySelector(".tl-fipe-btn");
    if (tlFipeBtn) {
        tlFipeBtn.addEventListener("click", function() {
            window.open('FIPE/fipe_index.html', '_blank');
        });
    }
	
	
	// Isso é alguma função do modo escuro
	const darkModeToggle = document.getElementById('darkModeToggle');
	if (darkModeToggle) {
		darkModeToggle.addEventListener('click', function () {
			document.body.classList.toggle('dark-mode');
			darkModeToggle.textContent = document.body.classList.contains('dark-mode') 
				? 'Desativar Dark Mode' 
				: 'Ativar Dark Mode';
		});
	}
	
	// Modifique o evento do botão darkModeButton
	document.getElementById('darkModeButton').addEventListener('click', function() {
		// Se estiver em modo Blade Runner, desativá-lo primeiro
		if (document.body.classList.contains('blade-runner')) {
			document.body.classList.remove('blade-runner');
		}
    
    // Alternar modo escuro
    document.body.classList.toggle('dark-mode');
    
    const icon = this.querySelector('.material-symbols-outlined');
    if (document.body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
});


// Alternar tema Blade Runner ao clicar na logo
document.querySelectorAll('.logo-click').forEach(logo => {
    logo.addEventListener('click', function() {
        document.body.classList.toggle('blade-runner');
        
        // Verificar se o tema Blade Runner está ativo
        const isBladeRunner = document.body.classList.contains('blade-runner');
        
        // Se ativar Blade Runner, desativar dark mode (opcional)
        if (isBladeRunner) {
            document.body.classList.remove('dark-mode');
            
            // Atualizar ícone do botão dark mode
            const icon = document.querySelector('#darkModeButton .material-symbols-outlined');
            if (icon) {
                icon.textContent = 'dark_mode';
            }
        }
        
        // Se desativar Blade Runner, restaurar o tema baseado na preferência do sistema
        if (!isBladeRunner) {
            // Verificar se o sistema prefere modo escuro
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
                const icon = document.querySelector('#darkModeButton .material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'light_mode';
                }
            }
        }
    });
});


console.log('Event listeners setup complete');
}  

// ==============================================
// FUNÇÕES DE MANIPULAÇÃO DE INTERFACE
// ==============================================

/**
 * Alterna entre imagens de fundo
 */
// function changeBackgroundImage() {
//     try {
//         if (images.length === 0) return;
//         const parallax = document.getElementById("parallax");
//         if (parallax) {
//             parallax.style.backgroundImage = `url(${images[currentIndex]})`;
//             currentIndex = (currentIndex + 1) % images.length;
//         }
//     } catch (error) {
//         console.error('Error in changeBackgroundImage:', error);
//     }
// }

/**
 * Mostra/oculta as opções de financiamento
 */
// Exibe ou oculta as opções de financiamento com base no estado do checkbox
function mostrarOpcoesFinanciamento() {
    try {
        const opcoesFinanciamento = document.getElementById("opcoesFinanciamento");
        const checkbox = document.getElementById("checkboxFinanciamento");

        if (opcoesFinanciamento && checkbox) {
            opcoesFinanciamento.style.display = checkbox.checked ? "block" : "none";
        }
    } catch (error) {
        console.error('Erro em mostrarOpcoesFinanciamento:', error);
    }
}

// Exibe o campo de entrada (porcentagem ou valor real) conforme a opção selecionada
function mostrarCampoEntrada(value) {
    try {
        const campoEntradaPorcentagem = document.getElementById("campoEntradaPorcentagem");
        const campoEntradaReal = document.getElementById("campoEntradaReal");

        if (value === "porcentagem") {
            // Mostra campo de porcentagem e esconde o de valor real
            if (campoEntradaPorcentagem) campoEntradaPorcentagem.style.display = "block";
            if (campoEntradaReal) campoEntradaReal.style.display = "none";

            // Limpa valor do campo de entrada real
            const entradaRealField = document.getElementById("valorEntradaReal");
            if (entradaRealField) entradaRealField.value = '';
        } else {
            // Mostra campo de valor real e esconde o de porcentagem
            if (campoEntradaReal) campoEntradaReal.style.display = "block";
            if (campoEntradaPorcentagem) campoEntradaPorcentagem.style.display = "none";

            // Limpa valor do campo de entrada em porcentagem
            const entradaPorcentagemField = document.getElementById("valorEntradaPorcentagem");
            if (entradaPorcentagemField) entradaPorcentagemField.value = '';
        }
    } catch (error) {
        console.error('Erro em mostrarCampoEntrada:', error);
    }
}

// Exibe ou oculta os campos da parcela final com base no estado do checkbox
function mostrarCamposParcelaFinal() {
    try {
        const camposParcelaFinal = document.getElementById("camposParcelaFinal");
        const checkbox = document.getElementById("checkboxParcelaFinal");

        if (camposParcelaFinal && checkbox) {
            camposParcelaFinal.style.display = checkbox.checked ? "block" : "none";
        }
    } catch (error) {
        console.error('Erro em mostrarCamposParcelaFinal:', error);
    }
}

// Exibe um prompt para inserir texto da FIPE e atualiza o texto final
function popupInserirFipe() {
    try {
        const textoInserido = prompt("Por favor, insira o texto da FIPE:");
        if (textoInserido !== null) {
            textoFipeInserido = textoInserido;
            criarTexto(); // Atualiza o texto final
        }
    } catch (error) {
        console.error('Erro em popupInserirFipe:', error);
        alert('Ocorreu um erro ao inserir o texto da FIPE. Por favor, tente novamente.');
    }
}


// Limpa os textos inseridos da FIPE e do bônus no usado
function limparResultado() {
    textoFipeInserido = '';
    textoBonusUsadoInserido = '';
    criarTexto(); // Atualiza o texto final
}

// Copia o texto final gerado para a área de transferência
function copiarTexto() {
    const textoGerado = document.getElementById('textoGerado').textContent;

    navigator.clipboard.writeText(textoGerado)
        .then(() => {
            alert('Texto copiado para a área de transferência!');
        })
        .catch(err => {
            console.error('Erro ao copiar texto: ', err);
        });
}


// ==============================================
// FUNÇÕES PRINCIPAIS
// ==============================================
/**
 * Função principal que gera o texto de oferta com base nos dados do formulário
 * Combina todas as informações em um texto estruturado para anúncios de veículos
 */
function criarTexto() {
    try {
        console.log('Iniciando criação de texto...');
        
        // ==================================================
        // SEÇÃO 1: CAPTURA DE VALORES DO FORMULÁRIO
        // ==================================================
        
        // Informações básicas do veículo
        const marca = document.querySelector('input[name="marca"]:checked')?.value || '';
        const modelo = getValue("modelo");
        const versao = getValue("versao");
        const anoModelo = getValue("anoModelo");
        
        // Detalhes específicos do veículo
        const chassiUnico = getCheckboxValue("chassiUnicoCheckbox");
        const numeroChassi = getValue("numeroChassi");
        const opcional = getCheckboxValue("opcionalCheckbox");
        const nomeOpcional = getValue("nomeOpcional");
        const nomeCor = getValue("nomeCor");
        
        // Valores e preços
        const priceDE = getValue("priceDE");
        const pricePOR = getValue("pricePOR");
        const comusadonatroca = getValue("comusadonatroca"); // Alterado de checkbox para select
		const modeloEspecificoTroca = getValue("modeloEspecificoTroca"); // Nome do carro especifico que será usado na troca.
        
        // Condições de financiamento
        const financiamento = getCheckboxValue("checkboxFinanciamento");
        const taxa = getValue("taxaJuros");
        const entradaPorcentagem = getValue("valorEntradaPorcentagem");
        const entradaReal = getValue("valorEntradaReal");
        const quantidadeParcelas = getValue("quantidadeParcelas");
        const valorParcela = getValue("valorParcela");
        const carencia = getValue("carencia");
		
		// Valor de Bõnus na troca do seu Seminovo
		const bonusUsado = getCheckboxValue("bonusUsadoCheckbox"); // NOVO
        const valorBonusUsado = getValue("valorBonusUsado"); // NOVO
		
		// Condições Extras
		const ipvaGratis = getCheckboxValue("ipvaGratis");
		const taxaEmplacamentoGratis = getCheckboxValue("taxaEmplacamentoGratis");
		const emplacamentoGratis = getCheckboxValue("emplacamentoGratis");
		const revisãoGratis = getCheckboxValue("revisãoGratis");

		// Capturar as revisões selecionadas
		const revisoesSelecionadas = [];
		if (revisãoGratis) {
			document.querySelectorAll('.opcaoRevisao:checked').forEach(checkbox => {
				revisoesSelecionadas.push(checkbox.value);
			});
		}
		
		
        // Promoções e benefícios
        const bonusAcessorios = getValue("bonusAcessorios");
        const entradaCartao = getCheckboxValue("entradaCartao");
        
        // Informações do cliente e validade
        const tipoCliente = getValue("tipoCliente");
        const validade = getValue("validade");
        
        // Parcela final (balloon payment)
        const valorParcelaBalaoFinal = getValue("valorParcelaFinal");
        const numeroParcelaFinal = getValue("numeroParcelaFinal");

        // ==================================================
        // SEÇÃO 2: VALIDAÇÕES
        // ==================================================
        
        // Validação de campo obrigatório
        if (!validade) {
            alert('Por favor, insira uma data de validade.');
            return;
        }

        // Formatação da data (de YYYY-MM-DD para DD/MM/YYYY)
        const partesData = validade.split("-");
        const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

        // ==================================================
        // SEÇÃO 3: CONSTRUÇÃO DO TEXTO
        // ==================================================
        
        // 3.1 - Informações básicas do veículo
        let textoFinal = `${marca} ${modelo} ${versao}, 0km`;
        textoFinal += `, ${anoModelo}, `;

        // 3.2 - Detalhes específicos
        if (chassiUnico && numeroChassi) {
            textoFinal += `chassi final ${numeroChassi}, `;
        }

        if (opcional && nomeOpcional) {
            textoFinal += `opcional incluso ${nomeOpcional}, `;
        } else {
            textoFinal += "sem opcional, ";
        }

        // 3.3.1 - Preços e condições de pagamento
        textoFinal += `cor ${nomeCor}, com valor à vista `;
        textoFinal += `de ${priceDE}`;

        if (pricePOR && pricePOR.trim() !== '') {
            textoFinal += ` por ${pricePOR}`;
        }
        
        if (comusadonatroca && comusadonatroca.trim() !== '') {
			if (comusadonatroca === "seminovo de modelo específico na troca" && modeloEspecificoTroca && modeloEspecificoTroca.trim() !== '') {
				textoFinal += ` com seminovo ${modeloEspecificoTroca} na troca`;
			} else {
				textoFinal += ` com ${comusadonatroca}`;
			}
		}
		
		textoFinal += `. `;
		
		// 3.3.2 - Valor do Bõnus na troca do Seminovo
		if (bonusUsado && valorBonusUsado && valorBonusUsado.trim() !== '') {
            textoFinal += `"BÔNUS TRADE-IN". O valor de supervalorização de ${valorBonusUsado} será concedido na forma de bônus aplicado diretamente na compra do veículo 0km deste anúncio, mediante avaliação e entrega de 1 (um) veículo usado na negociação. O bônus não é convertido em dinheiro e não é cumulativo com outras campanhas, programas ou condições comerciais, salvo indicação expressa em contrário. `;
        }
		
		// 3.3.3 - Verificar se há seminovo na troca ou bônus na troca
        const temTroca = (comusadonatroca && comusadonatroca.trim() !== '') || 
                        (bonusUsado && valorBonusUsado && valorBonusUsado.trim() !== '');
        
        if (temTroca) {
            textoFinal += `A promoção não aceita veículos seminovos em nome de terceiros, salvo se o proprietário for parente de primeiro grau (cônjuge, filho ou pai) do comprador, mediante comprovação documental. Outros parentescos estão excluídos. `;
        }
		
			
        
        // 3.4 - Textos adicionais (FIPE e Bônus)
        if (textoFipeInserido.trim() !== '') {
            textoFinal += ` ${textoFipeInserido}. `;
        }
        
        if (textoBonusUsadoInserido.trim() !== '') {
            textoFinal += ` ${textoBonusUsadoInserido}. `;
        }
        
        // 3.5.1 - Condições de financiamento
        if (financiamento) {
            textoFinal += `Financiamento com taxa a partir de ${taxa} a.m., `;

            // Entrada (porcentagem ou valor fixo)
            if (entradaPorcentagem) {
                textoFinal += `com entrada de ${entradaPorcentagem} `;
            } else if (entradaReal) {
                textoFinal += `com entrada de ${entradaReal} `;
            }

            // Parcelamento principal
            textoFinal += `e saldo em ${quantidadeParcelas}x `;

            if (valorParcela && valorParcela.trim() !== "") {
                textoFinal += `de ${valorParcela}, `;
            }

            // Parcela final (se aplicável)
            if (getCheckboxValue("checkboxParcelaFinal") && numeroParcelaFinal) {
                textoFinal += `mais uma ${numeroParcelaFinal}ª `;
                textoFinal += `parcela residual de ${valorParcelaBalaoFinal}, `;
            }

            textoFinal += `com ${carencia} dias de carência para pagamento da 1ª parcela, na modalidade crédito direto ao consumidor – cdc, pessoa física, incluindo tarifas, custos e impostos (i.O.F.). Todas as propostas estarão sujeitas a aprovação de crédito pelo banco STELLANTIS. `;
        }


        // 3.6.1 - Condições Extras
		const condicoesExtras = [];
	
		if (ipvaGratis) condicoesExtras.push("IPVA grátis");
		if (taxaEmplacamentoGratis) condicoesExtras.push("Taxa de Emplacamento grátis");
		if (emplacamentoGratis) condicoesExtras.push("Emplacamento Total grátis");
		
		if (revisãoGratis && revisoesSelecionadas.length > 0) {
			const revisoesTexto = revisoesSelecionadas.map(r => `${r}`).join(', ');
			condicoesExtras.push(`${revisoesTexto} revisão grátis`);
		}
		
		if (condicoesExtras.length > 0) {
			const condicoesTexto = condicoesExtras.join(', ');
			textoFinal += `"CONDIÇÕES EXTRAS". O cliente receberá como cortesia do grupo ITALIANA o(s) seguinte(s) benefício(s) na compra do veículo deste anúncio: ${condicoesTexto}. `;
		}

        
        // 3.6.2 - Bônus em Acessórios (mantenha esta seção)
		if (getCheckboxValue("bonusAcessoriosCheckbox") && bonusAcessorios && bonusAcessorios.trim() !== '') {
			textoFinal += `"Ação \"BÔNUS EM ACESSÓRIOS\". Será bonificado ao cliente o valor de ${bonusAcessorios} em acessórios para serem instalados no veículo comprado. Não será possível resgatar o valor total ou parcial deste bônus em dinheiro ou transferido para outra pessoa. `;
		}

        if (entradaCartao) {
            textoFinal += "Entrada facilitada no cartão de crédito da operadora LUCREE, em até 24 vezes com incidência de juros do cartão de acordo com o parcelamento solicitado, sujeito a aprovação de crédito pelo banco. ";
        }
		
				

        // 3.7 - Informações finais e termos
        textoFinal += `Ofertas citadas acima são exclusivas para ${tipoCliente}, `;
        textoFinal += `válido até ${dataFormatada} ou enquanto durar o estoque, prevalecendo o que ocorrer primeiro. `;
        textoFinal += "Oferta não cumulativa com outras ofertas vigentes da Stellantis ou da Rede de Concessionárias Italiana. Imagens meramente ilustrativas. Consulte os demais termos e condições em nossa central de atendimento.";

        // ==================================================
        // SEÇÃO 4: EXIBIÇÃO DO RESULTADO
        // ==================================================
        
        const textoGerado = document.getElementById("textoGerado");
        if (textoGerado) {
            textoGerado.textContent = textoFinal;
        }
        
        console.log('Texto gerado com sucesso!');
    } catch (error) {
        console.error('Erro em criarTexto:', error);
        alert('Ocorreu um erro ao gerar o texto. Por favor, verifique os campos e tente novamente.');
    }
}











// ==============================================
// FUNÇÃO PARA CRIAR BRIEFING 
// ==============================================

function criarBriefing() {
    try {
        console.log('Iniciando criação de briefing...');
        
        // ==================================================
        // SEÇÃO 1: CAPTURA DE VALORES DO FORMULÁRIO
        // ==================================================
        
        // Informações básicas do veículo
        const marca = document.querySelector('input[name="marca"]:checked')?.value || '';
        const modelo = getValue("modelo");
        const versao = getValue("versao");
        const anoModelo = getValue("anoModelo");
        
        // Detalhes específicos do veículo (NOVO: para seção Destaques)
        const chassiUnico = getCheckboxValue("chassiUnicoCheckbox");
        const numeroChassi = getValue("numeroChassi");
        const opcional = getCheckboxValue("opcionalCheckbox");
        const nomeOpcional = getValue("nomeOpcional");
        
        // Preços
        const priceDE = getValue("priceDE");
        const pricePOR = getValue("pricePOR");
        const comusadonatroca = getValue("comusadonatroca");
        const modeloEspecificoTroca = getValue("modeloEspecificoTroca");
        
        // Tipo de cliente
        const tipoCliente = getValue("tipoCliente");
        
        // Data de validade - CRÍTICA PARA VALIDAÇÃO
        const validade = getValue("validade");
        
        // Condições extras
        const bonusUsado = getCheckboxValue("bonusUsadoCheckbox");
        const valorBonusUsado = getValue("valorBonusUsado");
        
        const financiamento = getCheckboxValue("checkboxFinanciamento");
        const taxa = getValue("taxaJuros");
        
        const ipvaGratis = getCheckboxValue("ipvaGratis");
        const emplacamentoGratis = getCheckboxValue("emplacamentoGratis");
        const taxaEmplacamentoGratis = getCheckboxValue("taxaEmplacamentoGratis");
        const revisãoGratis = getCheckboxValue("revisãoGratis");
        
        // Capturar revisões selecionadas
        const revisoesSelecionadas = [];
        if (revisãoGratis) {
            document.querySelectorAll('.opcaoRevisao:checked').forEach(checkbox => {
                revisoesSelecionadas.push(checkbox.value);
            });
        }
        
        const bonusAcessoriosCheckbox = getCheckboxValue("bonusAcessoriosCheckbox");
        const bonusAcessorios = getValue("bonusAcessorios");
        const entradaCartao = getCheckboxValue("entradaCartao");
        
        // ==================================================
        // SEÇÃO 2: VALIDAÇÕES BÁSICAS - CAMPOS OBRIGATÓRIOS
        // ==================================================
        
        let camposFaltantes = [];
        
        // Verificar marca selecionada
        if (!marca) {
            camposFaltantes.push("Marca");
        }
        
        // Verificar modelo selecionado
        if (!modelo) {
            camposFaltantes.push("Modelo");
        }
        
        // Verificar ano do modelo selecionado
        if (!anoModelo) {
            camposFaltantes.push("Ano");
        }
        
        // Verificar preço DE preenchido
        if (!priceDE) {
            camposFaltantes.push("Preço 'DE'");
        }
        
        // Verificar data de validade preenchida
        if (!validade) {
            camposFaltantes.push("Data de validade");
        }
        
        // Se houver campos faltantes, mostrar alerta específico
        if (camposFaltantes.length > 0) {
            const mensagem = `Por favor, preencha os seguintes campos obrigatórios:\n\n• ${camposFaltantes.join('\n• ')}`;
            alert(mensagem);
            return; // Interrompe a execução da função
        }
        
        // ==================================================
        // SEÇÃO 3: FUNÇÕES AUXILIARES PARA FORMATAÇÃO
        // ==================================================
        
        /**
         * Remove centavos dos valores monetários
         * @param {string} valor - Valor formatado (ex: "R$ 100.000,00")
         * @return {string} Valor sem centavos (ex: "R$ 100.000")
         */
        function removerCentavos(valor) {
            if (!valor) return '';
            
            // Remove os centavos (últimos 3 caracteres: ",00")
            if (valor.includes(',00')) {
                return valor.substring(0, valor.length - 3);
            }
            return valor;
        }
        
        /**
         * Formata taxa de juros - se for 0,0% mostra "zero"
         * @param {string} taxa - Taxa formatada (ex: "0,00%")
         * @return {string} Taxa formatada
         */
        function formatarTaxaJuros(taxa) {
            if (!taxa) return '';
            
            // Remove o símbolo de porcentagem e converte para número
            const taxaNumerica = taxa.replace('%', '').replace(',', '.');
            const valor = parseFloat(taxaNumerica);
            
            if (valor === 0) {
                return 'zero';
            }
            
            // Retorna com apenas 1 casa decimal se for diferente de zero
            return taxa.replace(',0', ',');
        }
        
        /**
         * Formata ano do modelo - remove o primeiro ano se tiver formato XXXX/YYYY
         * @param {string} ano - Ano do modelo (ex: "2025/2026")
         * @return {string} Ano formatado (ex: "2026")
         */
        function formatarAnoModelo(ano) {
            if (!ano) return '';
            
            // Se o formato for XXXX/YYYY, retorna apenas o segundo ano
            if (ano.includes('/')) {
                const partes = ano.split('/');
                if (partes.length === 2) {
                    return partes[1]; // Retorna apenas o segundo ano
                }
            }
            return ano;
        }
        
        /**
         * Formata a opção de seminovo na troca
         * @param {string} opcaoTroca - Opção selecionada
         * @return {string} Texto formatado
         */
        function formatarOpcaoTroca(opcaoTroca) {
            if (!opcaoTroca) return '';
            
            const mapeamento = {
                'seminovo de qualquer marca na troca': 'com seu usado na troca',
                'seminovo FIAT na troca': 'com seu FIAT usado na troca',
                'seminovo JEEP na troca': 'com seu JEEP usado na troca',
                'seminovo RAM na troca': 'com seu RAM usado na troca',
                'seminovo de modelo específico na troca': '' // Tratamento especial abaixo
            };
            
            // Para modelo específico, o texto será tratado separadamente
            if (opcaoTroca === 'seminovo de modelo específico na troca') {
                return ''; // Será tratado na lógica principal
            }
            
            return mapeamento[opcaoTroca] || opcaoTroca;
        }
        
        /**
         * Formata o tipo de cliente para o briefing
         * @param {string} tipoCliente - Tipo de cliente selecionado
         * @return {string} Texto formatado
         */
        function formatarTipoCliente(tipoCliente) {
            if (!tipoCliente) return '';
            
            const mapeamento = {
                'Pessoa Física no canal de VENDAS DIRETAS': 'Preço de empresa para pessoa física',
                'CNPJ e Produtor Rural no canal de VENDAS DIRETAS': 'Exclusivo para CNPJ e Produtor Rural',
                'Táxi com isenções de IPI e ICMS no canal de VENDAS DIRETAS': 'Exclusivo para Táxi',
                'Táxi com isenções de IPI no canal de VENDAS DIRETAS': 'Exclusivo para Táxi',
                'PCD (pessoas com deficiência) já contemplando isenções de IPI e ICMS no canal de VENDAS DIRETAS, desde que seja apresentado as devidas documentações para adquirir as isenções fiscais': 'Exclusivo para PCD',
                'PCD (pessoas com deficiência) já contemplando isenções de IPI no canal de VENDAS DIRETAS, desde que seja apresentado as devidas documentações para adquirir as isenções fiscais': 'Exclusivo para PCD'
            };
            
            return mapeamento[tipoCliente] || tipoCliente;
        }
        
        // ==================================================
        // SEÇÃO 4: CONSTRUÇÃO DO BRIEFING
        // ==================================================
        
        let briefing = "";
        
        // 4.1 - Cabeçalho com informações básicas
        briefing += `📌 OFERTA:\n\n`;
        briefing += `${modelo} ${versao || ""}`;
        
        // Adicionar ano formatado (apenas o segundo ano)
        const anoFormatado = formatarAnoModelo(anoModelo);
        if (anoFormatado) {
            briefing += ` ${anoFormatado}\n`;
        } else {
            briefing += `\n`;
        }
        
        // Formatar preço DE sem centavos
        const priceDESemCentavos = removerCentavos(priceDE);
        
        if (pricePOR && pricePOR.trim() !== '') {
            // Formatar preço POR sem centavos
            const pricePORSemCentavos = removerCentavos(pricePOR);
            briefing += `De: ${priceDESemCentavos}\n`;
            briefing += `Por: ${pricePORSemCentavos}\n`;
        } else {
            // Se não tem POR, mostrar DE com "a partir de"
            briefing += `A partir de: ${priceDESemCentavos}\n`;
        }
        
        // 4.2 - Informação sobre seminovo na troca
        if (comusadonatroca && comusadonatroca.trim() !== '') {
            if (comusadonatroca === "seminovo de modelo específico na troca" && modeloEspecificoTroca && modeloEspecificoTroca.trim() !== '') {
                briefing += `com seu ${modeloEspecificoTroca} usado na troca\n\n`;
            } else {
                const opcaoTrocaFormatada = formatarOpcaoTroca(comusadonatroca);
                if (opcaoTrocaFormatada) {
                    briefing += `${opcaoTrocaFormatada}\n\n`;
                }
            }
        } else {
            briefing += `\n\n`;
        }
        
        // 4.3 - Tipo de cliente formatado
        if (tipoCliente && tipoCliente !== "Pessoa Física no canal VAREJO") {
            const tipoClienteFormatado = formatarTipoCliente(tipoCliente);
            if (tipoClienteFormatado) {
                briefing += `${tipoClienteFormatado}\n\n`;
            } else {
                briefing += `\n`;
            }
        } else {
            briefing += `\n`;
        }
        
        // 4.4 - NOVA SEÇÃO: DESTAQUES (chassi único e opcional)
        const destaques = [];
        
        // Chassi único
        if (chassiUnico) {
            destaques.push("• Chassi único");
        }
        
        // Opcional
        if (opcional && nomeOpcional && nomeOpcional.trim() !== '') {
            destaques.push(`• ${nomeOpcional}`);
        }
        
        // Se houver destaques, adicionar a seção
        if (destaques.length > 0) {
            briefing += `📌 DESTAQUES:\n\n`;
            briefing += destaques.join('\n');
            briefing += `\n\n`;
        }
        
        // 4.5 - Seção "CONDIÇÕES"
        briefing += `📌 CONDIÇÕES DA OFERTA:\n\n`;
        
        // Bônus no usado
        if (bonusUsado && valorBonusUsado && valorBonusUsado.trim() !== '') {
            const bonusSemCentavos = removerCentavos(valorBonusUsado);
            briefing += `• Bônus no seu usado de ${bonusSemCentavos}\n`;
        }
        
        // Financiamento (apenas taxa de juros)
        if (financiamento && taxa && taxa.trim() !== '') {
            const taxaFormatada = formatarTaxaJuros(taxa);
            if (taxaFormatada) {
                briefing += `• Taxa ${taxaFormatada}\n`;
            }
        }
        
        // IPVA grátis
        if (ipvaGratis) {
            briefing += `• IPVA grátis\n`;
        }
        
        // Emplacamento total grátis
        if (emplacamentoGratis) {
            briefing += `• Emplacamento total grátis\n`;
        }
        
        // Taxa de emplacamento grátis
        if (taxaEmplacamentoGratis) {
            briefing += `• Taxa de emplacamento grátis\n`;
        }
        
        // Revisão grátis
        if (revisãoGratis && revisoesSelecionadas.length > 0) {
            const revisoesTexto = revisoesSelecionadas.map(r => `${r} revisão`).join(', ');
            briefing += `• ${revisoesTexto} grátis\n`;
        }
        
        // Bônus de acessórios
        if (bonusAcessoriosCheckbox && bonusAcessorios && bonusAcessorios.trim() !== '') {
            const acessoriosSemCentavos = removerCentavos(bonusAcessorios);
            briefing += `• Bônus em acessórios de ${acessoriosSemCentavos}\n`;
        }
        
        // Entrada no cartão
        if (entradaCartao) {
            briefing += `• Entrada facilitada em 24x\n`;
        }
        
        // Verificar se há alguma condição
        const temCondicoes = bonusUsado || financiamento || ipvaGratis || emplacamentoGratis || 
                            taxaEmplacamentoGratis || revisãoGratis || 
                            bonusAcessoriosCheckbox || entradaCartao;
        
        if (!temCondicoes) {
            briefing += `• Nenhuma condição extra selecionada\n`;
        }
        
        // ==================================================
        // SEÇÃO 5: EXIBIÇÃO DO RESULTADO
        // ==================================================
        
        const textoGerado = document.getElementById("textoGerado");
        if (textoGerado) {
            // Salva o briefing gerado
            const briefingGerado = briefing;
            
            // CORREÇÃO: Salva o texto jurídico atual (se houver)
            const textoJuridicoAtual = document.getElementById("textoGerado").textContent;
            
            // Gera o texto jurídico completo
            criarTexto(); // Isso preenche o campo com o texto completo
            
            // Pega o texto jurídico gerado
            const textoJuridicoCompleto = document.getElementById("textoGerado").textContent;
            
            // Combina briefing + texto jurídico
            const resultadoCompleto = `${briefingGerado}\n\n📌 TL:\n${textoJuridicoCompleto}`;
            
            // Exibe o resultado final
            textoGerado.textContent = resultadoCompleto;
        }
        
        console.log('Briefing gerado com sucesso!');
        
    } catch (error) {
        console.error('Erro em criarBriefing:', error);
        alert('Ocorreu um erro ao gerar o briefing. Por favor, tente novamente.');
    }
}


// ==============================================
// FUNÇÕES AUXILIARES
// ==============================================

/**
 * Obtém o valor de um elemento do DOM
 * @param {string} elementId - ID do elemento
 * @return {string} Valor do elemento ou string vazia se não existir
 */
function getValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value : '';
}

/**
 * Obtém o estado de um checkbox
 * @param {string} elementId - ID do checkbox
 * @return {boolean} Estado do checkbox ou false se não existir
 */
function getCheckboxValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.checked : false;
}

