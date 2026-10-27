import { Question } from '../types/question';
import rawQuestions from '../data/questions.json';

const questionsData = rawQuestions as Question[];
const questionMap = new Map<string, Question>(questionsData.map(q => [q.id, q]));

export const questionService = {
  getAllQuestions(): Question[] {
    return questionsData;
  },

  getQuestionById(id: string): Question | undefined {
    return questionMap.get(id);
  },

  getTotalCount(): number {
    return questionsData.length;
  },

  getQuestionsByIds(ids: string[]): Question[] {
    return ids.map(id => questionMap.get(id)).filter((q): q is Question => Boolean(q));
  },

  get2025Questions(): Question[] {
    return questionsData.filter(q => q.year === '2025');
  },

  getClassicQuestions(): Question[] {
    return questionsData.filter(q => q.year !== '2025');
  },
};
