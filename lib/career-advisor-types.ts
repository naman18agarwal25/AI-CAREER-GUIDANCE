export type CareerDomain = 
  | 'research' 
  | 'software-engineering' 
  | 'medicine' 
  | 'business' 
  | 'creative';

export type QuestionType = 'slider' | 'multiple-choice' | 'quick-reply';

// Six parameters from the scoring model
export type Parameter = 'I' | 'S' | 'D' | 'T' | 'G' | 'P';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  parameter: Parameter; // Which parameter this measures
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  // For domain-specific questions
  targetDomains?: CareerDomain[];
}

export interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  question?: Question;
  timestamp: Date;
}

export interface DomainScore {
  domain: CareerDomain;
  score: number;
  confidence: number;
  eliminated: boolean;
  parameterScores: Record<Parameter, number[]>;
}

export interface AssessmentResult {
  rankedDomains: {
    domain: CareerDomain;
    score: number;
    confidence: number;
  }[];
  topDomain: CareerDomain;
  suitabilityScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendedSpecializations: string[];
  skillsToImprove: string[];
}

export interface UserAnswer {
  questionId: string;
  value: number | string;
  numericValue: number;
  parameter: Parameter;
}

export const domainInfo: Record<CareerDomain, { name: string; icon: string; description: string }> = {
  'research': {
    name: 'Research',
    icon: '🔬',
    description: 'Academia, scientific discovery, and innovation'
  },
  'software-engineering': {
    name: 'Software Engineering',
    icon: '💻',
    description: 'Building software products and systems'
  },
  'medicine': {
    name: 'Medicine',
    icon: '⚕️',
    description: 'Healthcare, patient care, and medical science'
  },
  'business': {
    name: 'Business',
    icon: '📊',
    description: 'Entrepreneurship, management, and strategy'
  },
  'creative': {
    name: 'Creative Fields',
    icon: '🎨',
    description: 'Design, arts, media, and content creation'
  }
};

// Domain weights from the scoring model
export const domainWeights: Record<CareerDomain, {
  wI: number; wS: number; wD: number; wT: number; wG: number; wIS: number; wST: number;
}> = {
  'research': { wI: 0.30, wS: 0.35, wD: 0.20, wT: 0.10, wG: 0.05, wIS: 0.15, wST: 0.05 },
  'software-engineering': { wI: 0.20, wS: 0.40, wD: 0.15, wT: 0.15, wG: 0.10, wIS: 0.10, wST: 0.15 },
  'medicine': { wI: 0.25, wS: 0.30, wD: 0.25, wT: 0.10, wG: 0.10, wIS: 0.12, wST: 0.08 },
  'business': { wI: 0.20, wS: 0.25, wD: 0.15, wT: 0.20, wG: 0.20, wIS: 0.10, wST: 0.15 },
  'creative': { wI: 0.35, wS: 0.30, wD: 0.15, wT: 0.10, wG: 0.10, wIS: 0.15, wST: 0.05 },
};

