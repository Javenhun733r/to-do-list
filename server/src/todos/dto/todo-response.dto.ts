export class TodoResponseDTO {
  id: string;
  title: string;
  isDone: boolean;
  priority: number;
  dueDate: string | null;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
