export interface Task {
  id: string;
  title: string;
  description: string;
  baseBP: number;
  maxCompletions: number;
  currentCompletions: number;
  completed: boolean;
  visible: boolean;
}

