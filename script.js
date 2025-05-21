// Global variables
let textoFipeInserido = '';
let textoBonusUsadoInserido = '';
const images = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Ativar automaticamente o modo escuro se o navegador estiver configurado assim
    const darkModeButton = document.getElementById('darkModeButton');
    const icon = darkModeButton.querySelector('.material-symbols-outlined');
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        icon.textContent = 'light_mode'; // Ícone de sol (modo claro)
        
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.textContent = 'Desativar Dark Mode';
        }
    } else {
        icon.textContent = 'dark_mode'; // Ícone de lua (modo escuro)
    }

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

// Função para inserir COR de forma automática para cada carro
function setupEventListeners() {

    const coresPorVersao = {
	// LISTA DE CORES PARA MODELOS FIAT
    "ARGO": {
        "1.0 FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "DRIVE 1.0 FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "DRIVE 1.3 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "TREKKING 1.3 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "CINZA SILVERSTONE (metálica)"]
    },
    "CRONOS": {
        "DRIVE 1.0 FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "DRIVE 1.3 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)", "BRANCO ALASKA (perolizada)"],
        "PRECISION 1.3 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)", "BRANCO ALASKA (perolizada)"]
    },
    "DUCATO": {
        "CARGO DIESEL MANUAL": ["BRANCO BANCHISA (sólida) (padrão)", "GRIGIO ARTENSE (metálica)"],
        "MAXICARGO DIESEL MANUAL": ["BRANCO BANCHISA (sólida) (padrão)", "GRIGIO ARTENSE (metálica)"],
        "MULTI DIESEL MANUAL": ["BRANCO BANCHISA (sólida) (padrão)", "GRIGIO ARTENSE (metálica)"],
        "MINIBUS CONFORT 19L DIESEL MANUAL": ["BRANCO BANCHISA (sólida) (padrão)", "GRIGIO ARTENSE (metálica)"],
        "MINIBUS LUXO 16L DIESEL MANUAL": ["BRANCO BANCHISA (sólida) (padrão)", "GRIGIO ARTENSE (metálica)"],
        "MINIBUS EXECUTIVO 17L DIESEL MANUAL": ["BRANCO BANCHISA (sólida) (padrão)", "GRIGIO ARTENSE (metálica)"]
    },
    "FASTBACK": {
        "T200 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "CINZA STRATO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "AUDACE T200 HYBRID AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "BRANCO BANCHISA (sólida)", "AZUL AMALFI (metálica)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)", "CINZA STRATO (metálica)"],
        "IMPETUS T200 HYBRID AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "AZUL AMALFI (metálica)", "CINZA SILVERSTONE (metálica)", "CINZA STRATO (metálica)"],
        "LIMITED EDITION T270 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)", "CINZA STRATO (metálica)"],
        "ABARTH T270 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "CINZA STRATO (metálica)"]
    },
    "FIORINO": {
        "ENDURANCE 1.3 FLEX MANUAL": ["BRANCO BANCHISA (sólida) (padrão)"]
    },
    "MOBI": {
        "LIKE 1.0 FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "TREKKING 1.0 FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"]
    },
    "PULSE": {
        "DRIVE 1.3 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)",  "PRATA BARI (metálica)", "CINZA STRATO (metálica)"],
        "AUDACE T200 HYBRID AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "AZUL AMALFI (metálica)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)", "CINZA STRATO (metálica)"],
        "IMPETUS T200 HYBRID AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "AZUL AMALFI (metálica)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)", "CINZA STRATO (metálica)"],
        "ABARTH T270 FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "CINZA STRATO (metálica)"]
    },
    "SCUDO": {
        "CARGO 1.5 MANUAL TURBODIESEL": ["BRANCO BANCHISA (sólida) (padrão)", "PRETO CARBON (metálica)", "CINZA ALLUMINIUM (metálica)"],
        "MULTI 1.5 MANUAL TURBODIESEL": ["BRANCO BANCHISA (sólida) (padrão)", "PRETO CARBON (metálica)", "CINZA ALLUMINIUM (metálica)"]
    },
    "STRADA": {
        "ENDURANCE 1.3 CP FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "FREEDOM 1.3 CP FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "FREEDOM 1.3 CD FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "VOLCANO 1.3 CD FLEX MANUAL": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "VOLCANO 1.3 CD FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "RANCH TURBO 200 CD FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"],
        "ULTRA TURBO 200 CD FLEX AUTOMÁTICO": ["PRETO VULCANO (sólida) (padrão)", "VERMELHO MONTECARLO (sólida)", "BRANCO BANCHISA (sólida)", "PRATA BARI (metálica)", "CINZA SILVERSTONE (metálica)"]
    },
    "TITANO": {
        "ENDURANCE 2.2 4X4 AUTOMÁTICO DIESEL": ["BRANCO AMBIENTE (sólida) (padrão)", "CINZA BILLET(metálica)"],
        "VOLCANO 2.2 4X4 AUTOMÁTICO DIESEL": ["BRANCO BANCHISA (sólida) (padrão)", "CINZA BILLET(metálica)", "PRETO CARBON (metálica)", "VERMELHO TRAMONTO (metálica)"],
        "RANCH 2.2 4X4 AUTOMÁTICO DIESEL": ["BRANCO BANCHISA (sólida) (padrão)", "CINZA BILLET(metálica)", "PRETO CARBON (metálica)", "VERMELHO TRAMONTO (metálica)"]
    },
    "TORO": {
        "ENDURANCE T270 4X2 FLEX AUTOMÁTICO": ["VERMELHO COLORADO (sólida) (padrão)", "BRANCO AMBIENTE (sólida)", "GRANITE CRYSTAL (metálica)", "PRATA BILLET (metálica)", "PRETO CARBON (metálica)"],
        "FREEDOM T270 4X2 FLEX AUTOMÁTICO": ["VERMELHO COLORADO (sólida) (padrão)", "BRANCO AMBIENTE (sólida)", "GRANITE CRYSTAL (metálica)", "PRATA BILLET (metálica)", "PRETO CARBON (metálica)"],
        "VOLCANO T270 4X2 FLEX AUTOMÁTICO": ["VERMELHO COLORADO (sólida) (padrão)", "AZUL JAZZ (metálica)", "GRANITE CRYSTAL (metálica)", "PRATA BILLET (metálica)", "PRETO CARBON (metálica)", "CINZA STING (perolizada)", "BRANCO POLAR (perolizada)"],
        "ULTRA T270 FLEX AUTOMÁTICO": ["VERMELHO COLORADO (sólida) (padrão)", "AZUL JAZZ (metálica)", "PRETO CARBON (metálica)", "CINZA STING (perolizada)", "BRANCO POLAR (perolizada)", ],
        "VOLCANO 2.0 TURBODIESEL 4X4 AUTOMÁTICO": ["VERMELHO COLORADO (sólida) (padrão)", "AZUL JAZZ (metálica)", "GRANITE CRYSTAL (metálica)", "PRATA BILLET (metálica)", "PRETO CARBON (metálica)", "CINZA STING (perolizada)", "BRANCO POLAR (perolizada)"],
        "RANCH 2.0 TURBODIESEL 4X4 AUTOMÁTICO": ["VERMELHO COLORADO (sólida) (padrão)", "AZUL JAZZ (metálica)", "GRANITE CRYSTAL (metálica)", "PRATA BILLET (metálica)", "PRETO CARBON (metálica)", "CINZA STING (perolizada)", "BRANCO POLAR (perolizada)"]
    },
	// LISTA DE CORES PARA MODELOS JEEP
    "RENEGADE": {
        "1.3 TURBO T270 4X2 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "SPORT T270 4X2 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "ALTITUDE T270 4X2 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "LONGITUDE T270 4X2 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "STING GREY (metálica)", "BRANCO POLAR (perolizada)"],
        "SAHARA T270 4X2 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "SLASH GOLD (perolizada)", "BRANCO POLAR (perolizada)"],
        "TRAILHAWK T270 4X4 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "STING GREY (perolizada)", "BRANCO POLAR (perolizada)"],
        "WILLYS T270 4X4 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "VERDE RECON (perolizada)", "STING GREY (PEROLIZADO)", "BRANCO POLAR (perolizada)"]
    },
    "COMPASS": {
        "SPORT T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "LONGITUDE T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "AZUL JAZZ (metálica)", "PRATA BILLET (metálica)", "CINZA GRANITE (metálica)", "STING GREY (perolizada)", "BRANCO POLAR (perolizada)"],
        "LIMITED T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "SERIE S T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "STING GREY (perolizada)", "BRANCO POLAR (perolizada)"],
        "OVERLAND HURRICANE GASOLINA AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "BLACKHAWK HURRICANE GASOLINA AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "CINZA GRANITE (metálica)", "STING GREY (perolizada)", "BRANCO POLAR (perolizada)"],
        "4XE HIBRIDO PHEV AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "ALPINE WHITE BICOLOR (sólida)", "BLUE SHADE BICOLOR (metálica)"]
    },
    "COMMANDER": {
        "LONGITUDE 5L T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "CINZA GRANITE (metálica)", "BRANCO POLAR (perolizada)"],
        "LIMITED T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "SLASH GOLD (perolizada)", "BRANCO POLAR (perolizada)"],
        "OVERLAND T270 FLEX AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "SLASH GOLD (perolizada)", "BRANCO POLAR (perolizada)"],
        "OVERLAND 2.2 TURBODIESEL 4X4 AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "SLASH GOLD (perolizada)", "BRANCO POLAR (perolizada)"],
        "OVERLAND HURRICANE 4X4 AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "PRATA BILLET (metálica)", "AZUL JAZZ (metálica)", "CINZA GRANITE (metálica)", "SLASH GOLD (perolizada)", "BRANCO POLAR (perolizada)"],
        "BLACKHAWK HURRICANE 4X4 AUTOMÁTICO": ["PRETO CARBON (sólida) (padrão)", "CINZA GRANITE (metálica)", "STING GREY (perolizada)", "BRANCO POLAR (perolizada)"]
    },
    "WRANGLER": {
        "RUBICON 4X4 GASOLINA AUTOMÁTICO": ["BRANCO (sólida) (padrão)", "VERMELHO FIRECRACKER (sólida)", "PRETO (sólida)", "ANVIL (metálica)", "GRANITE CRYSTAL (metálica)", "HYDRO BLUE (metálica)"]
    },
    "GLADIATOR": {
        "RUBICON 4X4 GASOLINA AUTOMÁTICO": ["BRANCO (sólida) (padrão)", "VERMELHO FIRECRACKER (sólida)", "PRETO (sólida)", "ANVIL (metálica)", "GRANITE CRYSTAL (metálica)", "HYDRO BLUE (metálica)"]
    },
    "GRAND CHEROKEE": {
        "4XE HIBRIDO PHEV": ["BRIGHT WHITE (sólida) (padrão)", "MIDNIGHT SKY (metálica)", "BALTIC GREY METALLIC (metálica)", "DIAMOND BLACK (perolizada)"]
    },
	// LISTA DE CORES PARA MODELOS RAM
    "RAMPAGE": {
        "BIG HORN 2.2 TURBODIESEL AT9 4X4": ["VERMELHO FLAME (sólida) (padrão)", "PRETO DIAMOND (sólida)", "STING GREY (perolizada)", "BRANCO PÉROLA (perolizada)", "AZUL PATRIOT (metálica)", "PRATA BILLET (metálica)"],
        "REBEL 2.2 TURBODIESEL AT9 4X4": ["VERMELHO FLAME (sólida) (padrão)", "PRETO DIAMOND (sólida)", "STING GREY (perolizada)", "BRANCO PÉROLA (perolizada)", "MAXIMUM STEEL (metálica)", "AZUL PATRIOT (metálica)", "PRATA BILLET (metálica)"],
        "REBEL 2.0 TURBO GASOLINA AT9 4X4": ["VERMELHO FLAME (sólida) (padrão)", "PRETO DIAMOND (sólida)", "STING GREY (perolizada)", "BRANCO PÉROLA (perolizada)", "MAXIMUM STEEL (metálica)", "AZUL PATRIOT (metálica)", "PRATA BILLET (metálica)"],
        "LARAMIE 2.2 TURBODIESEL AT9 4X4": ["VERMELHO FLAME (sólida) (padrão)", "PRETO DIAMOND (sólida)", "STING GREY (perolizada)", "BRANCO PÉROLA (perolizada)", "MAXIMUM STEEL (metálica)", "AZUL PATRIOT (metálica)", "PRATA BILLET (metálica)"],
        "LARAMIE 2.0 TURBO GASOLINA AT9 4X4": ["VERMELHO FLAME (sólida) (padrão)", "PRETO DIAMOND (sólida)", "STING GREY (perolizada)", "BRANCO PÉROLA (perolizada)", "MAXIMUM STEEL (metálica)", "AZUL PATRIOT (metálica)", "PRATA BILLET (metálica)"],
        "R/T 2.0 TURBO GASOLINA AT9 4X4": ["VERMELHO FLAME (sólida) (padrão)", "PRETO DIAMOND (sólida)", "STING GREY (perolizada)", "BRANCO PÉROLA (perolizada)", "MAXIMUM STEEL (metálica)", "AZUL PATRIOT (metálica)", "PRATA BILLET (metálica)"],
    },
    "1500": {
        "LARAMIE 3.0 BITURBO GASOLINA AT8 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "PRATA BILLET (metálica)", "BRANCO MARFIM (perolizada)", "VERMELHO DELMONICO (perolizada)"],
        "LARAMIE NIGHT EDITION 3.0 BITURBO GASOLINA AT8 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "PRATA BILLET (metálica)", "BRANCO MARFIM (perolizada)"]
    },
    "2500": {
        "LARAMIE 6.7 TURBODIESEL AT6 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "GRANITO CRYSTAL (metálica)", "BRANCO PEROLA (perolizada)", "AZUL PATRIOT (perolizada)", "VERMELHO DELMONICO (perolizada)"],
        "LARAMIE NIGHT EDITION 6.7 TURBODIESEL AT6 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "GRANITO CRYSTAL (metálica)", "BRANCO PEROLA (perolizada)", "AZUL PATRIOT (perolizada)", "VERMELHO DELMONICO (perolizada)"]
    },
    "3500": {
        "LARAMIE 6.7 TURBODIESEL AT6 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "GRANITO CRYSTAL (metálica)", "BRANCO PEROLA (perolizada)", "AZUL PATRIOT (perolizada)", "VERMELHO DELMONICO (perolizada)"],
        "LARAMIE NIGHT EDITION 6.7 TURBODIESEL AT6 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "GRANITO CRYSTAL (metálica)", "BRANCO PEROLA (perolizada)", "AZUL PATRIOT (perolizada)", "VERMELHO DELMONICO (perolizada)"],
        "LIMITED LONGHORN 6.7 TURBODIESEL AT6 4X4": ["PRETO DIAMOND (perolizada) (PADRÃO)", "GRANITO CRYSTAL (metálica)", "BRANCO PEROLA (perolizada)", "AZUL PATRIOT (perolizada)", "VERMELHO DELMONICO (perolizada)"]
    }
};
	// Função para selecionar VERSÃO do carro de acordo com o MODELO selecionado
    console.log('Setting up event listeners...');
	
	
	    const dados = {
      "FIAT": {
		"ARGO": ["1.0 FLEX MANUAL", "DRIVE 1.0 FLEX MANUAL", "DRIVE 1.3 FLEX AUTOMÁTICO", "TREKKING 1.3 FLEX AUTOMÁTICO"],
		"CRONOS": ["DRIVE 1.0 FLEX MANUAL", "DRIVE 1.3 FLEX AUTOMÁTICO", "PRECISION 1.3 FLEX AUTOMÁTICO"],
		"DUCATO": ["CARGO DIESEL MANUAL", "MAXICARGO DIESEL MANUAL", "MULTI DIESEL MANUAL", "MINIBUS CONFORT 19L DIESEL MANUAL", "MINIBUS LUXO 16L DIESEL MANUAL", "MINIBUS EXECUTIVO 17L DIESEL MANUAL"],
		"FASTBACK": ["T200 FLEX AUTOMÁTICO", "AUDACE T200 HYBRID AUTOMÁTICO", "IMPETUS T200 HYBRID AUTOMÁTICO", "LIMITED EDITION T270 FLEX AUTOMÁTICO", "ABARTH T270 FLEX AUTOMÁTICO"],
		"FIORINO": ["ENDURANCE 1.3 FLEX MANUAL"],
		"MOBI": ["LIKE 1.0 FLEX MANUAL", "TREKKING 1.0 FLEX MANUAL"],
		"PULSE": ["DRIVE 1.3 FLEX AUTOMÁTICO", "AUDACE T200 HYBRID AUTOMÁTICO", "IMPETUS T200 HYBRID AUTOMÁTICO", "ABARTH T270 FLEX AUTOMÁTICO"],
		"SCUDO": ["CARGO 1.5 MANUAL TURBODIESEL", "MULTI 1.5 MANUAL TURBODIESEL"],
		"STRADA": ["ENDURANCE 1.3 CP FLEX MANUAL", "FREEDOM 1.3 CP FLEX MANUAL", "FREEDOM 1.3 CD FLEX MANUAL", "VOLCANO 1.3 CD FLEX MANUAL", "VOLCANO 1.3 CD FLEX AUTOMÁTICO", "RANCH TURBO 200 CD FLEX AUTOMÁTICO", "ULTRA TURBO 200 CD FLEX AUTOMÁTICO"],
		"TITANO": ["ENDURANCE 2.2 4X4 AUTOMÁTICO DIESEL", "VOLCANO 2.2 4X4 AUTOMÁTICO DIESEL", "RANCH 2.2 4X4 AUTOMÁTICO DIESEL"],
		"TORO": ["ENDURANCE T270 4X2 FLEX AUTOMÁTICO", "FREEDOM T270 4X2 FLEX AUTOMÁTICO", "VOLCANO T270 4X2 FLEX AUTOMÁTICO", "ULTRA T270 FLEX AUTOMÁTICO", "VOLCANO 2.0 TURBODIESEL 4X4 AUTOMÁTICO", "RANCH 2.0 TURBODIESEL 4X4 AUTOMÁTICO"],
      },
      "JEEP": {
        "RENEGADE": ["1.3 TURBO T270 4X2 FLEX AUTOMÁTICO", "SPORT T270 4X2 FLEX AUTOMÁTICO", "ALTITUDE T270 4X2 FLEX AUTOMÁTICO", "LONGITUDE T270 4X2 FLEX AUTOMÁTICO", "SAHARA T270 4X2 FLEX AUTOMÁTICO", "TRAILHAWK T270 4X4 FLEX AUTOMÁTICO", "WILLYS T270 4X4 FLEX AUTOMÁTICO"],
        "COMPASS": ["SPORT T270 FLEX AUTOMÁTICO", "LONGITUDE T270 FLEX AUTOMÁTICO", "LIMITED T270 FLEX AUTOMÁTICO", "SERIE S T270 FLEX AUTOMÁTICO", "OVERLAND HURRICANE GASOLINA AUTOMÁTICO", "BLACKHAWK HURRICANE GASOLINA AUTOMÁTICO", "4XE HIBRIDO PHEV AUTOMÁTICO"],
        "COMMANDER": ["LONGITUDE 5L T270 FLEX AUTOMÁTICO", "LIMITED T270 FLEX AUTOMÁTICO", "OVERLAND T270 FLEX AUTOMÁTICO", "OVERLAND 2.2 TURBODIESEL 4X4 AUTOMÁTICO", "OVERLAND HURRICANE 4X4 AUTOMÁTICO", "BLACKHAWK HURRICANE 4X4 AUTOMÁTICO"],
        "WRANGLER": ["RUBICON 4X4 GASOLINA AUTOMÁTICO"],
		"GLADIATOR": ["RUBICON 4X4 GASOLINA AUTOMÁTICO"],
		"GRAND CHEROKEE": ["4XE HIBRIDO PHEV"],
      },
      "RAM": {
        "RAMPAGE": ["BIG HORN 2.2 TURBODIESEL AT9 4X4", "REBEL 2.2 TURBODIESEL AT9 4X4", "REBEL 2.0 TURBO GASOLINA AT9 4X4", "LARAMIE 2.2 TURBODIESEL AT9 4X4", "LARAMIE 2.0 TURBO GASOLINA AT9 4X4", "R/T 2.0 TURBO GASOLINA AT9 4X4"],
        "1500": ["LARAMIE 3.0 BITURBO GASOLINA AT8 4X4", "LARAMIE NIGHT EDITION 3.0 BITURBO GASOLINA AT8 4X4"],
        "2500": ["LARAMIE 6.7 TURBODIESEL AT6 4X4", "LARAMIE NIGHT EDITION 6.7 TURBODIESEL AT6 4X4"],
        "3500": ["LARAMIE 6.7 TURBODIESEL AT6 4X4", "LARAMIE NIGHT EDITION 6.7 TURBODIESEL AT6 4X4", "LIMITED LONGHORN 6.7 TURBODIESEL AT6 4X4"],
      }
    };

    const modeloSelect = document.getElementById("modelo");
    const versaoSelect = document.getElementById("versao");