// BASELINE QUESTIONS - Asked to everyone at the start
export const baselineQuestions: Question[] = [
  // Interest (I) baseline
  { 
    id: 'base-1', 
    text: 'Do you prefer working with ideas and theories, or with practical hands-on tasks?', 
    type: 'slider', 
    parameter: 'I', 
    min: -10, max: 10, 
    minLabel: 'Ideas & Theories', 
    maxLabel: 'Hands-on Tasks' 
  },
  { 
    id: 'base-2', 
    text: 'How much do you enjoy solving complex problems that have no clear solution?', 
    type: 'slider', 
    parameter: 'I', 
    min: -10, max: 10, 
    minLabel: 'Prefer clear paths', 
    maxLabel: 'Love the challenge' 
  },
  // Skills (S) baseline
  { 
    id: 'base-3', 
    text: 'How would you rate your analytical and logical thinking abilities?', 
    type: 'slider', 
    parameter: 'S', 
    min: -10, max: 10, 
    minLabel: 'Developing', 
    maxLabel: 'Very strong' 
  },
  { 
    id: 'base-4', 
    text: 'How comfortable are you with learning new technical skills quickly?', 
    type: 'slider', 
    parameter: 'S', 
    min: -10, max: 10, 
    minLabel: 'Takes time', 
    maxLabel: 'Quick learner' 
  },
  // Domain (D) baseline
  { 
    id: 'base-5', 
    text: 'What type of environment do you thrive in?', 
    type: 'multiple-choice', 
    parameter: 'D', 
    options: ['Quiet, focused workspace', 'Collaborative team setting', 'Fast-paced dynamic environment', 'Creative open space'] 
  },
  { 
    id: 'base-6', 
    text: 'Do you prefer working independently or as part of a team?', 
    type: 'slider', 
    parameter: 'D', 
    min: -10, max: 10, 
    minLabel: 'Independently', 
    maxLabel: 'Team-oriented' 
  },
  // Trend awareness (T) baseline
  { 
    id: 'base-7', 
    text: 'How often do you keep up with industry news and emerging trends?', 
    type: 'multiple-choice', 
    parameter: 'T', 
    options: ['Rarely', 'Occasionally', 'Regularly', 'Daily - I love staying current'] 
  },
  // Growth awareness (G) baseline
  { 
    id: 'base-8', 
    text: 'How important is job market stability and growth potential in your career choice?', 
    type: 'slider', 
    parameter: 'G', 
    min: -10, max: 10, 
    minLabel: 'Not important', 
    maxLabel: 'Very important' 
  },
  // Persistence/Mentality (P) baseline
  { 
    id: 'base-9', 
    text: 'When you face repeated failures or setbacks, how do you typically respond?', 
    type: 'multiple-choice', 
    parameter: 'P', 
    options: ['Get discouraged and consider quitting', 'Take a break and reassess', 'Push through with determination', 'Get energized to find new approaches'] 
  },
  { 
    id: 'base-10', 
    text: 'How comfortable are you with delayed gratification - working hard now for results years later?', 
    type: 'slider', 
    parameter: 'P', 
    min: -10, max: 10, 
    minLabel: 'Need quick results', 
    maxLabel: 'Very patient' 
  },
  // More Interest/Domain clarification
  { 
    id: 'base-11', 
    text: 'What draws you more: helping people directly, or creating things that help many indirectly?', 
    type: 'slider', 
    parameter: 'I', 
    min: -10, max: 10, 
    minLabel: 'Direct help', 
    maxLabel: 'Create at scale' 
  },
  { 
    id: 'base-12', 
    text: 'How do you feel about presenting your work or ideas to others?', 
    type: 'multiple-choice', 
    parameter: 'S', 
    options: ['Avoid it if possible', 'Can do it when needed', 'Comfortable with it', 'I enjoy it and seek opportunities'] 
  },
];

