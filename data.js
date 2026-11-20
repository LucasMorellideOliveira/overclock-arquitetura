// =====================================================================
//  OVERCLOCK — banco de perguntas
//  Fonte: livro "[SP3 MAT3] Tópicos de Arquitetura Computacional" (SPTech)
//
//  Cada item:
//    id  identificador único
//    b   chefe/andar a que pertence
//    g   grupo (usado para sortear alternativas erradas parecidas)
//    q   a dica / pergunta que aparece na tela
//    ok  a resposta certa
//    al  outras formas aceitas ao digitar (opcional)
//    no  alternativas erradas fixas (opcional; sem isso o jogo sorteia do grupo)
//    x   explicação mostrada na Lista de Vingança
//  Respostas curtas (até 22 letras) entram também na Chuva e no Digita aí.
// =====================================================================

const BOSSES = [
  { id: 'b1', andar: 1, cap: 'Cap. 2', tema: 'Do circuito ao computador', nome: 'Golem de Silício', cor: '#7ee081', fala: 'Sem os três blocos, você não passa!' },
  { id: 'b2', andar: 2, cap: 'Cap. 2.1', tema: 'Dentro da CPU', nome: 'Hidra Tríplice', cor: '#ff9f43', fala: 'Três cabeças: ULA, UC e registradores.' },
  { id: 'b3', andar: 3, cap: 'Cap. 2.2', tema: 'Ciclo de busca e execução', nome: 'Ciclope do Clock', cor: '#54a0ff', fala: 'Busca, executa, busca, executa...' },
  { id: 'b4', andar: 4, cap: 'Cap. 3 e 3.1', tema: 'Micro x microcontrolador e Arduino', nome: 'Quimera ATmega', cor: '#c56cf0', fala: 'Vinte e oito pernas para te esmagar.' },
  { id: 'b5', andar: 5, cap: 'Cap. 4', tema: 'Barramentos', nome: 'Serpente do Barramento', cor: '#ffd32a', fala: 'Onde? O quê? Quando? Responda!' },
  { id: 'b6', andar: 6, cap: 'Cap. 5 e 5.1', tema: 'Memórias e hierarquia', nome: 'Esfinge da Memória', cor: '#18dcff', fala: 'Volátil ou não volátil? Decida rápido.' },
  { id: 'b7', andar: 7, cap: 'Cap. 6', tema: 'DMA', nome: 'Polvo DMA', cor: '#ff6b81', fala: 'Eu copio tudo sem a CPU encostar.' },
  { id: 'b8', andar: 8, cap: 'Cap. 7', tema: 'Desempenho e diagrama de tempo', nome: 'Relojoeiro Sombrio', cor: '#a4b0be', fala: 'Período, CPI... faça as contas!' },
  { id: 'final', andar: 9, cap: 'Livro todo', tema: 'A Prova', nome: 'Kernel Panic', cor: '#ff4757', fala: 'Tudo o que você errou volta agora.' },
];

