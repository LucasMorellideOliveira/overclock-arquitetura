// =====================================================================
//  OVERCLOCK — banco de perguntas (v2: só arquitetura, dicas curtas)
//  Fonte: livro "[SP3 MAT3] Tópicos de Arquitetura Computacional" (SPTech)
//
//  b  = andar/chefe · g = grupo (sorteio de alternativas parecidas)
//  q  = dica · ok = resposta · al = outras formas aceitas ao digitar
//  no = alternativas erradas fixas · x = explicação da Lista de Vingança
// =====================================================================

const BOSSES = [
  { id: 'b1', andar: 1, cap: 'Cap. 2', tema: 'Os blocos do computador', nome: 'Golem de Silício', cor: '#7ee081', fala: 'Sem os três blocos, você não passa!' },
  { id: 'b2', andar: 2, cap: 'Cap. 2.1', tema: 'Dentro da CPU', nome: 'Hidra Tríplice', cor: '#ff9f43', fala: 'Três cabeças: ULA, UC e registradores.' },
  { id: 'b3', andar: 3, cap: 'Cap. 2.2', tema: 'Ciclo de busca e execução', nome: 'Ciclope do Clock', cor: '#54a0ff', fala: 'Busca, executa, busca, executa...' },
  { id: 'b4', andar: 4, cap: 'Cap. 3 e 3.1', tema: 'Microprocessador x microcontrolador', nome: 'Quimera ATmega', cor: '#c56cf0', fala: 'Tudo num chip só. Duvida?' },
  { id: 'b5', andar: 5, cap: 'Cap. 4', tema: 'Barramentos', nome: 'Serpente do Barramento', cor: '#ffd32a', fala: 'Onde? O quê? Quando? Responda!' },
  { id: 'b6', andar: 6, cap: 'Cap. 5 e 5.1', tema: 'RAM, ROM, cache e hierarquia', nome: 'Esfinge da Memória', cor: '#18dcff', fala: 'Volátil ou não volátil? Decida rápido.' },
  { id: 'b7', andar: 7, cap: 'Cap. 6', tema: 'DMA', nome: 'Polvo DMA', cor: '#ff6b81', fala: 'Eu copio tudo sem a CPU encostar.' },
  { id: 'b8', andar: 8, cap: 'Cap. 7', tema: 'Clock, período e CPI', nome: 'Relojoeiro Sombrio', cor: '#a4b0be', fala: 'Período, CPI... faça as contas!' },
  { id: 'final', andar: 9, cap: 'Livro todo', tema: 'A Prova', nome: 'Kernel Panic', cor: '#ff4757', fala: 'Tudo o que você errou volta agora.' },
];

