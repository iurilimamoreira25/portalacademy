export interface CustomerProfile {
  id: string
  name: string
  age: number
  city: string
  profession: string
  mood: 'angry' | 'friendly' | 'suspicious' | 'curious' | 'indecisive' | 'urgent' | 'researcher'
  objective: string
  technicalKnowledge: 'low' | 'medium' | 'high'
  budget: number
  maxPrice: number
  interestLevel: number
  urgency: 'low' | 'medium' | 'high'
  personality: string
  scenario: string
  productInterest: string
  buyProbability: number
  focusTechnique?: string
  practiceBriefing?: string
}

const names = [
  'Carlos Silva', 'Ana Rodrigues', 'Roberto Santos', 'Patricia Lima', 'Fernando Costa',
  'Juliana Alves', 'Marcos Oliveira', 'Camila Ferreira', 'Lucas Pereira', 'Amanda Castro',
  'Diego Martins', 'Fernanda Souza', 'Paulo Nascimento', 'Larissa Mendes', 'Thiago Barbosa',
  'Renata Cardoso', 'Bruno Araújo', 'Vanessa Gomes', 'Ricardo Teixeira', 'Isabela Rocha',
  'Gustavo Pereira', 'Mariana Lima', 'Rafael Costa', 'Juliana Mendes', 'Eduardo Silva',
]

const cities = [
  'São Paulo', 'Campinas', 'Ribeirão Preto', 'Santos', 'São José dos Campos',
  'Sorocaba', 'Mogi das Cruzes', 'Osasco', 'Guarulhos', 'Santo André',
  'São Bernardo do Campo', 'Barueri', 'Jundiaí', 'Piracicaba', 'Indaiatuba',
]

const professions = [
  'Arquiteto', 'Engenheiro Civil', 'Construtor', 'Pedreiro', 'Dono de Construtora',
  'Incorporador', 'Dono de Residência', 'Síndico', 'Designer de Interiores', 'Empreiteiro',
  'Empresário', 'Comerciante', 'Médico', 'Advogado', 'Dentista', 'Professor',
]

const scenarios = [
  'Cliente quer instalar box de vidro temperado no banheiro',
  'Cliente precisa de fachada em vidro temperado para loja comercial',
  'Cliente quer espelho para academia em casa',
  'Cliente precisa de cobertura em vidro para área externa de churrasqueira',
  'Cliente quer esquadrias de alumínio para nova construção',
  'Cliente quebrou o vidro da janela e precisa de reposição urgente',
  'Cliente está pesquisando preços para futura reforma do apartamento',
  'Cliente quer vidro laminado para porta de entrada da casa',
  'Cliente precisa de guarda-corpo em vidro temperado para escada',
  'Cliente quer substituir janelas antigas por esquadrias modernas',
  'Cliente quer pele de vidro para escritório comercial',
  'Cliente precisa de espelhos para salão de beleza',
  'Cliente veio por indicação de um amigo e quer orçamento de box',
  'Cliente quer comparar preços com concorrentes para janelas',
  'Cliente precisa de orçamento completo para condomínio residencial',
  'Cliente quer cobrir varanda com vidro temperado',
  'Cliente precisa de divisória em vidro para escritório',
  'Cliente quer porta de vidro temperado para loja',
]

const moods = ['angry', 'friendly', 'suspicious', 'curious', 'indecisive', 'urgent', 'researcher'] as const

const personalities = [
  'Muito direto e objetivo, não quer perder tempo com rodeios',
  'Desconfiado e cético, questiona cada informação antes de acreditar',
  'Simpático mas extremamente indeciso, precisa de muita segurança para decidir',
  'Pesquisador meticuloso, compara tudo com concorrentes e conhece os preços do mercado',
  'Arquiteto exigente que entende muito de materiais e qualidade',
  'Empresário ocupado com muito pouco tempo, quer respostas rápidas e precisas',
  'Dono de casa preocupado com qualidade e durabilidade do produto',
  'Construtor experiente que negocia muito e conhece bem os custos',
  'Cliente que já teve experiência ruim com outro fornecedor e está desconfiado',
  'Cliente fiel que já comprou antes e tem expectativas altas',
  'Cliente econômico que só quer o menor preço, sem se importar muito com qualidade',
  'Cliente rico que não liga para preço mas exige o melhor da linha',
  'Cliente com urgência extrema, precisa para esta semana',
  'Cliente tranquilo planejando com antecedência de 6 meses',
  'Cliente que quer desconto agressivo e vai pechinchar muito',
]

export function generateCustomer(): CustomerProfile {
  const mood = moods[Math.floor(Math.random() * moods.length)]
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
  const profession = professions[Math.floor(Math.random() * professions.length)]
  const budgetBase = Math.random() * 45000 + 500
  const budget = Math.round(budgetBase / 100) * 100

  return {
    id: crypto.randomUUID(),
    name: names[Math.floor(Math.random() * names.length)],
    age: Math.floor(Math.random() * 45) + 25,
    city: cities[Math.floor(Math.random() * cities.length)],
    profession,
    mood,
    objective: scenario,
    technicalKnowledge: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
    budget,
    maxPrice: Math.round(budget * (Math.random() * 0.3 + 1.1)),
    interestLevel: Math.floor(Math.random() * 9) + 1,
    urgency: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    scenario,
    productInterest: scenario.split(' ').slice(-4).join(' '),
    buyProbability: Math.random() * 0.75 + 0.1,
  }
}