// DOMAIN-SPECIFIC QUESTIONS - Asked based on likely career matches
export const domainSpecificQuestions: Record<CareerDomain, Question[]> = {
  'research': [
    { id: 'r1', text: 'How much do you enjoy reading academic papers and exploring the latest discoveries?', type: 'slider', parameter: 'I', min: -10, max: 10, minLabel: 'Not at all', maxLabel: 'Love it', targetDomains: ['research'] },
    { id: 'r2', text: 'How comfortable are you with statistical analysis and data interpretation?', type: 'slider', parameter: 'S', min: -10, max: 10, minLabel: 'Uncomfortable', maxLabel: 'Very confident', targetDomains: ['research'] },
    { id: 'r3', text: 'How patient are you when working on long-term projects with delayed results?', type: 'slider', parameter: 'P', min: -10, max: 10, minLabel: 'Very impatient', maxLabel: 'Extremely patient', targetDomains: ['research'] },
    { id: 'r4', text: 'How excited are you by the prospect of contributing new knowledge to your field?', type: 'slider', parameter: 'I', min: -10, max: 10, minLabel: 'Not excited', maxLabel: 'Thrilled', targetDomains: ['research'] },
    { id: 'r5', text: 'How do you feel about the academic career path (publishing, grants, tenure)?', type: 'multiple-choice', parameter: 'D', options: ['Sounds stressful', 'Willing to do it', 'Find it motivating', 'Excited by the challenge'], targetDomains: ['research'] },
  ],
  'software-engineering': [
    { id: 's1', text: 'How much do you enjoy building things with code or technology?', type: 'slider', parameter: 'I', min: -10, max: 10, minLabel: 'Not at all', maxLabel: 'Love it', targetDomains: ['software-engineering'] },
    { id: 's2', text: 'How comfortable are you learning new programming languages or frameworks?', type: 'slider', parameter: 'S', min: -10, max: 10, minLabel: 'Uncomfortable', maxLabel: 'Very comfortable', targetDomains: ['software-engineering'] },
    { id: 's3', text: 'How do you approach debugging a difficult issue?', type: 'multiple-choice', parameter: 'P', options: ['Get frustrated and need help', 'Systematic trial and error', 'Deep dive into documentation', 'Enjoy the detective work'], targetDomains: ['software-engineering'] },
    { id: 's4', text: 'How well do you handle tight deadlines and changing requirements?', type: 'slider', parameter: 'P', min: -10, max: 10, minLabel: 'Struggle', maxLabel: 'Thrive', targetDomains: ['software-engineering'] },
    { id: 's5', text: 'How interested are you in system design and architecture decisions?', type: 'slider', parameter: 'T', min: -10, max: 10, minLabel: 'Not interested', maxLabel: 'Fascinated', targetDomains: ['software-engineering'] },
  ],
  'medicine': [
    { id: 'm1', text: 'How interested are you in human biology and understanding how the body works?', type: 'slider', parameter: 'I', min: -10, max: 10, minLabel: 'Not interested', maxLabel: 'Fascinated', targetDomains: ['medicine'] },
    { id: 'm2', text: 'How comfortable are you in high-stress, critical decision situations?', type: 'slider', parameter: 'P', min: -10, max: 10, minLabel: 'Very uncomfortable', maxLabel: 'Calm and focused', targetDomains: ['medicine'] },
    { id: 'm3', text: 'How do you handle emotional situations when others are suffering?', type: 'multiple-choice', parameter: 'P', options: ['Struggle to stay composed', 'Maintain professional distance', 'Empathetic but stable', 'Draw strength from helping'], targetDomains: ['medicine'] },
    { id: 'm4', text: 'How committed are you to continuous learning throughout your career?', type: 'slider', parameter: 'T', min: -10, max: 10, minLabel: 'Prefer stability', maxLabel: 'Lifelong learner', targetDomains: ['medicine'] },
    { id: 'm5', text: 'How do you feel about the long training path in medicine (7-15+ years)?', type: 'multiple-choice', parameter: 'D', options: ['Too long for me', 'Concerning but willing', 'Acceptable tradeoff', 'Worth it for the career'], targetDomains: ['medicine'] },
  ],
  'business': [
    { id: 'b1', text: 'How excited are you about identifying opportunities and building ventures?', type: 'slider', parameter: 'I', min: -10, max: 10, minLabel: 'Not excited', maxLabel: 'Very excited', targetDomains: ['business'] },
    { id: 'b2', text: 'How comfortable are you with financial planning and analysis?', type: 'slider', parameter: 'S', min: -10, max: 10, minLabel: 'Uncomfortable', maxLabel: 'Very comfortable', targetDomains: ['business'] },
    { id: 'b3', text: 'How do you approach networking and building professional relationships?', type: 'multiple-choice', parameter: 'D', options: ['Avoid when possible', 'Do it when necessary', 'Comfortable and natural', 'Actively seek opportunities'], targetDomains: ['business'] },
    { id: 'b4', text: 'How well do you handle financial risk and uncertainty?', type: 'slider', parameter: 'P', min: -10, max: 10, minLabel: 'Risk averse', maxLabel: 'Risk tolerant', targetDomains: ['business'] },
    { id: 'b5', text: 'How interested are you in market trends, economics, and industry dynamics?', type: 'slider', parameter: 'T', min: -10, max: 10, minLabel: 'Not interested', maxLabel: 'Very interested', targetDomains: ['business'] },
  ],
  'creative': [
    { id: 'c1', text: 'How driven are you to express yourself through creative work?', type: 'slider', parameter: 'I', min: -10, max: 10, minLabel: 'Not driven', maxLabel: 'Highly driven', targetDomains: ['creative'] },
    { id: 'c2', text: 'How comfortable are you receiving and incorporating feedback on your work?', type: 'slider', parameter: 'S', min: -10, max: 10, minLabel: 'Uncomfortable', maxLabel: 'Welcome it', targetDomains: ['creative'] },
    { id: 'c3', text: 'How do you handle creative blocks or periods of low inspiration?', type: 'multiple-choice', parameter: 'P', options: ['Get stuck for long periods', 'Wait for inspiration', 'Have techniques to push through', 'Use them as growth opportunities'], targetDomains: ['creative'] },
    { id: 'c4', text: 'How do you balance creative vision with client or market demands?', type: 'slider', parameter: 'D', min: -10, max: 10, minLabel: 'Pure vision', maxLabel: 'Market-driven', targetDomains: ['creative'] },
    { id: 'c5', text: 'How interested are you in design trends, art movements, and cultural shifts?', type: 'slider', parameter: 'T', min: -10, max: 10, minLabel: 'Not interested', maxLabel: 'Very interested', targetDomains: ['creative'] },
  ],
};