const ITEMS = [
  // ---------- ANDAR 1 · Os blocos do computador ----------
  { id: 'c01', b: 'b1', g: 'blocos', q: 'Busca e executa as instruções', ok: 'CPU', al: ['processador', 'unidade central de processamento'], x: 'A CPU (Unidade Central de Processamento) busca e executa as instruções do programa.' },
  { id: 'c02', b: 'b1', g: 'blocos', q: 'Guarda os dados e as instruções', ok: 'Memória', x: 'A memória guarda dados e instruções.' },
  { id: 'c03', b: 'b1', g: 'blocos', q: 'Troca dados com o mundo de fora (sensor, LED, USB)', ok: 'Entrada e saída', al: ['e/s', 'es', 'entrada e saida', 'entrada/saida', 'io', 'i/o'], x: 'Entrada e saída (E/S) liga o computador ao mundo de fora.' },
  { id: 'c04', b: 'b1', g: 'blocos', q: 'Fios que ligam CPU, memória e E/S', ok: 'Barramento', x: 'O barramento é o conjunto de fios que liga os três blocos.' },
  { id: 'c05', b: 'b1', g: 'blocos', q: 'Um sensor de temperatura é de qual bloco?', ok: 'Entrada e saída', al: ['e/s', 'entrada e saida', 'entrada', 'io'], x: 'Sensor é um dispositivo de entrada: bloco de entrada e saída.' },
  { id: 'c06', b: 'b1', g: 'ideias', q: 'Instruções guardadas na mesma memória dos dados', ok: 'Programa armazenado', al: ['arquitetura de von neumann', 'von neumann'], x: 'Programa armazenado = arquitetura de von Neumann (1945).' },
  { id: 'c07', b: 'b1', g: 'ideias', q: 'Arquitetura em que programa e dados dividem a memória', ok: 'Von Neumann', al: ['john von neumann', 'neumann', 'arquitetura de von neumann'], no: ['Harvard', 'Tanenbaum', 'Stallings'], x: 'É a arquitetura de von Neumann, base dos computadores até hoje.' },
  { id: 'c08', b: 'b1', g: 'mcq', q: 'Os três blocos de um computador são…', ok: 'CPU, memória e E/S', no: ['ULA, UC e registradores', 'RAM, ROM e cache', 'Endereço, dados e controle'], x: 'Todo computador tem CPU, memória e entrada e saída, ligados pelo barramento.' },
  { id: 'c09', b: 'b1', g: 'mcq', q: 'Gravar outro programa no Arduino muda o quê?', ok: 'Só o conteúdo da memória', no: ['Os fios da placa', 'O chip da placa', 'A velocidade do clock'], x: 'Programa armazenado: o hardware é o mesmo, só muda o que está na memória.' },
  { id: 'c10', b: 'b1', g: 'mcq', q: 'A CPU é formada por…', ok: 'ULA, UC e registradores', no: ['RAM, ROM e cache', 'Memória e barramento', 'Entrada e saída'], x: 'CPU = ULA + UC + registradores.' },

  // ---------- ANDAR 2 · Dentro da CPU ----------
  { id: 'p01', b: 'b2', g: 'cpu', q: 'Faz as contas e as operações lógicas', ok: 'ULA', al: ['unidade logica e aritmetica', 'alu'], x: 'ULA = Unidade Lógica e Aritmética.' },
  { id: 'p02', b: 'b2', g: 'cpu', q: 'Interpreta a instrução e dá as ordens', ok: 'UC', al: ['unidade de controle'], x: 'UC = Unidade de Controle.' },
  { id: 'p03', b: 'b2', g: 'cpu', q: 'Memória mínima e mais rápida, dentro da CPU', ok: 'Registrador', al: ['registradores'], x: 'Registradores: a memória mais rápida e a menor do computador.' },
  { id: 'p04', b: 'b2', g: 'cpu', q: 'Registrador que guarda o resultado da ULA', ok: 'Acumulador', x: 'O acumulador recebe o resultado das operações da ULA.' },
  { id: 'p05', b: 'b2', g: 'cpu', q: 'Guarda o endereço da PRÓXIMA instrução', ok: 'Contador de Programa', al: ['pc', 'program counter', 'contador de programas'], x: 'Contador de Programa (PC) = endereço da próxima instrução.' },
  { id: 'p06', b: 'b2', g: 'cpu', q: 'Guarda a instrução executada AGORA', ok: 'Registrador de Instrução', al: ['ri', 'ir', 'registrador de instrucoes'], x: 'O Registrador de Instrução guarda a instrução em execução.' },
  { id: 'p07', b: 'b2', g: 'cpu', q: 'Sigla da Unidade Lógica e Aritmética', ok: 'ULA', x: 'ULA = Unidade Lógica e Aritmética: faz as contas.' },
  { id: 'p08', b: 'b2', g: 'cpu', q: 'Sigla da Unidade de Controle', ok: 'UC', x: 'UC = Unidade de Controle: dá as ordens.' },
  { id: 'p09', b: 'b2', g: 'mcq', q: 'Depois de ADD 2, 2, onde fica o 4?', ok: 'No acumulador', no: ['No Contador de Programa', 'No Registrador de Instrução', 'Na UC'], x: 'A ULA calcula 4 e o acumulador recebe o resultado.' },
  { id: 'p10', b: 'b2', g: 'mcq', q: 'Em ADD 2, 2, quem manda a ULA somar?', ok: 'A UC', no: ['O acumulador', 'O Contador de Programa', 'A memória'], x: 'A UC reconhece que é uma soma e ordena à ULA.' },
  { id: 'p11', b: 'b2', g: 'mcq', q: 'Dentro da CPU, PC significa…', ok: 'Program Counter', no: ['Personal Computer', 'Processador Central', 'Porta de Controle'], x: 'PC = Program Counter (Contador de Programa), não "computador pessoal".' },

  // ---------- ANDAR 3 · Ciclo de busca e execução ----------
  { id: 'k01', b: 'b3', g: 'ciclo', q: 'Fase que lê a instrução da memória', ok: 'Busca', al: ['ciclo de busca', 'fetch', 'buscar'], x: 'Busca: lê a instrução apontada pelo PC e põe no Registrador de Instrução.' },
  { id: 'k02', b: 'b3', g: 'ciclo', q: 'Fase que faz o que a instrução pede', ok: 'Execução', al: ['ciclo de execucao', 'execute', 'executar'], x: 'Execução: a UC interpreta e manda fazer.' },
  { id: 'k03', b: 'b3', g: 'ciclo', q: 'Passo que descobre o que a instrução pede', ok: 'Decodificar', al: ['decodificacao', 'decode', 'decodifica'], x: 'Decodificar: a UC traduz o código da instrução.' },
  { id: 'k04', b: 'b3', g: 'ciclo', q: 'Último passo: salvar o resultado', ok: 'Guardar o resultado', al: ['guardar', 'write back', 'writeback', 'guardar resultado'], x: 'Guardar o resultado (write back) num registrador ou na memória.' },
  { id: 'k05', b: 'b3', g: 'ciclo', q: 'Relógio que dá o ritmo da CPU', ok: 'Clock', x: 'O clock dita o ritmo do ciclo. No Arduino Uno: 16 MHz.' },
  { id: 'k06', b: 'b3', g: 'ciclo', q: 'Sinal que zera o Contador de Programa', ok: 'Reset', al: ['reinicializacao'], x: 'O reset zera o PC: o programa volta ao início.' },
  { id: 'k07', b: 'b3', g: 'ciclo', q: 'Nome em inglês da fase de busca', ok: 'Fetch', x: 'Buscar = fetch.' },
  { id: 'k08', b: 'b3', g: 'mcq', q: 'Ordem certa do ciclo:', ok: 'Buscar, decodificar, executar, guardar', no: ['Decodificar, buscar, executar, guardar', 'Buscar, executar, decodificar, guardar', 'Executar, buscar, guardar, decodificar'], x: 'Buscar → decodificar → executar → guardar o resultado.' },
  { id: 'k09', b: 'b3', g: 'mcq', q: 'Em qual fase o PC avança?', ok: 'Na busca', no: ['Na execução', 'Ao guardar o resultado', 'Só no reset'], x: 'Na busca, logo depois de ler a instrução.' },
  { id: 'k10', b: 'b3', g: 'mcq', q: 'Por que o RESET volta o programa ao início?', ok: 'Ele zera o Contador de Programa', no: ['Ele apaga a memória', 'Ele desliga o clock', 'Ele limpa o acumulador'], x: 'Com o PC zerado, a CPU busca a primeira instrução.' },
  { id: 'k11', b: 'b3', g: 'mcq', q: 'Instruções e dados entram na CPU pelo…', ok: 'Barramento de dados', no: ['Barramento de endereço', 'Barramento de controle', 'Contador de Programa'], x: 'Instruções e dados entram pelo mesmo caminho: o barramento de dados.' },

  // ---------- ANDAR 4 · Microprocessador x microcontrolador ----------
  { id: 'm01', b: 'b4', g: 'chips', q: 'Só a CPU no chip; RAM e disco ficam fora', ok: 'Microprocessador', x: 'Microprocessador depende de RAM e armazenamento externos. Ex.: Intel Core.' },
  { id: 'm02', b: 'b4', g: 'chips', q: 'CPU, memória e E/S no mesmo chip', ok: 'Microcontrolador', x: 'Microcontrolador = computador completo num chip. Ex.: ATmega328P.' },
  { id: 'm03', b: 'b4', g: 'chips', q: 'Tipo de chip do Arduino Uno', ok: 'Microcontrolador', x: 'O ATmega328P do Arduino Uno é um microcontrolador.' },
  { id: 'm04', b: 'b4', g: 'chips', q: 'Intel Core e AMD Ryzen são…', ok: 'Microprocessador', al: ['microprocessadores'], x: 'Processadores de computador são microprocessadores.' },
  { id: 'm05', b: 'b4', g: 'chipnomes', q: 'Nome do microcontrolador do Arduino Uno', ok: 'ATmega328P', al: ['atmega', 'atmega328', 'atmega 328p', 'atmega 328'], x: 'O ATmega328P. "Arduino" é o nome da placa.' },
  { id: 'm06', b: 'b4', g: 'perif', q: 'Transforma a tensão do sensor em número', ok: 'Conversor analógico-digital', al: ['adc', 'conversor ad', 'conversor a/d', 'conversor analogico digital'], x: 'O conversor analógico-digital trabalha no analogRead().' },
  { id: 'm07', b: 'b4', g: 'perif', q: 'Programa gravado no chip', ok: 'Firmware', x: 'Firmware: o programa gravado que define o que a placa faz.' },
  { id: 'm08', b: 'b4', g: 'mcq', q: 'Qual destes é um microprocessador?', ok: 'Intel Core', no: ['ATmega328P', 'ESP32', 'PIC'], x: 'ATmega328P, ESP32 e PIC são microcontroladores.' },
  { id: 'm09', b: 'b4', g: 'mcq', q: 'Onde um microcontrolador faz mais sentido?', ok: 'Máquina de lavar', no: ['Notebook', 'Servidor', 'PC gamer'], x: 'Tarefa específica e barata: microcontrolador.' },
  { id: 'm10', b: 'b4', g: 'mcq', q: 'Consumo de energia do microcontrolador', ok: 'Baixo', no: ['Alto', 'Igual ao do PC', 'Muito alto'], x: 'Microcontrolador: consumo e custo baixos.' },
  { id: 'm11', b: 'b4', g: 'mcq', q: 'Por que o processador sozinho não roda um notebook?', ok: 'Precisa de RAM e disco fora do chip', no: ['Não tem ULA', 'Não tem clock', 'Não tem registradores'], x: 'O microprocessador depende de memória e armazenamento externos.' },

  // ---------- ANDAR 5 · Barramentos ----------
  { id: 'r01', b: 'b5', g: 'barr', q: 'Diz ONDE ler ou escrever', ok: 'Barramento de endereço', al: ['endereco', 'de endereco'], x: 'Barramento de endereço: a posição que a CPU quer acessar.' },
  { id: 'r02', b: 'b5', g: 'barr', q: 'Leva O QUÊ está sendo lido ou escrito', ok: 'Barramento de dados', al: ['dados', 'de dados'], x: 'Barramento de dados: o valor (e as instruções).' },
  { id: 'r03', b: 'b5', g: 'barr', q: 'Diz QUANDO e COMO (ler ou escrever)', ok: 'Barramento de controle', al: ['controle', 'de controle'], x: 'Barramento de controle: leitura/escrita, memória ou E/S, ritmo.' },
  { id: 'r04', b: 'b5', g: 'barr', q: 'Barramento que só sai da CPU', ok: 'Barramento de endereço', al: ['endereco', 'de endereco'], x: 'É a CPU que escolhe onde ler ou escrever.' },
  { id: 'r05', b: 'b5', g: 'barr', q: 'Barramento que vai e volta', ok: 'Barramento de dados', al: ['dados', 'de dados'], x: 'Os dados vão da memória para a CPU e da CPU para a memória.' },
  { id: 'r06', b: 'b5', g: 'num', q: '3 fios de endereço = quantos endereços?', ok: '8', no: ['3', '6', '16'], x: '2³ = 8.' },
  { id: 'r07', b: 'b5', g: 'num', q: '8 fios de endereço = quantos endereços?', ok: '256', no: ['64', '128', '512'], x: '2⁸ = 256.' },
  { id: 'r08', b: 'b5', g: 'num', q: '16 fios de endereço = quantos endereços?', ok: '65.536', al: ['65536'], no: ['32.768', '256', '16.000'], x: '2¹⁶ = 65.536.' },
  { id: 'r09', b: 'b5', g: 'num', q: 'Quantos fios para 65.536 endereços?', ok: '16', no: ['8', '32', '64'], x: '2¹⁶ = 65.536.' },
  { id: 'r10', b: 'b5', g: 'mcq', q: 'Com n fios de endereço, existem…', ok: '2ⁿ endereços', no: ['n² endereços', '2 × n endereços', 'n + 2 endereços'], x: 'Cada fio vale 0 ou 1: 2ⁿ combinações.' },
  { id: 'r11', b: 'b5', g: 'mcq', q: 'Dados de 4 bits, endereço de 3 bits: quantas posições?', ok: '8', no: ['16', '128', '12'], x: '2³ = 8. O barramento de dados não entra na conta.' },
  { id: 'r12', b: 'b5', g: 'mcq', q: 'Leitura de memória: o primeiro passo é…', ok: 'CPU põe o endereço no barramento', no: ['Memória põe o dado no barramento', 'CPU copia o valor ao registrador', 'Memória avisa a CPU'], x: 'Endereço → sinal de leitura → memória põe o dado → CPU copia.' },

  // ---------- ANDAR 6 · RAM, ROM, cache e hierarquia ----------
  { id: 'e01', b: 'b6', g: 'mem', q: 'Memória de trabalho; perde tudo sem energia', ok: 'RAM', x: 'RAM: volátil, guarda programas em execução e seus dados.' },
  { id: 'e02', b: 'b6', g: 'mem', q: 'Memória "somente leitura" do firmware de inicialização', ok: 'ROM', x: 'ROM: não volátil. Guarda a BIOS/UEFI. Hoje, quase sempre feita com Flash.' },
  { id: 'e03', b: 'b6', g: 'mem', q: 'Não volátil e regravável, como um pendrive', ok: 'Flash', x: 'Flash: guarda o programa do Arduino e permite atualizar firmware.' },
  { id: 'e04', b: 'b6', g: 'mem', q: 'Memória rápida no processador, com o que foi usado há pouco', ok: 'Cache', x: 'Cache: cópia rápida do que a CPU usou, para não ir à RAM.' },
  { id: 'e05', b: 'b6', g: 'mem', q: 'Guarda configurações que sobrevivem ao desligar', ok: 'EEPROM', x: 'EEPROM: pequena e não volátil.' },
  { id: 'e06', b: 'b6', g: 'vol', q: 'Memória que PERDE o conteúdo sem energia', ok: 'Volátil', al: ['volatil'], no: ['Não volátil', 'Regravável', 'Somente leitura'], x: 'Voláteis: registradores, cache e RAM.' },
  { id: 'e07', b: 'b6', g: 'vol', q: 'Memória que MANTÉM o conteúdo sem energia', ok: 'Não volátil', al: ['nao volatil', 'nao-volatil'], no: ['Volátil', 'Cache', 'Temporária'], x: 'Não voláteis: ROM, Flash, EEPROM, SSD e HD.' },
  { id: 'e08', b: 'b6', g: 'mem2', q: 'Organização das memórias em níveis', ok: 'Hierarquia de memória', al: ['hierarquia', 'hierarquia de memorias', 'piramide de memoria'], x: 'Mais perto da CPU: mais rápida, menor e mais cara.' },
  { id: 'e09', b: 'b6', g: 'mem2', q: 'Nível mais rápido da hierarquia', ok: 'Registradores', al: ['registrador'], x: 'Topo da pirâmide: registradores.' },
  { id: 'e10', b: 'b6', g: 'mem2', q: 'Nível maior e mais lento (SSD ou HD)', ok: 'Armazenamento', al: ['ssd', 'hd', 'disco'], x: 'Base da pirâmide, e o único nível não volátil.' },
  { id: 'e11', b: 'b6', g: 'mcq', q: 'Da mais rápida para a mais lenta:', ok: 'Registrador, cache, RAM, HD', no: ['Cache, registrador, RAM, HD', 'RAM, cache, registrador, HD', 'Registrador, RAM, cache, HD'], x: 'Registrador → cache → RAM → armazenamento.' },
  { id: 'e12', b: 'b6', g: 'mcq', q: 'Acabou a energia. O que se perde?', ok: 'O que estava na RAM', no: ['O que estava na Flash', 'O que estava na ROM', 'O que estava no SSD'], x: 'A RAM é volátil.' },
  { id: 'e13', b: 'b6', g: 'mcq', q: 'Por que não fazer tudo de cache?', ok: 'É a mais cara por byte', no: ['É a mais lenta', 'É não volátil', 'Não guarda dados'], x: 'Nenhuma memória é rápida, grande e barata ao mesmo tempo.' },
  { id: 'e14', b: 'b6', g: 'mcq', q: '"Acesso aleatório" da RAM quer dizer…', ok: 'Lê qualquer posição no mesmo tempo', no: ['Guarda dados em ordem aleatória', 'Às vezes perde dados', 'Só lê posições sorteadas'], x: 'Não precisa passar pelas posições anteriores.' },
  { id: 'e15', b: 'b6', g: 'mcq', q: 'Como dá para atualizar a "ROM" da placa-mãe?', ok: 'Hoje ela é Flash, regravável', no: ['A ROM vira RAM ao ligar', 'Ela fica na cache', 'Não dá para atualizar'], x: 'O nome ficou antigo: hoje esse papel é da memória Flash.' },

  // ---------- ANDAR 7 · DMA ----------
  { id: 'd01', b: 'b7', g: 'dma', q: 'Copia dados para a RAM sem a CPU mover cada byte', ok: 'DMA', al: ['acesso direto a memoria', 'direct memory access'], x: 'DMA = acesso direto à memória.' },
  { id: 'd02', b: 'b7', g: 'dma', q: 'Circuito que faz a cópia no lugar da CPU', ok: 'Controlador de DMA', al: ['controlador dma'], x: 'O controlador de DMA move os dados entre o dispositivo e a RAM.' },
  { id: 'd03', b: 'b7', g: 'dma', q: 'Sigla de "acesso direto à memória"', ok: 'DMA', x: 'DMA = Direct Memory Access.' },
  { id: 'd04', b: 'b7', g: 'blocos', q: 'No DMA, quem configura a cópia?', ok: 'CPU', no: ['RAM', 'Barramento', 'Cache'], x: 'A CPU configura origem, destino e quantos bytes.' },
  { id: 'd05', b: 'b7', g: 'mem', q: 'Para onde o DMA copia os dados do dispositivo?', ok: 'RAM', no: ['Cache', 'ROM', 'Registrador'], x: 'O DMA troca dados entre o dispositivo e a RAM.' },
  { id: 'd06', b: 'b7', g: 'blocos', q: 'Caminho que o controlador de DMA usa', ok: 'Barramento', no: ['Cache', 'ULA', 'Acumulador'], x: 'O próprio controlador usa o barramento para copiar.' },
  { id: 'd07', b: 'b7', g: 'mcq', q: 'Durante o DMA, a CPU…', ok: 'Faz outras tarefas', no: ['Copia byte a byte', 'Fica parada', 'Reinicia o PC'], x: 'Ela só configura e depois recebe um aviso.' },
  { id: 'd08', b: 'b7', g: 'mcq', q: 'Ordem do DMA:', ok: 'Configura, copia, avisa', no: ['Avisa, configura, copia', 'Copia, avisa, configura', 'Configura, avisa, copia'], x: 'CPU configura → controlador copia → controlador avisa.' },
  { id: 'd09', b: 'b7', g: 'mcq', q: 'DMA deixa os dados "mais prioritários"?', ok: 'Não, só muda quem copia', no: ['Sim, passam na frente', 'Sim, ficam mais rápidos', 'Sim, só os importantes'], x: 'Engano comum: a CPU só delega o trabalho de copiar.' },
  { id: 'd10', b: 'b7', g: 'mcq', q: 'Sem DMA, copiar um arquivo grande deixa a CPU…', ok: 'Presa movendo byte a byte', no: ['Livre para outras tarefas', 'Desligada', 'Usando a cache como disco'], x: 'Sem DMA, a CPU vira "carregadora" de bytes.' },
  { id: 'd11', b: 'b7', g: 'mcq', q: 'O ATmega328P (Arduino Uno) tem DMA?', ok: 'Não', no: ['Sim', 'Só pela USB', 'Só na RAM'], x: 'No Uno toda transferência passa pela CPU.' },

  // ---------- ANDAR 8 · Clock, período e CPI ----------
  { id: 't01', b: 'b8', g: 'desemp', q: 'Duração de um ciclo do clock', ok: 'Período', al: ['periodo'], x: 'P = 1 ÷ f.' },
  { id: 't02', b: 'b8', g: 'desemp', q: 'Ciclos que uma instrução gasta, em média', ok: 'CPI', al: ['ciclos por instrucao'], x: 'CPI = ciclos por instrução.' },
  { id: 't03', b: 'b8', g: 'desemp', q: 'Quantos ciclos o clock faz por segundo', ok: 'Frequência', al: ['frequencia'], x: 'Frequência (Hz, MHz, GHz). P = 1 ÷ f.' },
  { id: 't04', b: 'b8', g: 'desemp', q: 'Mostra sinais 0 e 1 mudando no tempo', ok: 'Diagrama de tempo', al: ['diagrama temporal'], x: 'Cada linha é um sinal; cada instante, uma linha da tabela verdade.' },
  { id: 't05', b: 'b8', g: 'ns', q: 'Período de 500 MHz', ok: '2 ns', al: ['2', '2ns'], no: ['0,5 ns', '500 ns', '5 ns'], x: '500 MHz = 0,5 GHz → 1 ÷ 0,5 = 2 ns.' },
  { id: 't06', b: 'b8', g: 'ns', q: 'Período de 2 GHz', ok: '0,5 ns', al: ['0.5', '0,5', '0.5ns', '0,5ns', '.5'], no: ['2 ns', '1 ns', '0,2 ns'], x: '1 ÷ 2 = 0,5 ns.' },
  { id: 't07', b: 'b8', g: 'ns', q: 'Período de 1 GHz', ok: '1 ns', al: ['1', '1ns'], no: ['10 ns', '0,1 ns', '2 ns'], x: '1 ÷ 1 = 1 ns.' },
  { id: 't08', b: 'b8', g: 'ns', q: '2 GHz e CPI = 4: tempo por instrução?', ok: '2 ns', al: ['2', '2ns'], no: ['8 ns', '0,5 ns', '4 ns'], x: 'P = 0,5 ns → T = 4 × 0,5 = 2 ns.' },
  { id: 't09', b: 'b8', g: 'ns', q: '500 MHz e CPI = 3: tempo por instrução?', ok: '6 ns', al: ['6', '6ns'], no: ['1,5 ns', '3 ns', '2 ns'], x: 'P = 2 ns → T = 3 × 2 = 6 ns.' },
  { id: 't10', b: 'b8', g: 'mcq', q: 'Fórmula do período', ok: 'P = 1 ÷ f', no: ['P = f × 1', 'P = CPI × f', 'P = f ÷ CPI'], x: 'O período é o inverso da frequência.' },
  { id: 't11', b: 'b8', g: 'mcq', q: 'Fórmula do tempo de uma instrução', ok: 'T = CPI × P', no: ['T = CPI ÷ P', 'T = f × CPI', 'T = P ÷ CPI'], x: 'T = CPI × P.' },
  { id: 't12', b: 'b8', g: 'mcq', q: 'X: 500 MHz, CPI 3. Y: 1 GHz, CPI 8. Quem é mais rápido?', ok: 'X (6 ns contra 8 ns)', no: ['Y, tem clock maior', 'Empatam', 'Y (4 ns contra 6 ns)'], x: 'Clock maior sozinho não garante desempenho.' },
  { id: 't13', b: 'b8', g: 'mcq', q: '1 GHz é sempre mais rápido que 500 MHz?', ok: 'Não, depende do CPI', no: ['Sim, sempre', 'Sim, se tiver cache', 'Não, é sempre mais lento'], x: 'A frequência não diz quantos ciclos cada instrução precisa.' },
  { id: 't14', b: 'b8', g: 'mcq', q: 'Num diagrama com S = A AND B, S vale 1 quando…', ok: 'A e B valem 1', no: ['A ou B vale 1', 'A e B valem 0', 'A muda de valor'], x: 'AND só dá 1 quando as duas entradas valem 1.' },
];
