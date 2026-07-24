import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface QuizSeed {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

interface ModuleSeed {
  slug: string
  order: number
  title: string
  summary: string
  category: string
  estimatedMinutes: number
  objective: string
  explanation: string
  whenToUse: string
  whenToAvoid: string
  practicalExample: string
  commonMistakes: string[]
  tips: string[]
  practiceBriefing: string
  quiz: QuizSeed[]
}

const modules: ModuleSeed[] = [
  {
    slug: 'ancoragem-de-preco',
    order: 1,
    title: 'Ancoragem de Preço',
    summary: 'Apresente uma opção de maior valor antes da solução recomendada para que o preço ideal pareça vantajoso.',
    category: 'Precificação',
    estimatedMinutes: 6,
    objective:
      'Fazer o cliente perceber o preço do vidro temperado como vantajoso, apresentando antes uma opção de maior valor como referência.',
    explanation:
      'Ancoragem é a tendência da mente humana de usar a primeira informação recebida como referência para julgar tudo que vem depois. Quando você apresenta primeiro uma opção de maior valor (como o vidro laminado) e só depois a opção recomendada (vidro temperado), o preço da segunda passa a soar razoável — mesmo que sozinho pudesse parecer alto. Não é enganar o cliente: as duas opções são reais, e você está ajudando-o a enxergar o custo-benefício com contexto, não isoladamente.',
    whenToUse:
      'Quando o produto ideal para o cliente tem mais de uma opção de material ou acabamento com preços diferentes, e a recomendada não é a mais cara. Funciona bem logo na apresentação do orçamento, antes de qualquer negociação.',
    whenToAvoid:
      'Evite se o cliente já chegou com um orçamento fechado de concorrente e quer resposta direta de preço — ancorar pode soar como enrolação. Também evite se a opção de maior valor não for genuinamente relevante para o projeto: o cliente percebe a manipulação e perde confiança.',
    practicalExample:
      '"Com vidro laminado esse projeto ficaria em torno de R$ 4.200. Usando vidro temperado, que é 5x mais resistente que o vidro comum e atende perfeitamente esse uso, conseguimos entregar por R$ 2.800 — mantendo a mesma qualidade de acabamento."',
    commonMistakes: [
      'Inventar ou inflar o valor da opção de ancoragem — o cliente pode conferir e a credibilidade desaba.',
      'Ancorar com um produto que não faz sentido nenhum para o projeto do cliente.',
      'Ficar preso na comparação em vez de voltar o foco para o que o cliente realmente precisa.',
    ],
    tips: [
      'Apresente a âncora com naturalidade, como parte da explicação técnica — não como um truque.',
      'Use produtos que você mencionaria de qualquer forma durante o atendimento.',
      'Depois de ancorar, reforce os benefícios da opção recomendada, não só o preço.',
    ],
    practiceBriefing:
      'Cliente está pedindo orçamento para um projeto com pelo menos duas opções de material (ex: vidro laminado vs. temperado, ou linha Suprema vs. Gold de esquadrias). Ele deve perguntar o preço de forma direta bem cedo na conversa, dando ao vendedor a chance de ancorar com a opção mais cara antes de apresentar a recomendada. Se o vendedor ancorar bem, o cliente reage com alívio ao ouvir o preço da opção recomendada.',
    quiz: [
      {
        question: 'Qual é o principal objetivo da ancoragem de preço?',
        options: [
          'Confundir o cliente sobre os preços reais',
          'Fazer o cliente perceber o preço recomendado como vantajoso ao compará-lo com uma opção de maior valor',
          'Sempre vender a opção mais cara disponível',
          'Evitar falar sobre preço até o fim da conversa',
        ],
        correctIndex: 1,
        explanation: 'Ancoragem usa uma referência de maior valor, real e relevante, para tornar o preço recomendado mais atrativo por comparação.',
      },
      {
        question: 'Quando NÃO se deve usar ancoragem de preço?',
        options: [
          'Quando existem duas opções reais de material com preços diferentes',
          'No início da apresentação do orçamento',
          'Quando a opção de "maior valor" não tem relação nenhuma com o projeto do cliente',
          'Ao explicar diferenças técnicas entre produtos',
        ],
        correctIndex: 2,
        explanation: 'Se a âncora não for genuinamente relevante, o cliente percebe a manipulação e perde confiança.',
      },
      {
        question: 'No exemplo do módulo, qual produto foi usado como âncora antes do vidro temperado?',
        options: ['Espelho bronze', 'Esquadria linha Suprema', 'Vidro laminado', 'Guarda-corpo em aço'],
        correctIndex: 2,
      },
    ],
  },
  {
    slug: 'urgencia-real',
    order: 2,
    title: 'Urgência Real',
    summary: 'Use apenas motivos verdadeiros — agenda, prazo de produção, reajuste — para incentivar decisões mais rápidas.',
    category: 'Persuasão Ética',
    estimatedMinutes: 5,
    objective:
      'Usar motivos verdadeiros e verificáveis para incentivar o cliente a decidir mais rápido, sem criar pressão artificial.',
    explanation:
      'Urgência funciona porque adiar decisões é o padrão do cérebro humano quando não há um motivo claro para agir agora. A diferença entre urgência ética e manipulação é simples: a real é sempre baseada em fatos que existem independente da conversa — agenda de instalação, prazo de produção, reajuste de matéria-prima. Cliente que descobre depois que a "promoção" era inventada nunca mais compra com você. Cliente que confirma que o prazo era real vira cliente fiel.',
    whenToUse:
      'Sempre que existir um motivo real e específico: a agenda de instalação está enchendo, o lote de matéria-prima que garante aquele preço está acabando, ou uma condição comercial vigente tem data para expirar.',
    whenToAvoid:
      'Nunca invente prazos, disponibilidade ou promoções que não existem. Evite também repetir a urgência em excesso na mesma conversa — dito uma vez com clareza é mais forte do que insistido três vezes.',
    practicalExample:
      '"Nossa agenda de instalação para este mês já está com poucas vagas — se fecharmos essa semana, consigo garantir a instalação ainda em [mês]. Do mês que vem em diante, o prazo passa para 30 dias."',
    commonMistakes: [
      'Criar prazos falsos ("só até amanhã") que não existem de verdade.',
      'Usar urgência genérica sem citar o motivo específico.',
      'Pressionar repetidamente, o que soa desesperado em vez de informativo.',
    ],
    tips: [
      'Sempre vincule a urgência a um fato concreto que você poderia mostrar se perguntado.',
      'Diga a urgência uma vez, com segurança, e siga em frente na conversa.',
      'Se o cliente pedir mais tempo, respeite — urgência real não vira ultimato.',
    ],
    practiceBriefing:
      'Cliente está em cima do muro, sem pressa aparente para decidir, dizendo que vai "pensar com calma". Ele deve resistir a decidir rápido a menos que o vendedor apresente um motivo real e específico de urgência (agenda, prazo de produção, reajuste). Se o vendedor inventar urgência genérica e vaga, o cliente deve desconfiar e questionar de onde veio essa informação.',
    quiz: [
      {
        question: 'O que diferencia urgência real de urgência falsa?',
        options: [
          'Urgência real é sempre mais cara',
          'Urgência real é baseada em fatos verificáveis, como agenda ou prazo de produção',
          'Urgência falsa é mais eficaz a curto prazo',
          'Não há diferença prática entre elas',
        ],
        correctIndex: 1,
      },
      {
        question: 'O que fazer se o cliente pedir mais tempo depois de você mencionar uma urgência real?',
        options: [
          'Insistir repetidamente até ele decidir',
          'Inventar uma urgência ainda maior',
          'Respeitar o pedido — urgência real não vira ultimato',
          'Encerrar o atendimento imediatamente',
        ],
        correctIndex: 2,
      },
      {
        question: 'Qual destes é um exemplo válido de urgência real?',
        options: [
          '"Só até amanhã, depois o preço triplica"',
          '"A agenda de instalação deste mês está com poucas vagas"',
          '"Estamos com promoção relâmpago que inventei agora"',
          '"Se você não decidir agora, vou ficar chateado"',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'follow-up-estruturado',
    order: 3,
    title: 'Follow-up Estruturado',
    summary: 'Uma sequência de acompanhamento em 24h, 3 dias e 7 dias, cada contato com um objetivo diferente.',
    category: 'Processo Comercial',
    estimatedMinutes: 7,
    objective:
      'Manter contato com o cliente depois do orçamento através de uma sequência com objetivo claro em cada etapa, aumentando a taxa de retorno.',
    explanation:
      'A maioria das vendas não fecha no primeiro contato — fecha no acompanhamento. Um follow-up estruturado tem três momentos com propósitos diferentes: 24 horas depois (confirmar que o orçamento chegou e tirar dúvidas iniciais), 3 dias depois (trazer um motivo novo para a conversa, como uma dúvida técnica ou uma condição comercial) e 7 dias depois (entender o real motivo de não ter fechado ainda e reabrir a negociação). Sem estrutura, o vendedor manda "e aí, conseguiu ver o orçamento?" repetidamente — o que cansa o cliente sem avançar a venda.',
    whenToUse:
      'Em todo orçamento enviado que não fechou na hora. É a rotina padrão pós-atendimento, não uma exceção.',
    whenToAvoid:
      'Evite follow-up sem conteúdo novo — mensagens repetidas de "e aí?" sem trazer nada de valor. Evite também insistir além dos 7 dias sem espaçar mais o contato; isso desgasta a relação.',
    practicalExample:
      '"[24h] Oi Carlos, conseguiu dar uma olhada no orçamento? Fico à disposição pra qualquer dúvida técnica. [3 dias] Carlos, lembrei que o projeto do seu box também poderia usar puxador em inox — separei uma opção que costuma combinar bem, quer ver? [7 dias] Carlos, sei que decisão de reforma não é rápida — só queria entender se ainda faz sentido pra você, ou se rolou alguma dúvida que eu possa ajudar a resolver."',
    commonMistakes: [
      'Mandar a mesma mensagem genérica nos três contatos.',
      'Deixar passar os prazos e só retomar contato semanas depois.',
      'Insistir de forma invasiva quando o cliente já sinalizou que não tem interesse.',
    ],
    tips: [
      'Anote o motivo de cada follow-up antes de mandar — se não tiver um motivo, adie.',
      'Use o CRM (ou pelo menos uma agenda) para não depender da memória.',
      'No follow-up de 7 dias, foque em entender a objeção real, não em empurrar a venda.',
    ],
    practiceBriefing:
      'Cliente recebeu um orçamento em um atendimento anterior (assuma isso como pano de fundo da conversa) e está sendo contatado de novo. Ele deve responder de forma neutra e morna no primeiro contato ("ainda não vi direito" ou "vou analisar"), dando ao vendedor a chance de conduzir contatos com propósitos diferentes em vez de insistir genericamente.',
    quiz: [
      {
        question: 'Qual é o objetivo do follow-up de 24 horas?',
        options: [
          'Fechar a venda imediatamente',
          'Confirmar que o orçamento chegou e tirar dúvidas iniciais',
          'Cobrar uma resposta definitiva',
          'Oferecer um desconto agressivo',
        ],
        correctIndex: 1,
      },
      {
        question: 'O que caracteriza um follow-up mal feito?',
        options: [
          'Trazer um motivo novo a cada contato',
          'Repetir a mesma mensagem genérica de "e aí, viu o orçamento?"',
          'Espaçar os contatos em 24h, 3 dias e 7 dias',
          'Usar o CRM para não esquecer os prazos',
        ],
        correctIndex: 1,
      },
      {
        question: 'No follow-up de 7 dias, qual deve ser o foco principal?',
        options: [
          'Insistir para fechar imediatamente',
          'Entender o real motivo de o cliente não ter fechado ainda',
          'Oferecer um produto totalmente diferente',
          'Desistir do cliente',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'fechamento-assumido',
    order: 4,
    title: 'Fechamento Assumido',
    summary: 'Conduza o cliente com perguntas de escolha ("semana que vem ou a seguinte?") em vez de perguntar se ele quer comprar.',
    category: 'Fechamento',
    estimatedMinutes: 5,
    objective:
      'Conduzir o cliente à decisão assumindo que a compra vai acontecer, oferecendo escolhas dentro do "sim" em vez de perguntar se ele quer comprar.',
    explanation:
      'Fechamento assumido troca a pergunta binária ("você quer fechar?") por uma pergunta de escolha ("prefere instalar semana que vem ou na seguinte?"). Isso funciona porque desloca a decisão do cliente de "comprar ou não" para "como vai ser a compra" — um passo psicologicamente menor. É uma técnica de condução, não de pressão: só deve ser usada quando o cliente já demonstrou sinais reais de interesse.',
    whenToUse:
      'Quando o cliente já fez perguntas de interesse avançado (prazo, instalação, forma de pagamento) — sinais claros de que está perto de decidir. Funciona bem para destravar clientes indecisos que só precisam de um empurrão final.',
    whenToAvoid:
      'Não use logo no início da conversa ou com cliente que ainda está em fase de pesquisa/comparação — vai soar precipitado. Se o cliente ainda tem objeções não resolvidas (preço, dúvida técnica), resolva-as antes de assumir o fechamento.',
    practicalExample:
      '"Perfeito, já temos tudo alinhado sobre o material e a medida. Você prefere que a instalação seja feita na próxima semana ou fica melhor na semana seguinte?"',
    commonMistakes: [
      'Usar a técnica antes de o cliente sinalizar interesse real.',
      'Insistir no fechamento assumido mesmo depois de o cliente recusar as opções.',
      'Ignorar objeções pendentes só para tentar "empurrar" o fechamento.',
    ],
    tips: [
      'Confirme sinais de interesse (perguntas sobre prazo, forma de pagamento) antes de assumir o fechamento.',
      'Sempre ofereça duas opções concretas, nunca uma pergunta aberta.',
      'Se o cliente hesitar nas duas opções, volte um passo e trate a objeção real antes de tentar de novo.',
    ],
    practiceBriefing:
      'Cliente já demonstrou interesse claro (pergunta sobre prazo de instalação, forma de pagamento, ou diz "gostei da proposta") mas ainda não fechou verbalmente. Ele deve responder bem a perguntas de escolha assumida ("semana que vem ou a seguinte?") se o vendedor as fizer, mas continuar indeciso se o vendedor só perguntar genericamente "você quer fechar?".',
    quiz: [
      {
        question: 'O que é fechamento assumido?',
        options: [
          'Perguntar diretamente se o cliente quer comprar',
          'Oferecer escolhas dentro do "sim", assumindo que a compra vai acontecer',
          'Fechar a venda sem consultar o cliente',
          'Ignorar objeções do cliente',
        ],
        correctIndex: 1,
      },
      {
        question: 'Quando o fechamento assumido funciona melhor?',
        options: [
          'Logo no primeiro contato com o cliente',
          'Quando o cliente já demonstrou sinais claros de interesse',
          'Quando o cliente ainda está pesquisando preços',
          'Antes de apresentar qualquer informação sobre o produto',
        ],
        correctIndex: 1,
      },
      {
        question: 'Se o cliente hesitar diante das duas opções de fechamento assumido, o que fazer?',
        options: [
          'Insistir nas mesmas duas opções repetidamente',
          'Voltar um passo e tratar a objeção real antes de tentar de novo',
          'Encerrar o atendimento',
          'Oferecer um desconto imediato sem entender o motivo',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'reducao-de-friccao',
    order: 5,
    title: 'Redução de Fricção',
    summary: 'Diminua o tempo entre medição, orçamento, negociação e fechamento — velocidade também converte.',
    category: 'Processo Comercial',
    estimatedMinutes: 6,
    objective:
      'Diminuir o tempo entre medição, orçamento, negociação e fechamento, porque cada dia de atraso reduz a chance de conversão.',
    explanation:
      'Todo processo de compra perde energia com o tempo — o cliente esfria, aparece um concorrente, surge outra prioridade. A velocidade entre as etapas (medição → orçamento → negociação → fechamento) é, sozinha, um fator de conversão tão importante quanto preço ou qualidade. Reduzir fricção não significa pular etapas: significa eliminar esperas desnecessárias entre elas — orçamento no mesmo dia da medição, resposta rápida a dúvidas, condições já pré-aprovadas para não depender de aprovação externa demorada.',
    whenToUse:
      'Em todo o processo comercial, como prática padrão — principalmente logo após a medição, quando o interesse do cliente está no pico.',
    whenToAvoid:
      'Não é o caso de "evitar" — mas cuidado para não confundir velocidade com pressa que gera erro técnico (medida errada, orçamento incompleto). Fricção reduzida é sobre eliminar espera, não sobre eliminar cuidado.',
    practicalExample:
      '"Aproveitando que acabei de medir aqui, já consigo montar o orçamento e te envio ainda hoje à tarde — assim você já pode ir avaliando com calma."',
    commonMistakes: [
      'Deixar o orçamento para "depois" e demorar dias para enviar.',
      'Responder dúvidas do cliente com atraso, dando tempo para ele buscar concorrentes.',
      'Adicionar etapas de aprovação interna desnecessárias que travam o processo.',
    ],
    tips: [
      'Sempre que possível, envie o orçamento no mesmo dia da medição.',
      'Tenha as condições comerciais padrão já na ponta da língua, sem precisar "consultar".',
      'Meça a velocidade do seu próprio processo — cada etapa mais rápida aumenta a conversão.',
    ],
    practiceBriefing:
      'Cliente acabou de passar pela medição (ou está pedindo orçamento com pressa por já estar decidido) e valoriza muito rapidez de resposta. Ele deve ficar impaciente ou considerar procurar outro fornecedor se o vendedor demonstrar lentidão ou disser que vai "ver depois" e retornar em vários dias.',
    quiz: [
      {
        question: 'Por que a velocidade entre as etapas do processo comercial importa tanto?',
        options: [
          'Porque clientes gostam de esperar',
          'Porque o interesse do cliente esfria com o tempo e concorrentes podem aparecer',
          'Porque não tem relação com a conversão',
          'Porque é uma exigência legal',
        ],
        correctIndex: 1,
      },
      {
        question: 'Reduzir fricção significa:',
        options: [
          'Pular etapas importantes do processo',
          'Eliminar esperas desnecessárias entre as etapas, sem pular cuidado técnico',
          'Fazer tudo com pressa, mesmo com risco de erro',
          'Aumentar o número de aprovações internas',
        ],
        correctIndex: 1,
      },
      {
        question: 'Qual destas é uma boa prática de redução de fricção?',
        options: [
          'Enviar o orçamento vários dias depois da medição',
          'Enviar o orçamento no mesmo dia da medição, sempre que possível',
          'Deixar dúvidas do cliente sem resposta por dias',
          'Criar etapas extras de aprovação interna',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'prova-social',
    order: 6,
    title: 'Prova Social',
    summary: 'Use exemplos específicos de obras semelhantes já entregues para aumentar a confiança do cliente.',
    category: 'Persuasão Ética',
    estimatedMinutes: 5,
    objective:
      'Usar exemplos específicos de obras semelhantes já entregues para aumentar a confiança do cliente na decisão.',
    explanation:
      'Ninguém quer ser o primeiro a testar. Quando o cliente ouve sobre um projeto parecido com o dele que já foi entregue com sucesso, o risco percebido da decisão cai — porque ele não está mais confiando só na sua palavra, está confiando em um resultado real. Prova social funciona melhor quando é específica (o bairro, o tipo de obra, o problema resolvido) do que quando é genérica ("a gente já fez muita coisa").',
    whenToUse:
      'Quando o cliente demonstra insegurança sobre o resultado, questiona a qualidade, ou está comparando fornecedores sem saber qual escolher.',
    whenToAvoid:
      'Evite citar clientes ou endereços sem autorização, e evite exagerar números que não pode sustentar se questionado. Também não force prova social se o cliente já está confiante — pode soar como venda forçada.',
    practicalExample:
      '"Fizemos uma fachada bem parecida com essa em um prédio comercial na Vila Mariana mês passado — mesmo desafio de medida irregular que você tem aqui. Ficou perfeito e o síndico ficou tão satisfeito que já indicou pra outro condomínio da rua."',
    commonMistakes: [
      'Usar exemplos genéricos demais para gerar conexão real.',
      'Inventar ou exagerar casos que não aconteceram.',
      'Falar de clientes específicos sem cuidado com privacidade.',
    ],
    tips: [
      'Tenha 3 ou 4 casos reais guardados na memória, cada um pra um tipo de objeção diferente.',
      'Quanto mais parecido o exemplo com o projeto do cliente atual, mais forte o efeito.',
      'Fotos (quando possível e autorizadas) reforçam ainda mais do que só o relato.',
    ],
    practiceBriefing:
      'Cliente está inseguro sobre a qualidade ou comparando com concorrentes, dizendo algo como "já ouvi falar de gente que teve problema com vidro temperado" ou pedindo referências. Ele deve reagir bem se o vendedor trouxer um exemplo específico e crível de obra parecida, e continuar desconfiado se a resposta for vaga.',
    quiz: [
      {
        question: 'Por que a prova social específica é mais eficaz que a genérica?',
        options: [
          'Porque é mais fácil de inventar',
          'Porque reduz o risco percebido ao mostrar um resultado real e parecido com o projeto do cliente',
          'Porque não precisa ser verdade',
          'Porque impressiona mais números grandes',
        ],
        correctIndex: 1,
      },
      {
        question: 'O que evitar ao usar prova social?',
        options: [
          'Citar o bairro ou tipo de obra',
          'Exagerar ou inventar casos que não aconteceram',
          'Usar exemplos parecidos com o projeto do cliente',
          'Mencionar um resultado real',
        ],
        correctIndex: 1,
      },
      {
        question: 'Quando a prova social é mais útil?',
        options: [
          'Quando o cliente já está totalmente confiante',
          'Quando o cliente demonstra insegurança ou está comparando fornecedores',
          'No momento do pagamento',
          'Nunca, é uma técnica ultrapassada',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'descoberta-da-objecao-real',
    order: 7,
    title: 'Descoberta da Objeção Real',
    summary: 'Perguntas estratégicas para identificar o verdadeiro motivo por trás de um "vou pensar".',
    category: 'Diagnóstico',
    estimatedMinutes: 7,
    objective:
      'Identificar, através de perguntas estratégicas, qual é a objeção verdadeira por trás de uma recusa genérica como "vou pensar".',
    explanation:
      'Quando um cliente diz "vou pensar" ou "está caro", raramente essa é a objeção completa — é uma cortina para algo mais específico: medo de tomar a decisão errada, dúvida sobre um detalhe técnico, necessidade de aprovar com outra pessoa, ou comparação com um preço que ele não mencionou. Tentar rebater a objeção genérica direto ("mas não está caro, veja a qualidade") geralmente não funciona porque não ataca o motivo real. Perguntas abertas e específicas revelam a objeção verdadeira, que aí sim pode ser tratada.',
    whenToUse:
      'Sempre que o cliente apresentar uma objeção vaga ou genérica, especialmente perto do fechamento.',
    whenToAvoid:
      'Evite interrogar o cliente com perguntas em sequência sem dar espaço para ele responder com calma — isso vira interrogatório, não diagnóstico. Se a objeção já veio específica e clara, não é preciso "descobrir" nada.',
    practicalExample:
      '"Cliente: Vou pensar e te retorno. Vendedor: Claro, sem problema. Só pra eu te ajudar melhor — é mais uma questão de preço, de prazo, ou você quer comparar com mais alguma opção antes de decidir?"',
    commonMistakes: [
      'Aceitar "vou pensar" e simplesmente esperar, sem investigar.',
      'Rebater a objeção genérica sem entender a causa real primeiro.',
      'Fazer perguntas fechadas demais (sim/não) que não abrem espaço para o cliente explicar.',
    ],
    tips: [
      'Pergunte de forma leve e genuinamente curiosa, não como se estivesse cobrando uma resposta.',
      'Ofereça 2 ou 3 hipóteses (preço, prazo, comparação) para facilitar o cliente responder.',
      'Depois de descobrir a objeção real, trate só ela — não reabra a conversa inteira.',
    ],
    practiceBriefing:
      'Cliente apresenta uma objeção vaga e genérica ("vou pensar", "está meio caro", "preciso ver com calma") sem detalhar o motivo real. Só deve revelar a objeção verdadeira (ex: precisa aprovar com o cônjuge, comparando com concorrente específico, dúvida técnica não resolvida) se o vendedor fizer uma pergunta aberta e específica investigando o motivo.',
    quiz: [
      {
        question: 'Por que "vou pensar" raramente é a objeção completa?',
        options: [
          'Porque o cliente está sempre mentindo',
          'Porque geralmente esconde um motivo mais específico, como preço, prazo ou comparação',
          'Porque significa que ele não vai comprar nunca',
          'Porque é só uma forma de ser educado',
        ],
        correctIndex: 1,
      },
      {
        question: 'Qual é a melhor forma de descobrir a objeção real?',
        options: [
          'Aceitar a resposta vaga e esperar o cliente retornar',
          'Rebater a objeção genérica imediatamente',
          'Fazer uma pergunta aberta e específica, oferecendo hipóteses',
          'Insistir repetidamente com perguntas fechadas em sequência',
        ],
        correctIndex: 2,
      },
      {
        question: 'Depois de descobrir a objeção real, o vendedor deve:',
        options: [
          'Reabrir a conversa inteira do zero',
          'Tratar especificamente essa objeção',
          'Ignorá-la e insistir no fechamento',
          'Encerrar o atendimento',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'reciprocidade',
    order: 8,
    title: 'Reciprocidade',
    summary: 'Pequenas entregas de valor — uma dica, um esboço — fortalecem a relação antes de pedir a decisão.',
    category: 'Persuasão Ética',
    estimatedMinutes: 5,
    objective:
      'Fortalecer o relacionamento comercial entregando pequenos valores antes de pedir a decisão de compra.',
    explanation:
      'Reciprocidade é um dos princípios mais estudados da persuasão: quando alguém recebe algo de valor genuíno, sente uma inclinação natural a retribuir — não necessariamente com uma compra imediata, mas com mais abertura, confiança e atenção. No contexto comercial, isso significa entregar dicas técnicas, esboços ou sugestões de acabamento sem cobrar e sem condicionar à venda. É diferente de brinde ou desconto: o valor entregue precisa ser útil por si só, mesmo que o cliente não feche negócio.',
    whenToUse:
      'Ao longo de todo o atendimento, especialmente antes de pedir o fechamento — pequenas entregas de valor tornam o pedido de decisão mais natural.',
    whenToAvoid:
      'Evite condicionar a entrega ("só te mando o esboço se você fechar") — isso anula o efeito. Também evite prometer entregas de valor que depois não vai cumprir.',
    practicalExample:
      '"Enquanto você decide, separei um esboço de como ficaria o guarda-corpo com o perfil que você gostou — já pode usar isso pra visualizar, independente de fechar com a gente ou não."',
    commonMistakes: [
      'Condicionar a entrega de valor a um compromisso de compra.',
      'Entregar algo genérico que não tem valor real para aquele cliente específico.',
      'Prometer e não entregar, o que quebra a confiança em vez de construí-la.',
    ],
    tips: [
      'Escolha a entrega de valor pensando no que aquele cliente específico precisa.',
      'Entregue sem cobrar reciprocidade explícita — o efeito é mais forte quando é genuíno.',
      'Dicas técnicas simples (manutenção, cuidado com o produto) já contam como valor real.',
    ],
    practiceBriefing:
      'Cliente está no meio do processo de decisão, ainda sem confiança total, mais formal e reservado. Ele deve amolecer e ficar mais receptivo se o vendedor oferecer espontaneamente uma dica técnica, esboço ou sugestão de acabamento sem pedir nada em troca, e continuar mais distante se o vendedor só falar de preço e fechamento.',
    quiz: [
      {
        question: 'O que torna a reciprocidade eficaz no atendimento comercial?',
        options: [
          'Condicionar a entrega de valor à compra',
          'Entregar algo de valor genuíno sem cobrar nada em troca',
          'Prometer brindes caros',
          'Falar apenas sobre preço',
        ],
        correctIndex: 1,
      },
      {
        question: 'Qual destas é uma boa aplicação de reciprocidade?',
        options: [
          '"Só te mando o esboço se você fechar agora"',
          'Oferecer um esboço ou dica técnica sem condicionar à venda',
          'Cobrar pela consultoria antes de orçar',
          'Prometer um brinde e não entregar',
        ],
        correctIndex: 1,
      },
      {
        question: 'O que acontece se você prometer uma entrega de valor e não cumprir?',
        options: [
          'Nada, o cliente esquece rápido',
          'A confiança é quebrada em vez de construída',
          'O efeito de reciprocidade fica ainda mais forte',
          'O cliente fecha a compra mais rápido',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'escassez-de-capacidade',
    order: 9,
    title: 'Escassez de Capacidade',
    summary: 'Comunique limitações reais de agenda ou produção de forma ética — nunca escassez inventada.',
    category: 'Persuasão Ética',
    estimatedMinutes: 5,
    objective:
      'Comunicar limitações reais de agenda ou capacidade produtiva de forma honesta, sem inventar escassez artificial.',
    explanation:
      'Escassez motiva decisão porque a mente humana valoriza mais aquilo que é limitado. A versão ética dessa técnica comunica uma limitação que realmente existe — a fábrica tem capacidade limitada de produção por semana, a equipe de instalação tem um número finito de vagas na agenda. Diferente da urgência (que é sobre tempo), escassez é sobre quantidade e capacidade disponível. As duas podem se combinar, mas escassez inventada ("só temos 2 unidades") quando não é verdade é a forma mais rápida de perder a confiança de um cliente que descobre a mentira.',
    whenToUse:
      'Quando existe uma limitação real de agenda de instalação, capacidade de produção, ou disponibilidade de um material específico.',
    whenToAvoid:
      'Nunca invente limitação de estoque ou capacidade que não existe. Evite também usar escassez como argumento principal se a real vantagem do produto não foi bem apresentada ainda.',
    practicalExample:
      '"Nossa fábrica consegue produzir cerca de 15 projetos grandes por mês com a qualidade que garantimos — esse mês já temos 11 fechados, então a agenda está ficando mais justa."',
    commonMistakes: [
      'Inventar limitação de estoque ou produção que não existe de verdade.',
      'Usar escassez como único argumento, sem sustentar com qualidade e atendimento.',
      'Repetir a escassez de forma insistente, o que soa como pressão de vendas barata.',
    ],
    tips: [
      'Só use números que você poderia justificar se o cliente perguntar "como você sabe disso?".',
      'Combine escassez com os outros benefícios já apresentados, não use isolada.',
      'Mencione uma vez com transparência — não precisa repetir para ter efeito.',
    ],
    practiceBriefing:
      'Cliente está comparando fornecedores e não vê motivo para decidir logo, achando que pode esperar sem custo nenhum. Ele deve reconsiderar o ritmo da decisão se o vendedor comunicar de forma clara e específica uma limitação real de capacidade (agenda de instalação, produção mensal), mas ficar cético se a limitação soar inventada ou vaga.',
    quiz: [
      {
        question: 'O que diferencia escassez de urgência?',
        options: [
          'São exatamente a mesma coisa',
          'Escassez é sobre quantidade/capacidade disponível, urgência é sobre tempo',
          'Escassez é sempre falsa, urgência é sempre real',
          'Não existe diferença relevante',
        ],
        correctIndex: 1,
      },
      {
        question: 'Qual é a regra de ouro para usar escassez de forma ética?',
        options: [
          'Inventar números que impressionem o cliente',
          'Só usar números que você poderia justificar se for questionado',
          'Repetir a escassez várias vezes na conversa',
          'Usar escassez mesmo sem nenhuma limitação real',
        ],
        correctIndex: 1,
      },
      {
        question: 'Escassez de capacidade deve ser usada:',
        options: [
          'Como único argumento de venda, isolada dos outros benefícios',
          'Combinada com os outros benefícios já apresentados',
          'Apenas no início da conversa, antes de qualquer outra informação',
          'Somente quando o cliente já fechou a compra',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'crm-e-disciplina-comercial',
    order: 10,
    title: 'CRM e Disciplina Comercial',
    summary: 'Registrar atendimentos, acompanhar orçamentos e cumprir follow-ups é o que sustenta a conversão no tempo.',
    category: 'Processo Comercial',
    estimatedMinutes: 8,
    objective:
      'Adotar uma rotina de registro de atendimentos, acompanhamento de orçamentos e follow-ups que aumenta a taxa de conversão ao longo do tempo.',
    explanation:
      'Talento em conversa fecha uma venda; disciplina de processo fecha vendas de forma consistente, mês após mês. Vendedores que registram cada atendimento, mantêm o status de cada orçamento atualizado e seguem uma rotina de follow-up não dependem da memória — e por isso não deixam clientes esfriarem por esquecimento. CRM não é burocracia: é a diferença entre um funil de vendas visível, que pode ser melhorado, e um funil que só existe na cabeça do vendedor.',
    whenToUse:
      'Em toda oportunidade comercial, desde o primeiro contato até o fechamento (ou perda) — é rotina, não uma tarefa opcional para quando sobra tempo.',
    whenToAvoid:
      'Não é o caso de evitar — mas cuidado para o registro não virar um fim em si mesmo. O CRM serve para apoiar a venda, não para substituir a atenção real ao cliente durante a conversa.',
    practicalExample:
      '"Depois de cada atendimento, o vendedor registra: nome do cliente, produto de interesse, valor do orçamento, data do próximo follow-up e o motivo da última resposta do cliente — assim, quando chega a hora do contato, ele sabe exatamente o que dizer."',
    commonMistakes: [
      'Deixar para registrar o atendimento só no fim do dia, esquecendo detalhes importantes.',
      'Não atualizar o status do orçamento, perdendo a visão real do funil.',
      'Ignorar follow-ups agendados porque "não deu tempo".',
    ],
    tips: [
      'Registre o atendimento logo depois de cada contato, enquanto está fresco na memória.',
      'Sempre defina a próxima data de follow-up antes de encerrar o registro.',
      'Revise semanalmente os orçamentos parados para não perder oportunidades esquecidas.',
    ],
    practiceBriefing:
      'Este módulo é mais sobre processo do que sobre técnica de conversa — simule um cliente comum pedindo um orçamento normal. O objetivo da prática é o vendedor treinar registrar mentalmente, ao final da simulação, os dados essenciais do atendimento (nome, produto, valor, próxima data de follow-up).',
    quiz: [
      {
        question: 'Qual é o principal risco de não registrar os atendimentos?',
        options: [
          'Nenhum, a memória é suficiente',
          'Perder oportunidades por esquecimento e não ter visão real do funil',
          'O cliente vai desconfiar do vendedor',
          'É apenas uma tarefa burocrática sem impacto real',
        ],
        correctIndex: 1,
      },
      {
        question: 'Quando é melhor registrar um atendimento?',
        options: [
          'No fim do dia, juntando tudo de uma vez',
          'Logo depois de cada contato, enquanto está fresco na memória',
          'Uma vez por semana',
          'Só quando a venda fecha',
        ],
        correctIndex: 1,
      },
      {
        question: 'O que deve ser definido antes de encerrar o registro de um atendimento?',
        options: [
          'Nada além do nome do cliente',
          'A próxima data de follow-up',
          'O valor final sem possibilidade de negociação',
          'Se o cliente é "bom" ou "ruim"',
        ],
        correctIndex: 1,
      },
    ],
  },
]

async function main() {
  for (const m of modules) {
    const { quiz, ...moduleData } = m
    const created = await prisma.module.upsert({
      where: { slug: m.slug },
      update: moduleData,
      create: moduleData,
    })

    await prisma.quizQuestion.deleteMany({ where: { moduleId: created.id } })
    await prisma.quizQuestion.createMany({
      data: quiz.map((q, i) => ({
        moduleId: created.id,
        order: i,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })),
    })
  }

  console.log(`✅ Academia de Vendas: ${modules.length} módulos seedados.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