// Scoring algorithm
const ALPHA = 0.2; // Mentality multiplier constant
const CONFIDENCE_THRESHOLD = 0.8;
const MIN_QUESTIONS = 12;
const MAX_QUESTIONS = 30;
const ELIMINATION_THRESHOLD = -3; // If average score drops below this, eliminate

export function calculateDomainScores(answers: UserAnswer[]): DomainScore[] {
  const domains: CareerDomain[] = ['research', 'software-engineering', 'medicine', 'business', 'creative'];
  
  return domains.map(domain => {
    const parameterScores: Record<Parameter, number[]> = {
      'I': [], 'S': [], 'D': [], 'T': [], 'G': [], 'P': []
    };
    
    // Collect all scores per parameter
    answers.forEach(answer => {
      parameterScores[answer.parameter].push(answer.numericValue);
    });
    
    // Calculate average for each parameter
    const avgParams: Record<Parameter, number> = {
      'I': 0, 'S': 0, 'D': 0, 'T': 0, 'G': 0, 'P': 0
    };
    
    for (const param of Object.keys(parameterScores) as Parameter[]) {
      const scores = parameterScores[param];
      avgParams[param] = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;
    }
    
    // Calculate exponents (k = 1 + preference_score / 20)
    const getK = (param: Parameter) => 1 + Math.max(0, avgParams[param]) / 20;
    
    const weights = domainWeights[domain];
    
    // Calculate base score ψ
    const psi = 
      weights.wI * Math.pow(Math.max(0, avgParams['I'] + 10), getK('I')) / Math.pow(20, getK('I')) +
      weights.wS * Math.pow(Math.max(0, avgParams['S'] + 10), getK('S')) / Math.pow(20, getK('S')) +
      weights.wD * Math.pow(Math.max(0, avgParams['D'] + 10), getK('D')) / Math.pow(20, getK('D')) +
      weights.wT * Math.pow(Math.max(0, avgParams['T'] + 10), getK('T')) / Math.pow(20, getK('T')) +
      weights.wG * Math.pow(Math.max(0, avgParams['G'] + 10), getK('G')) / Math.pow(20, getK('G')) +
      weights.wIS * ((avgParams['I'] + 10) / 20) * ((avgParams['S'] + 10) / 20) +
      weights.wST * ((avgParams['S'] + 10) / 20) * ((avgParams['T'] + 10) / 20);
    
    // Apply mentality multiplier
    const mentalityFactor = 1 + ALPHA * ((avgParams['P'] + 10) / 20);
    const finalScore = psi * mentalityFactor * 100;
    
    // Calculate confidence from variance
    const allScores = answers.map(a => a.numericValue);
    const mean = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    const variance = allScores.length > 0 
      ? allScores.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / allScores.length 
      : 100;
    const confidence = Math.max(0, 1 - (variance / 100));
    
    // Check if domain should be eliminated
    const eliminated = avgParams['I'] < ELIMINATION_THRESHOLD || 
                       avgParams['S'] < ELIMINATION_THRESHOLD ||
                       (answers.length >= 8 && finalScore < 20);
    
    return {
      domain,
      score: Math.min(100, Math.max(0, finalScore)),
      confidence,
      eliminated,
      parameterScores,
    };
  });
}

