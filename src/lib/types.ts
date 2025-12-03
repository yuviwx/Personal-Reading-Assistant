export type Article = {
  id: string;
  url: string;
  headline?: string;
  topic?: string;
  estimatedTime?: number;
  summary?: string;
  isRead: boolean;
  createdAt: number;
};
