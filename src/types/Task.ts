export interface Task {
  id: string;
  title: string;
  description: string;
  baseBP: number;
  maxCompletions: number;
  currentCompletions: number;
  completed: boolean;
  visible: boolean;
  bpAwarded: boolean; // BP нараховано тільки один раз при досягненні 5+ виконань
}