export function shouldStopQuestioning(answers: UserAnswer[], domainScores: DomainScore[]): boolean {
  if (answers.length < MIN_QUESTIONS) return false;
  if (answers.length >= MAX_QUESTIONS) return true;
  
  // Check if we have high confidence in top domains
  const activeDomains = domainScores.filter(d => !d.eliminated);
  if (activeDomains.length === 0) return true;
  
  const avgConfidence = activeDomains.reduce((sum, d) => sum + d.confidence, 0) / activeDomains.length;
  return avgConfidence >= CONFIDENCE_THRESHOLD;
}

export function getNextQuestion(
  answers: UserAnswer[], 
  domainScores: DomainScore[], 
  askedQuestionIds: Set<string>
): Question | null {
  const questionCount = answers.length;
  
  // Phase 1: Baseline questions
  if (questionCount < baselineQuestions.length) {
    const nextBaseline = baselineQuestions.find(q => !askedQuestionIds.has(q.id));
    if (nextBaseline) return nextBaseline;
  }
  
  // Phase 2: Domain-specific questions for top candidates
  const activeDomains = domainScores
    .filter(d => !d.eliminated)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Focus on top 3 domains
  
  for (const domainScore of activeDomains) {
    const questions = domainSpecificQuestions[domainScore.domain];
    const nextQuestion = questions.find(q => !askedQuestionIds.has(q.id));
    if (nextQuestion) return nextQuestion;
  }
  
  return null;
}