// evento de change da marca
document.querySelectorAll('input[name="marca"]').forEach(radio => {
    radio.addEventListener("change", function () {
        const marca = this.value;
        modeloSelect.innerHTML = '<option value="">Selecione o modelo</option>';
        versaoSelect.innerHTML = '<option value="">Selecione a versão</option>';
        versaoSelect.disabled = true;
        
        // Resetar e desabilitar o campo de cor
        const nomeCorSelect = document.getElementById("nomeCor");
        nomeCorSelect.innerHTML = '<option value="">Selecione a Cor</option>';
        nomeCorSelect.disabled = true;

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

// evento de change do modelo
modeloSelect.addEventListener("change", function() {
    const marca = document.querySelector('input[name="marca"]:checked')?.value;
    const modelo = this.value;
    versaoSelect.innerHTML = '<option value="">Selecione a versão</option>';
    
    // Resetar e desabilitar o campo de cor
    const nomeCorSelect = document.getElementById("nomeCor");
    nomeCorSelect.innerHTML = '<option value="">Selecione a Cor</option>';
    nomeCorSelect.disabled = true;

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

// evento para a versão
versaoSelect.addEventListener("change", function() {
    const marca = document.querySelector('input[name="marca"]:checked')?.value;
    const modelo = modeloSelect.value;
    const versao = this.value;
    const nomeCorSelect = document.getElementById("nomeCor");

    if (nomeCorSelect) {
        nomeCorSelect.innerHTML = '<option value="">Selecione a Cor</option>';
        nomeCorSelect.disabled = true;

        // Verifica se há cores para esta combinação marca/modelo/versão
        if (marca && modelo && versao && coresPorVersao[modelo] && coresPorVersao[modelo][versao]) {
            coresPorVersao[modelo][versao].forEach(cor => {
                const opt = document.createElement("option");
                opt.value = cor;
                opt.textContent = cor;
                nomeCorSelect.appendChild(opt);
            });
            nomeCorSelect.disabled = false;
        }
    }
});


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

    // Opcional checkbox
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
    
    // Redirecionamento do botão FIPE para o formulário de TABELA FIPE
    const tlFipeBtn = document.querySelector(".tl-fipe-btn");
    if (tlFipeBtn) {
        tlFipeBtn.addEventListener("click", function() {
            window.open('FIPE/index.html', '_blank');
        });
    }
	
    // Redirecionamento do botão BÔNUS para o formulário de BÔNUS NO USADO
    const tlBonusBtn = document.querySelector(".tl-bonus-usado-btn");
    if (tlBonusBtn) {
        tlBonusBtn.addEventListener("click", function() {
            window.open('Bônus no Usado/index.html', '_blank');
        });
    }
	
	const darkModeToggle = document.getElementById('darkModeToggle');
	if (darkModeToggle) {
		darkModeToggle.addEventListener('click', function () {
			document.body.classList.toggle('dark-mode');
			darkModeToggle.textContent = document.body.classList.contains('dark-mode') 
				? 'Desativar Dark Mode' 
				: 'Ativar Dark Mode';
		});
	}
	
	document.getElementById('darkModeButton').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    const icon = this.querySelector('.material-symbols-outlined');
    if (document.body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode'; // Ícone de sol (modo claro)
    } else {
        icon.textContent = 'dark_mode'; // Ícone de lua (modo escuro)
    }
});

	

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
        const nomeCor = getValue("nomeCor");
        const priceDE = getValue("priceDE");
        const pricePOR = getValue("pricePOR");
        const comusadonatroca = getValue("comusadonatroca"); // Changed from checkbox to select
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
        let textoFinal = `${marca} ${modelo} ${versao}, 0km`;
        
        textoFinal += `, ${anoModelo}, `;

        if (chassiUnico && numeroChassi) {
            textoFinal += `chassi final ${numeroChassi}, `;
        }

        if (opcional && nomeOpcional) {
            textoFinal += `opcional incluso ${nomeOpcional}, `;
        } else {
            textoFinal += "sem opcional, ";
        }

        textoFinal += `cor ${nomeCor}, com valor à vista `;
        textoFinal += `de ${priceDE}`;

        if (pricePOR && pricePOR.trim() !== '') {
            textoFinal += ` por ${pricePOR}`;
        }
        
        if (comusadonatroca && comusadonatroca.trim() !== '') {
            textoFinal += ` com ${comusadonatroca.toLowerCase()}`;
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
		
		
        if (getCheckboxValue("bonusAcessoriosCheckbox") && bonusAcessorios && bonusAcessorios.trim() !== '') {
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
