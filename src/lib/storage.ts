"use client";

import type { Article } from './types';

const STORAGE_KEY = 'offline-articles';

// Helper to safely access localStorage
const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const getArticles = (): Article[] => {
  const storage = getLocalStorage();
  if (!storage) return [];

  const articlesJson = storage.getItem(STORAGE_KEY);
  if (!articlesJson) return [];

  try {
    const articles = JSON.parse(articlesJson) as Article[];
    // Sort by creation date, newest first
    return articles.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Failed to parse articles from localStorage", error);
    return [];
  }
};

export const saveArticles = (articles: Article[]): void => {
  const storage = getLocalStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

export const addArticle = (newArticleData: Partial<Omit<Article, 'id' | 'isRead' | 'createdAt'>> & { url: string }): Article => {
  const articles = getArticles();
  const newArticle: Article = {
    headline: newArticleData.headline || '',
    topic: newArticleData.topic || '',
    summary: newArticleData.summary || '',
    estimatedTime: newArticleData.estimatedTime || 0,
    ...newArticleData,
    id: Date.now().toString(),
    isRead: false,
    createdAt: Date.now(),
  };

  const updatedArticles = [newArticle, ...articles];
  saveArticles(updatedArticles);
  return newArticle;
};

export const getArticleById = (id: string): Article | undefined => {
  const articles = getArticles();
  return articles.find(article => article.id === id);
};

export const updateArticle = (id: string, updates: Partial<Omit<Article, 'id'>>): Article | undefined => {
  const articles = getArticles();
  let updatedArticle: Article | undefined;
  const updatedArticles = articles.map(article => {
    if (article.id === id) {
      updatedArticle = { ...article, ...updates };
      return updatedArticle;
    }
    return article;
  });

  if (updatedArticle) {
    saveArticles(updatedArticles);
  }
  
  return updatedArticle;
};

export const getUniqueTopics = (): string[] => {
  const articles = getArticles();
  const topics = new Set<string>();
  articles.forEach(article => {
    if (article.topic) {
      topics.add(article.topic);
    }
  });
  return Array.from(topics).sort();
};