const ITEMS = [
  // ---------------- ANDAR 1 · Do circuito ao computador ----------------
  { id: 'c01', b: 'b1', g: 'blocos', q: 'Um dos três blocos do computador: busca e executa as instruções do programa', ok: 'CPU', al: ['unidade central de processamento', 'processador'], x: 'A CPU é o bloco que busca e executa as instruções. No Arduino, é o núcleo do ATmega328P.' },
  { id: 'c02', b: 'b1', g: 'blocos', q: 'Bloco do computador que guarda as instruções e os dados', ok: 'Memória', x: 'Memória guarda dados + instruções. No Arduino: a Flash e a RAM do chip.' },
  { id: 'c03', b: 'b1', g: 'blocos', q: 'Bloco que troca dados com o mundo de fora: sensor, LED, cabo USB', ok: 'Entrada e saída', al: ['e/s', 'es', 'entrada e saida', 'entrada/saida', 'io', 'i/o'], x: 'Entrada e saída (E/S) liga o computador ao mundo: o LM35 é entrada; o LED e o USB, saída/comunicação.' },
  { id: 'c04', b: 'b1', g: 'blocos', q: 'Conjunto de fios que liga CPU, memória e entrada e saída', ok: 'Barramento', x: 'O barramento é o conjunto de fios compartilhado que liga os três blocos.' },
  { id: 'c05', b: 'b1', g: 'blocos', q: 'O sensor de temperatura LM35 do kit pertence a qual bloco?', ok: 'Entrada e saída', al: ['e/s', 'entrada e saida', 'entrada', 'io'], x: 'O LM35 é um dispositivo de entrada, então pertence ao bloco de entrada e saída.' },
  { id: 'c06', b: 'b1', g: 'ideias', q: 'Ideia de 1945: as instruções ficam guardadas na mesma memória que os dados', ok: 'Programa armazenado', al: ['arquitetura de von neumann', 'von neumann'], x: 'Programa armazenado (arquitetura de von Neumann): instruções guardadas como números na mesma memória dos dados.' },
  { id: 'c07', b: 'b1', g: 'ideias', q: 'Quem descreveu, em 1945, o computador com programa armazenado?', ok: 'Von Neumann', al: ['john von neumann', 'neumann'], no: ['Tanenbaum', 'Stallings', 'Norvig'], x: 'John von Neumann, em 1945. Por isso se fala em "arquitetura de von Neumann".' },
  { id: 'c08', b: 'b1', g: 'escada', q: 'Degrau da escada: XOR + AND somam 2 bits', ok: 'Meio somador', al: ['meio-somador', 'half adder'], x: 'O meio somador usa uma porta XOR (soma) e uma AND (vai-um) para somar 2 bits.' },
  { id: 'c09', b: 'b1', g: 'escada', q: 'Degrau da escada formado por CPU + memória + entrada e saída', ok: 'Computador', x: 'Escada: porta lógica → meio somador → ULA → CPU → computador (CPU + memória + E/S).' },
  { id: 'c10', b: 'b1', g: 'escada', q: 'Na escada do livro, qual degrau vem logo depois da ULA?', ok: 'CPU', no: ['Meio somador', 'Computador', 'Porta lógica'], x: 'Depois da ULA vem a CPU (ULA + UC + registradores).' },
  { id: 'c11', b: 'b1', g: 'escada', q: 'Chave eletrônica minúscula; as portas lógicas são feitas dela', ok: 'Transistor', al: ['transistores'], x: 'O transistor é a chave eletrônica de que as portas lógicas são feitas (glossário).' },
  { id: 'c12', b: 'b1', g: 'mcq', q: 'Você gravou um programa novo no Arduino. O que mudou na placa?', ok: 'Só o conteúdo da memória', no: ['Os fios da placa', 'O chip ATmega328P', 'A velocidade do clock'], x: 'Nada no hardware muda: muda o conteúdo da memória onde o programa fica. É a ideia do programa armazenado.' },

  // ---------------- ANDAR 2 · Dentro da CPU ----------------
  { id: 'p01', b: 'b2', g: 'cpu', q: 'Parte da CPU que faz as contas e as operações lógicas (AND, OR, XOR, NOT)', ok: 'ULA', al: ['unidade logica e aritmetica', 'alu'], x: 'ULA = Unidade Lógica e Aritmética: soma, subtração e operações lógicas.' },
  { id: 'p02', b: 'b2', g: 'cpu', q: 'Parte da CPU que lê a instrução, descobre o que ela pede e envia as ordens', ok: 'UC', al: ['unidade de controle'], x: 'UC = Unidade de Controle: interpreta a instrução e comanda as outras partes.' },
  { id: 'p03', b: 'b2', g: 'cpu', q: 'Memória minúscula dentro da CPU: a mais rápida e a menor do computador', ok: 'Registrador', al: ['registradores'], x: 'Registradores ficam colados na ULA: são a memória mais rápida e a menor (poucos bytes).' },
  { id: 'p04', b: 'b2', g: 'cpu', q: 'Registrador que recebe o resultado das operações da ULA', ok: 'Acumulador', x: 'O acumulador guarda o resultado da ULA e, em geral, um dos valores da conta.' },
  { id: 'p05', b: 'b2', g: 'cpu', q: 'Registrador que guarda o endereço da PRÓXIMA instrução', ok: 'Contador de Programa', al: ['pc', 'program counter', 'contador de programas'], x: 'O Contador de Programa (PC) aponta para o endereço da próxima instrução na memória.' },
  { id: 'p06', b: 'b2', g: 'cpu', q: 'Registrador que guarda a instrução que está sendo executada AGORA', ok: 'Registrador de Instrução', al: ['ri', 'registrador de instrucoes', 'ir', 'instruction register'], x: 'O Registrador de Instrução guarda a instrução em execução neste momento.' },
  { id: 'p07', b: 'b2', g: 'cpu', q: 'Na cozinha da CPU, quem é o chef que dá as ordens?', ok: 'UC', al: ['unidade de controle'], x: 'Analogia do livro: a ULA cozinha, a UC é o chef, os registradores são a bancada.' },
  { id: 'p08', b: 'b2', g: 'cpu', q: 'Na cozinha da CPU, quem é que cozinha (faz as contas)?', ok: 'ULA', al: ['unidade logica e aritmetica'], x: 'A ULA é quem "cozinha": faz as contas e as operações lógicas.' },
  { id: 'p09', b: 'b2', g: 'cpu', q: 'Na cozinha da CPU, o que é a bancada onde o dado fica enquanto é usado?', ok: 'Registrador', al: ['registradores'], x: 'Os registradores são a bancada: guardam o dado que está sendo usado agora.' },
  { id: 'p10', b: 'b2', g: 'mcq', q: 'Depois de executar ADD 2, 2, onde está o resultado 4?', ok: 'No acumulador', no: ['No Contador de Programa', 'No Registrador de Instrução', 'Na UC'], x: 'A ULA calcula 2 + 2 = 4 e o acumulador recebe o 4.' },
  { id: 'p11', b: 'b2', g: 'mcq', q: 'Em ADD 2, 2, quem reconhece que é uma soma e manda a ULA somar?', ok: 'A UC', no: ['A ULA', 'O acumulador', 'O Contador de Programa'], x: 'Passo 2: a UC reconhece que é soma e ordena à ULA que some.' },
  { id: 'p12', b: 'b2', g: 'mcq', q: 'Dentro da CPU, a sigla PC significa…', ok: 'Program Counter', no: ['Personal Computer', 'Processador Central', 'Porta de Controle'], x: 'Em arquitetura, PC = Program Counter (Contador de Programa). Não é "computador pessoal".' },
  { id: 'p13', b: 'b2', g: 'mcq', q: 'Em ADD 2, 2, qual é o último passo?', ok: 'O PC aponta para a próxima instrução', no: ['A ULA calcula 2 + 2', 'O acumulador recebe o 4', 'A UC reconhece a soma'], x: 'Ordem: RI guarda a instrução → UC reconhece → ULA calcula → acumulador recebe o 4 → PC avança.' },

  // ---------------- ANDAR 3 · Ciclo de busca e execução ----------------
  { id: 'k01', b: 'b3', g: 'ciclo', q: 'Sinal que zera o Contador de Programa quando a placa liga', ok: 'Reset', al: ['reinicializacao', 'sinal de reset'], x: 'O reset zera o PC, por isso o programa sempre começa do início, inclusive ao apertar RESET.' },
  { id: 'k02', b: 'b3', g: 'ciclo', q: 'Relógio interno que dá o ritmo da CPU', ok: 'Clock', x: 'O clock dá o ritmo do ciclo de busca e execução. No Uno, 16 MHz.' },
  { id: 'k03', b: 'b3', g: 'num', q: 'Frequência do clock do Arduino Uno', ok: '16 MHz', al: ['16', '16mhz', '16 mega hertz'], no: ['8 MHz', '1 GHz', '32 MHz'], x: '16 MHz = 16 milhões de batidas por segundo.' },
  { id: 'k04', b: 'b3', g: 'ciclo', q: 'Fase em que a CPU lê a instrução no endereço do PC e a coloca no Registrador de Instrução', ok: 'Busca', al: ['ciclo de busca', 'fetch', 'buscar'], x: 'Ciclo de busca: lê a instrução apontada pelo PC, coloca no RI e o PC avança.' },
  { id: 'k05', b: 'b3', g: 'ciclo', q: 'Fase em que a UC interpreta a instrução e manda fazer o que ela pede', ok: 'Execução', al: ['ciclo de execucao', 'execute', 'executar'], x: 'Ciclo de execução: a UC interpreta e manda fazer (conta na ULA, mover dado, ler sensor).' },
  { id: 'k06', b: 'b3', g: 'ciclo', q: 'Passo em que a UC traduz o código e descobre o que a instrução pede', ok: 'Decodificar', al: ['decodificacao', 'decode', 'decodifica'], x: 'Os 4 passos: buscar (fetch), decodificar (decode), executar (execute), guardar (write back).' },
  { id: 'k07', b: 'b3', g: 'ingles', q: 'Nome em inglês do passo "guardar o resultado"', ok: 'Write back', al: ['writeback', 'write-back'], x: 'Guardar o resultado num registrador ou na memória = write back.' },
  { id: 'k08', b: 'b3', g: 'ingles', q: 'Nome em inglês do passo "buscar a instrução na memória"', ok: 'Fetch', x: 'Buscar = fetch.' },
  { id: 'k09', b: 'b3', g: 'ingles', q: 'Nome em inglês do passo "decodificar"', ok: 'Decode', x: 'Decodificar = decode.' },
  { id: 'k10', b: 'b3', g: 'mcq', q: 'Em qual fase o PC avança para a próxima instrução?', ok: 'No ciclo de busca', no: ['No ciclo de execução', 'No write back', 'Só no reset'], x: 'No ciclo de busca, logo depois de a instrução ser lida.' },
  { id: 'k11', b: 'b3', g: 'mcq', q: 'Qual é a ordem certa dos quatro passos?', ok: 'Buscar → decodificar → executar → guardar', no: ['Decodificar → buscar → executar → guardar', 'Buscar → executar → decodificar → guardar', 'Executar → buscar → guardar → decodificar'], x: 'Buscar, decodificar, executar, guardar o resultado.' },
  { id: 'k12', b: 'b3', g: 'mcq', q: 'Você apertou RESET no Arduino. Por que o programa voltou ao início?', ok: 'O reset zera o Contador de Programa', no: ['O reset apaga a memória Flash', 'O reset desliga o clock', 'O reset limpa o acumulador'], x: 'O reset zera o PC, que volta a apontar para a primeira instrução.' },
  { id: 'k13', b: 'b3', g: 'mcq', q: 'Instruções e dados entram na CPU por qual caminho?', ok: 'Barramento de dados', no: ['Barramento de endereço', 'Barramento de controle', 'Pela cache'], x: 'Instruções e dados entram pelo mesmo caminho: o barramento de dados.' },
  { id: 'k14', b: 'b3', g: 'mcq', q: 'As duas fases e os quatro passos são ciclos diferentes?', ok: 'Não, os 4 passos detalham as 2 fases', no: ['Sim, um é do Arduino e outro do PC', 'Sim, o de 4 passos é mais rápido', 'Sim, o de 2 fases é mais antigo'], x: 'É o mesmo ciclo: a versão em quatro passos só detalha o que acontece em busca e execução.' },

  // ---------------- ANDAR 4 · Micro x microcontrolador e Arduino ----------------
  { id: 'm01', b: 'b4', g: 'chips', q: 'CPU num único chip, que depende de RAM e armazenamento fora dele', ok: 'Microprocessador', x: 'O microprocessador sozinho não funciona: RAM, SSD e placa-mãe ficam fora. Ex.: Intel Core, AMD Ryzen.' },
  { id: 'm02', b: 'b4', g: 'chips', q: 'Reúne CPU, memória e entrada e saída num único chip, para uma tarefa específica', ok: 'Microcontrolador', x: 'Microcontrolador = computador completo e pequeno num chip. Ex.: ATmega328P, ESP32, PIC.' },
  { id: 'm03', b: 'b4', g: 'chipnomes', q: 'O chip preto de 28 pernas no meio do Arduino Uno', ok: 'ATmega328P', al: ['atmega', 'atmega328', 'atmega 328p', 'atmega 328'], x: 'O ATmega328P é o microcontrolador do Uno. "Arduino" é o nome da placa.' },
  { id: 'm04', b: 'b4', g: 'chipnomes', q: 'Microcontrolador que já vem com Wi-Fi e Bluetooth', ok: 'ESP32', al: ['esp 32', 'esp-32'], x: 'O ESP32 já vem com Wi-Fi e Bluetooth e, ao contrário do ATmega328P, tem DMA.' },
  { id: 'm05', b: 'b4', g: 'perif', q: 'Transforma a tensão do sensor em um número; trabalha no analogRead()', ok: 'Conversor analógico-digital', al: ['adc', 'conversor ad', 'conversor a/d', 'conversor analogico digital', 'cad'], x: 'O conversor analógico-digital transforma a tensão vinda do sensor em um número.' },
  { id: 'm06', b: 'b4', g: 'perif', q: 'Programa gravado no chip que define o que a placa faz', ok: 'Firmware', x: 'Firmware = o código que você escreve na IDE, gravado na Flash.' },
  { id: 'm07', b: 'b4', g: 'perif', q: 'Troca dados com o computador pelo cabo USB; usa os pinos 0 e 1', ok: 'Comunicação serial', al: ['serial', 'comunicacao serial'], x: 'A comunicação serial é como a sua API conversa com o Arduino pelo USB.' },
  { id: 'm08', b: 'b4', g: 'mcq', q: 'Arduino é microcontrolador ou microprocessador?', ok: 'Nenhum: é a placa; o chip é microcontrolador', no: ['Microprocessador', 'Os dois ao mesmo tempo', 'Microcontrolador sem memória'], x: 'Arduino é o nome da placa. O ATmega328P, no meio dela, é que é o microcontrolador.' },
  { id: 'm09', b: 'b4', g: 'mcq', q: 'A máquina de lavar controla as etapas e liga o motor. Ela usa um…', ok: 'Microcontrolador', no: ['Microprocessador', 'Intel Core', 'Controlador de DMA'], x: 'Tarefa específica, baixo custo, tudo num chip: microcontrolador.' },
  { id: 'm10', b: 'b4', g: 'mcq', q: 'Qual destes é um MICROPROCESSADOR?', ok: 'Intel Core', no: ['ATmega328P', 'ESP32', 'PIC'], x: 'Intel Core e AMD Ryzen são microprocessadores. ATmega328P, ESP32 e PIC são microcontroladores.' },
  { id: 'm11', b: 'b4', g: 'num', q: 'Tamanho da memória Flash do Arduino Uno (onde fica o programa)', ok: '32 KB', al: ['32', '32kb'], no: ['2 KB', '1 KB', '16 KB'], x: 'Uno: Flash 32 KB (programa), RAM 2 KB (variáveis), EEPROM 1 KB.' },
  { id: 'm12', b: 'b4', g: 'num', q: 'Tamanho da RAM do Arduino Uno (onde ficam as variáveis)', ok: '2 KB', al: ['2', '2kb'], no: ['32 KB', '1 KB', '16 KB'], x: 'RAM de 2 KB = 2.048 bytes.' },
  { id: 'm13', b: 'b4', g: 'num', q: 'Tamanho da EEPROM do Arduino Uno', ok: '1 KB', al: ['1', '1kb'], no: ['2 KB', '32 KB', '512 bytes'], x: 'EEPROM de 1 KB: dados que o programa guarda e sobrevivem ao desligamento.' },
  { id: 'm14', b: 'b4', g: 'num', q: 'Tensão recomendada para alimentar o Uno pelo conector de energia', ok: '7 a 12 V', al: ['7 a 12', '7-12v', '7-12', '7 a 12v'], no: ['3,3 a 5 V', '12 a 24 V', '1 a 5 V'], x: 'Entrada recomendada de 7 a 12 V pelo conector (ou 5 V pelo USB).' },
  { id: 'm15', b: 'b4', g: 'num', q: 'Quantos pinos digitais tem o Arduino Uno?', ok: '14', no: ['6', '20', '28'], x: 'O Uno tem 14 pinos digitais e 6 entradas analógicas (A0 a A5).' },
  { id: 'm16', b: 'b4', g: 'num', q: 'Quantas entradas analógicas tem o Arduino Uno?', ok: '6', al: ['seis'], no: ['14', '8', '4'], x: '6 entradas analógicas: A0 a A5 (é onde o LM35 entra).' },
  { id: 'm17', b: 'b4', g: 'mcq', q: 'Consumo de energia do microcontrolador, comparado ao microprocessador', ok: 'Baixo', no: ['Alto', 'Igual', 'Depende do clock só'], x: 'Microcontrolador: consumo baixo, custo baixo, flexibilidade média.' },
  { id: 'm18', b: 'b4', g: 'mcq', q: 'Por que um notebook não funciona só com o processador?', ok: 'Ele depende de RAM e armazenamento fora do chip', no: ['O processador não tem ULA', 'O processador não tem clock', 'Falta um conversor analógico-digital'], x: 'O microprocessador depende de RAM e armazenamento que ficam fora do chip.' },

  // ---------------- ANDAR 5 · Barramentos ----------------
  { id: 'r01', b: 'b5', g: 'barr', q: 'Barramento que responde ONDE? e só sai da CPU', ok: 'Barramento de endereço', al: ['endereco', 'de endereco', 'barramento de enderecos'], x: 'O barramento de endereço leva a posição que a CPU quer acessar. É a CPU que escolhe onde ler ou escrever.' },
  { id: 'r02', b: 'b5', g: 'barr', q: 'Barramento que responde O QUÊ? e vai e volta com valores e instruções', ok: 'Barramento de dados', al: ['dados', 'de dados'], x: 'O barramento de dados leva o valor lido ou escrito, e também as instruções.' },
  { id: 'r03', b: 'b5', g: 'barr', q: 'Barramento que responde QUANDO e COMO? (leitura ou escrita, ritmo do clock)', ok: 'Barramento de controle', al: ['controle', 'de controle'], x: 'O barramento de controle diz se é leitura ou escrita, se é memória ou E/S, e o ritmo.' },
  { id: 'r04', b: 'b5', g: 'num', q: 'Quantos endereços cabem com 3 fios de endereço?', ok: '8', no: ['3', '6', '16'], x: '2³ = 8.' },
  { id: 'r05', b: 'b5', g: 'num', q: 'Quantos endereços cabem com 8 fios de endereço?', ok: '256', no: ['64', '128', '512'], x: '2⁸ = 256.' },
  { id: 'r06', b: 'b5', g: 'num', q: 'Quantos endereços com 11 fios? (é o tamanho da RAM do Uno)', ok: '2.048', al: ['2048'], no: ['1.024', '4.096', '1.100'], x: '2¹¹ = 2.048 = 2 KB, a RAM do Uno.' },
  { id: 'r07', b: 'b5', g: 'num', q: 'Quantos endereços cabem com 16 fios de endereço?', ok: '65.536', al: ['65536'], no: ['32.768', '256', '16.000'], x: '2¹⁶ = 65.536.' },
  { id: 'r08', b: 'b5', g: 'num', q: 'Quantos fios de endereço são necessários para 65.536 posições?', ok: '16', no: ['8', '32', '64'], x: '16, porque 2¹⁶ = 65.536.' },
  { id: 'r09', b: 'b5', g: 'mcq', q: 'Barramento de dados de 4 bits e de endereço de 3 bits. Quantas posições de memória?', ok: '8', no: ['16', '128', '12'], x: '2³ = 8. O barramento de dados não entra na conta de endereços.' },
  { id: 'r10', b: 'b5', g: 'mcq', q: 'Com n fios de endereço, quantos endereços existem?', ok: '2ⁿ', no: ['n²', '2 × n', 'n + 2'], x: 'Cada fio vale 0 ou 1: n fios dão 2ⁿ combinações.' },
  { id: 'r11', b: 'b5', g: 'mcq', q: 'Leitura de memória: qual é o PRIMEIRO passo?', ok: 'A CPU põe o endereço no barramento de endereço', no: ['A memória põe o dado no barramento de dados', 'A CPU copia o valor para um registrador', 'O DMA avisa a CPU'], x: '1) endereço no barramento de endereço; 2) controle: "leitura na memória"; 3) memória põe o dado no barramento de dados; 4) CPU copia para um registrador.' },
  { id: 'r12', b: 'b5', g: 'mcq', q: 'Com 32 fios de endereço, a CPU alcança cerca de…', ok: '4,3 bilhões de endereços', no: ['32 mil endereços', '65 mil endereços', '1 milhão de endereços'], x: '2³² = 4.294.967.296, cerca de 4,3 bilhões.' },
  { id: 'r13', b: 'b5', g: 'unid', q: 'Cada fio do barramento transporta, por vez, um…', ok: 'Bit', al: ['1 bit', 'um bit'], no: ['Byte', 'Endereço', 'Kilobyte'], x: 'Cada fio transporta um bit por vez: 0 ou 1.' },

  // ---------------- ANDAR 6 · Memórias e hierarquia ----------------
  { id: 'e01', b: 'b6', g: 'mem', q: 'Memória de trabalho, volátil: guarda os programas em execução e seus dados', ok: 'RAM', al: ['memoria ram', 'random access memory'], x: 'RAM = memória de acesso aleatório. Volátil. Uno: 2 KB.' },
  { id: 'e02', b: 'b6', g: 'mem', q: 'Memória "somente leitura" que guarda o firmware de inicialização (BIOS/UEFI)', ok: 'ROM', al: ['read only memory'], x: 'ROM é não volátil e guarda o que o equipamento precisa para começar. Hoje, quase sempre é feita com Flash.' },
  { id: 'e03', b: 'b6', g: 'mem', q: 'Não volátil e regravável, a mesma tecnologia do pendrive', ok: 'Flash', al: ['memoria flash'], x: 'A Flash guarda o programa do Arduino e permite atualizar firmware.' },
  { id: 'e04', b: 'b6', g: 'mem', q: 'Memória de 1 KB do Uno onde o programa guarda dados que sobrevivem ao desligamento', ok: 'EEPROM', x: 'EEPROM: não volátil, usada para coisas como uma configuração.' },
  { id: 'e05', b: 'b6', g: 'mem', q: 'Pequena e muito rápida, dentro do processador: cópia do que a CPU usou há pouco', ok: 'Cache', al: ['memoria cache'], x: 'A cache evita ir à RAM, mais lenta. É volátil. O ATmega328P não tem cache.' },
  { id: 'e06', b: 'b6', g: 'vol', q: 'Tipo de memória que PERDE o conteúdo quando a energia acaba', ok: 'Volátil', al: ['volatil'], no: ['Não volátil', 'Regravável', 'Somente leitura'], x: 'Volátil perde (RAM, cache, registradores). Não volátil mantém (Flash, ROM, SSD).' },
  { id: 'e07', b: 'b6', g: 'vol', q: 'Tipo de memória que MANTÉM o conteúdo sem energia', ok: 'Não volátil', al: ['nao volatil', 'nao-volatil'], no: ['Volátil', 'Cache', 'Dinâmica'], x: 'Não volátil mantém o conteúdo: Flash, ROM, EEPROM, SSD e HD.' },
  { id: 'e08', b: 'b6', g: 'mem2', q: 'Organização das memórias em níveis: registradores, cache, RAM e armazenamento', ok: 'Hierarquia de memória', al: ['hierarquia de memorias', 'hierarquia', 'piramide de memoria'], x: 'Quanto mais perto da CPU: mais rápida, menor e mais cara por byte.' },
  { id: 'e09', b: 'b6', g: 'mem2', q: 'Única camada da pirâmide que NÃO é volátil (SSD ou HD)', ok: 'Armazenamento', al: ['ssd', 'hd', 'disco'], x: 'O armazenamento guarda arquivos e programas de forma permanente.' },
  { id: 'e10', b: 'b6', g: 'mem2', q: 'Topo da pirâmide: a memória mais rápida, menor e mais cara por byte', ok: 'Registradores', al: ['registrador'], x: 'Registradores ficam dentro da CPU e guardam o dado em uso agora.' },
  { id: 'e11', b: 'b6', g: 'mcq', q: 'Faltou energia. O que o Arduino perdeu?', ok: 'A leitura guardada numa variável', no: ['O programa gravado', 'O firmware de fábrica', 'Os dados da EEPROM'], x: 'A variável estava na RAM (volátil). O programa está na Flash (não volátil).' },
  { id: 'e12', b: 'b6', g: 'mcq', q: 'Da mais rápida para a mais lenta:', ok: 'Registrador, cache, RAM, HD', no: ['Cache, registrador, RAM, HD', 'RAM, cache, registrador, HD', 'Registrador, RAM, cache, HD'], x: 'Registrador → cache → RAM → armazenamento (HD/SSD).' },
  { id: 'e13', b: 'b6', g: 'mcq', q: 'O que quer dizer "acesso aleatório" na RAM?', ok: 'Lê qualquer posição no mesmo tempo', no: ['Os dados são guardados em ordem aleatória', 'A RAM às vezes perde dados', 'Só lê posições sorteadas'], x: 'A CPU lê qualquer posição no mesmo tempo, sem passar pelas anteriores.' },
  { id: 'e14', b: 'b6', g: 'mcq', q: 'O ATmega328P do Arduino Uno tem cache?', ok: 'Não: lê direto da Flash e da RAM', no: ['Sim, 2 KB', 'Sim, 32 KB', 'Só quando usa DMA'], x: 'Processadores de PC têm cache; o ATmega328P não.' },
  { id: 'e15', b: 'b6', g: 'mcq', q: 'Pela tabela de Norvig, buscar na RAM é quantas vezes mais lento que na cache L1?', ok: '200 vezes', no: ['100 vezes', '50 vezes', '2 vezes'], x: '100 ÷ 0,5 = 200 vezes.' },
  { id: 'e16', b: 'b6', g: 'mcq', q: 'Por que não fazer o computador inteiro só de cache?', ok: 'É a mais cara por byte', no: ['É lenta demais', 'É não volátil', 'Não cabe no processador nenhum dado'], x: 'Nenhuma memória é ao mesmo tempo rápida, grande e barata.' },
  { id: 'e17', b: 'b6', g: 'mcq', q: 'Por que a pirâmide de memória funciona?', ok: 'Programas reusam muito o mesmo pequeno conjunto de dados', no: ['A cache é maior que a RAM', 'O SSD é tão rápido quanto a cache', 'A CPU só acessa o armazenamento'], x: 'Como o loop() repete as mesmas linhas, o conjunto usado fica nas camadas de cima.' },
  { id: 'e18', b: 'b6', g: 'mcq', q: 'Se ROM é "somente leitura", como dá para atualizar o firmware da placa-mãe?', ok: 'Hoje ele fica em Flash, que é regravável', no: ['A ROM vira RAM ao ligar', 'O firmware fica na cache', 'Não dá para atualizar'], x: 'O nome ficou antigo: hoje esse papel é feito por Flash, não volátil e regravável.' },

  // ---------------- ANDAR 7 · DMA ----------------
  { id: 'd01', b: 'b7', g: 'dma', q: 'Deixa um dispositivo trocar dados com a RAM sem a CPU mover cada byte', ok: 'DMA', al: ['acesso direto a memoria', 'direct memory access'], x: 'DMA = acesso direto à memória.' },
  { id: 'd02', b: 'b7', g: 'dma', q: 'Circuito próprio que faz a cópia dos dados no lugar da CPU', ok: 'Controlador de DMA', al: ['controlador dma'], x: 'O controlador de DMA usa o barramento e move os dados entre dispositivo e RAM.' },
  { id: 'd03', b: 'b7', g: 'dmauso', q: 'Usa DMA para transferir os dados que chegam e saem pela internet', ok: 'Placa de rede', x: 'Placa de rede, controlador de disco, placa de vídeo e placa de som usam DMA.' },
  { id: 'd04', b: 'b7', g: 'dmauso', q: 'Usa DMA para transferir imagens e texturas', ok: 'Placa de vídeo', al: ['placa de video', 'gpu'], x: 'A placa de vídeo usa DMA para imagens e texturas.' },
  { id: 'd05', b: 'b7', g: 'dmauso', q: 'Usa DMA para transferir o áudio que está tocando', ok: 'Placa de som', x: 'A placa de som usa DMA para o áudio.' },
  { id: 'd06', b: 'b7', g: 'dmauso', q: 'Usa DMA para arquivos sendo lidos ou gravados no SSD/HD', ok: 'Controlador de disco', x: 'O controlador de disco usa DMA para ler e gravar arquivos.' },
  { id: 'd07', b: 'b7', g: 'blocos', q: 'No DMA, quem CONFIGURA a cópia (origem, destino, quantos bytes)?', ok: 'CPU', no: ['RAM', 'Placa de rede', 'Barramento'], x: 'A CPU configura, o controlador copia e depois avisa a CPU.' },
  { id: 'd08', b: 'b7', g: 'mcq', q: 'Durante uma transferência por DMA, o que a CPU está fazendo?', ok: 'Outras tarefas', no: ['Copiando byte a byte', 'Parada esperando', 'Reiniciando o PC'], x: 'Ela só configurou a cópia e recebe um aviso quando terminar.' },
  { id: 'd09', b: 'b7', g: 'mcq', q: 'Ordem do DMA:', ok: 'CPU configura → controlador copia → controlador avisa', no: ['Controlador avisa → CPU configura → controlador copia', 'CPU copia → controlador configura → CPU avisa', 'Controlador copia → CPU configura → RAM avisa'], x: '1) CPU configura; 2) controlador copia bloco a bloco; 3) controlador avisa "terminei".' },
  { id: 'd10', b: 'b7', g: 'mcq', q: 'DMA é um "caminho prioritário para dados mais importantes"?', ok: 'Não: muda só quem faz a cópia', no: ['Sim, os dados passam na frente', 'Sim, mas só na placa de vídeo', 'Sim, por isso é mais rápido'], x: 'Engano comum! Os dados não ficam mais importantes; a CPU só delega o trabalho.' },
  { id: 'd11', b: 'b7', g: 'mcq', q: 'Por que o DMA não ajudaria o Arduino Uno do kit?', ok: 'O ATmega328P não tem controlador de DMA', no: ['O Uno não tem RAM', 'O Uno não tem barramento', 'O Uno já é rápido demais'], x: 'No Uno toda transferência passa pela CPU. O ESP32 já tem DMA.' },
  { id: 'd12', b: 'b7', g: 'mcq', q: 'Sem DMA, copiar um arquivo grande faz a CPU…', ok: 'Ficar presa movendo byte a byte', no: ['Copiar tudo de uma vez', 'Usar a cache como pendrive', 'Desligar o clock'], x: 'Sem DMA, a CPU vira "carregadora": lê do dispositivo, guarda, escreve na RAM, repete.' },
  { id: 'd13', b: 'b7', g: 'chipnomes', q: 'Microcontrolador mais recente, citado no livro, que já tem DMA', ok: 'ESP32', al: ['esp 32', 'esp-32'], no: ['ATmega328P', 'Intel Core', 'PIC'], x: 'O ATmega328P não tem DMA; o ESP32 tem.' },

  // ---------------- ANDAR 8 · Desempenho e diagrama de tempo ----------------
  { id: 't01', b: 'b8', g: 'desemp', q: 'Duração de um ciclo do clock: P = 1 ÷ f', ok: 'Período', al: ['periodo'], x: 'Período é o inverso da frequência. Com f em GHz, P sai em ns.' },
  { id: 't02', b: 'b8', g: 'desemp', q: 'Quantos ciclos de clock, em média, uma instrução precisa', ok: 'CPI', al: ['ciclos por instrucao'], x: 'CPI = ciclos por instrução. Depende do programa e vem no enunciado.' },
  { id: 't03', b: 'b8', g: 'desemp', q: 'Mostra como os sinais mudam ao longo do tempo (t1, t2, t3…)', ok: 'Diagrama de tempo', al: ['diagrama temporal'], x: 'Cada linha é um sinal; em cima vale 1, embaixo vale 0.' },
  { id: 't04', b: 'b8', g: 'desemp', q: 'Um bilionésimo de segundo', ok: 'Nanossegundo', al: ['ns', 'nanosegundo'], x: 'ns = nanossegundo. ms = milissegundo (um milésimo).' },
  { id: 't05', b: 'b8', g: 'desemp', q: 'No diagrama de tempo, cada instante equivale a uma linha da…', ok: 'Tabela verdade', al: ['tabela-verdade', 'tabela da verdade'], x: 'Olhe um instante por vez: cada um é uma linha da tabela verdade.' },
  { id: 't06', b: 'b8', g: 'desemp', q: 'Processo que grava o desenho do circuito no silício usando luz', ok: 'Litografia', x: 'Litografia (glossário, cap. 7).' },
  { id: 't07', b: 'b8', g: 'ns', q: 'Período de um clock de 500 MHz', ok: '2 ns', al: ['2', '2ns'], no: ['0,5 ns', '500 ns', '5 ns'], x: '500 MHz = 0,5 GHz → P = 1 ÷ 0,5 = 2 ns.' },
  { id: 't08', b: 'b8', g: 'ns', q: 'Período de um clock de 2 GHz', ok: '0,5 ns', al: ['0.5', '0,5', '0.5ns', '0,5ns', '.5'], no: ['2 ns', '1 ns', '0,2 ns'], x: 'P = 1 ÷ 2 = 0,5 ns.' },
  { id: 't09', b: 'b8', g: 'ns', q: 'Período de um clock de 1 GHz', ok: '1 ns', al: ['1', '1ns'], no: ['10 ns', '0,1 ns', '1 ms'], x: 'P = 1 ÷ 1 = 1 ns.' },
  { id: 't10', b: 'b8', g: 'ns', q: 'Processador de 2 GHz com CPI = 4: tempo por instrução?', ok: '2 ns', al: ['2', '2ns'], no: ['8 ns', '0,5 ns', '4 ns'], x: 'P = 0,5 ns → T = 4 × 0,5 = 2 ns.' },
  { id: 't11', b: 'b8', g: 'ns', q: 'Processador de 500 MHz com CPI = 3: tempo por instrução?', ok: '6 ns', al: ['6', '6ns'], no: ['1,5 ns', '3 ns', '2 ns'], x: 'P = 2 ns → T = 3 × 2 = 6 ns (processador X do livro).' },
  { id: 't12', b: 'b8', g: 'num', q: '1 GHz equivale a quantos MHz?', ok: '1000', al: ['1.000', 'mil', '1000 mhz'], no: ['100', '10', '1.000.000'], x: '1 GHz = 1000 MHz.' },
  { id: 't13', b: 'b8', g: 'mcq', q: 'Fórmula do tempo de uma instrução', ok: 'T = CPI × P', no: ['T = CPI ÷ P', 'T = f × CPI', 'T = P ÷ CPI'], x: 'T = CPI × P, com P = 1 ÷ f.' },
  { id: 't14', b: 'b8', g: 'mcq', q: 'X: 500 MHz, CPI 3. Y: 1 GHz, CPI 8. Quem termina a instrução antes?', ok: 'X (6 ns contra 8 ns)', no: ['Y, porque tem clock maior', 'Empatam', 'Y (4 ns contra 6 ns)'], x: 'Clock maior sozinho não garante desempenho: o CPI de Y é muito maior.' },
  { id: 't15', b: 'b8', g: 'mcq', q: 'No diagrama com S = A · B (AND), quando S vale 1?', ok: 'Só quando A e B valem 1', no: ['Quando A ou B vale 1', 'Quando A e B valem 0', 'Sempre que A muda'], x: 'No exemplo, S só sobe em t3, único instante com A = 1 e B = 1.' },
  { id: 't16', b: 'b8', g: 'mcq', q: 'No exemplo do livro, se a porta fosse OR, em quais instantes S valeria 1?', ok: 't2, t3 e t4', no: ['Só em t3', 't1 e t3', 'Em todos'], x: 'A/B: t1 = 0/0, t2 = 1/0, t3 = 1/1, t4 = 0/1. Na OR basta uma entrada valer 1.' },
  { id: 't17', b: 'b8', g: 'mcq', q: 'O CPI vem escrito na caixa do processador?', ok: 'Não, depende do programa', no: ['Sim, junto com o clock', 'Sim, é sempre 1', 'Só em microcontroladores'], x: 'O CPI depende do programa; nos exercícios ele é dado no enunciado.' },
  { id: 't18', b: 'b8', g: 'mcq', q: 'Um processador de 1 GHz é sempre mais rápido que um de 500 MHz?', ok: 'Não necessariamente', no: ['Sim, sempre', 'Sim, se tiver cache', 'Não, é sempre mais lento'], x: 'A frequência diz quanto dura o ciclo, mas não quantos ciclos cada instrução precisa.' },
];