export function generateFinalResults(domainScores: DomainScore[], answers: UserAnswer[]): AssessmentResult {
  const rankedDomains = domainScores
    .filter(d => !d.eliminated)
    .sort((a, b) => b.score - a.score)
    .map(d => ({
      domain: d.domain,
      score: Math.round(d.score),
      confidence: Math.round(d.confidence * 100),
    }));
  
  if (rankedDomains.length === 0) {
    rankedDomains.push({
      domain: 'creative' as CareerDomain,
      score: 50,
      confidence: 50,
    });
  }
  
  const topDomain = rankedDomains[0].domain;
  const topScore = rankedDomains[0].score;
  
  // Calculate parameter averages for strengths/weaknesses
  const paramAverages: Record<Parameter, number> = { 'I': 0, 'S': 0, 'D': 0, 'T': 0, 'G': 0, 'P': 0 };
  const paramCounts: Record<Parameter, number> = { 'I': 0, 'S': 0, 'D': 0, 'T': 0, 'G': 0, 'P': 0 };
  
  answers.forEach(a => {
    paramAverages[a.parameter] += a.numericValue;
    paramCounts[a.parameter]++;
  });
  
  for (const p of Object.keys(paramAverages) as Parameter[]) {
    paramAverages[p] = paramCounts[p] > 0 ? paramAverages[p] / paramCounts[p] : 0;
  }
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Identify strengths (high scores)
  if (paramAverages['I'] >= 5) strengths.push('Strong passion and genuine interest');
  if (paramAverages['S'] >= 5) strengths.push('Solid skill foundation');
  if (paramAverages['P'] >= 5) strengths.push('Excellent persistence and resilience');
  if (paramAverages['T'] >= 5) strengths.push('Good awareness of trends');
  if (paramAverages['D'] >= 3) strengths.push('Good fit with work environment');
  if (paramAverages['G'] >= 5) strengths.push('Strong awareness of career growth paths');
  
  // Identify areas for growth - always provide constructive feedback
  // Sort parameters by score to find the weakest areas
  const parameterFeedback: { param: Parameter; score: number; lowMsg: string; midMsg: string }[] = [
    { param: 'I', score: paramAverages['I'], lowMsg: 'Cultivate deeper passion for the field', midMsg: 'Explore more aspects to strengthen your interest' },
    { param: 'S', score: paramAverages['S'], lowMsg: 'Focus on building core technical skills', midMsg: 'Continue expanding your skill set' },
    { param: 'P', score: paramAverages['P'], lowMsg: 'Develop strategies for handling setbacks', midMsg: 'Practice maintaining focus during challenges' },
    { param: 'T', score: paramAverages['T'], lowMsg: 'Stay more updated with industry trends', midMsg: 'Deepen your knowledge of emerging developments' },
    { param: 'G', score: paramAverages['G'], lowMsg: 'Research career growth opportunities', midMsg: 'Map out your long-term career progression' },
    { param: 'D', score: paramAverages['D'], lowMsg: 'Explore what environment suits you best', midMsg: 'Refine your ideal work setting preferences' },
  ];
  
  // Sort by score ascending to find weakest areas
  parameterFeedback.sort((a, b) => a.score - b.score);
  
  // Always add at least 2-3 growth areas from the lowest scoring parameters
  for (let i = 0; i < Math.min(3, parameterFeedback.length); i++) {
    const feedback = parameterFeedback[i];
    if (feedback.score < 0) {
      weaknesses.push(feedback.lowMsg);
    } else if (feedback.score < 5) {
      weaknesses.push(feedback.midMsg);
    } else {
      // Even high scorers get growth suggestions
      weaknesses.push(`Keep pushing further: ${feedback.midMsg.toLowerCase()}`);
    }
  }
  
  const specializationMap: Record<CareerDomain, string[]> = {
    'research': ['Data Science Research', 'Applied Research', 'R&D Management', 'Academic Research'],
    'software-engineering': ['Full-Stack Development', 'Systems Engineering', 'DevOps/Platform', 'AI/ML Engineering'],
    'medicine': ['Clinical Practice', 'Medical Research', 'Healthcare Administration', 'Specialized Surgery'],
    'business': ['Strategy Consulting', 'Product Management', 'Entrepreneurship', 'Investment Banking'],
    'creative': ['UX/UI Design', 'Brand Strategy', 'Content Creation', 'Art Direction'],
  };
  
  const skillsMap: Record<CareerDomain, string[]> = {
    'research': ['Statistical modeling', 'Academic writing', 'Grant writing', 'Peer review process'],
    'software-engineering': ['System design', 'Algorithm optimization', 'Team collaboration', 'Code review'],
    'medicine': ['Clinical reasoning', 'Patient communication', 'Medical documentation', 'Procedure skills'],
    'business': ['Financial modeling', 'Stakeholder management', 'Strategic planning', 'Presentation skills'],
    'creative': ['Design systems', 'Client management', 'Portfolio development', 'Trend analysis'],
  };
  
  return {
    rankedDomains,
    topDomain,
    suitabilityScore: topScore,
    strengths: strengths.length > 0 ? strengths : ['You have a balanced profile showing adaptability'],
    weaknesses: weaknesses,
    recommendedSpecializations: specializationMap[topDomain].slice(0, topScore > 70 ? 3 : 2),
    skillsToImprove: skillsMap[topDomain].slice(0, 3),
  };
}
