export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
}

export interface ShortsStrategy {
  hook: string;
  script: string;
  visualCues: string[];
  hashtags: string[];
  caption: string;
}

export interface VideoStrategy {
  titleOptions: string[];
  thumbnailText: string;
  structure: {
    intro: string;
    body: string;
    conclusion: string;
  };
  seoKeywords: string[];
}

export interface AnalysisResult {
  recipe: Recipe;
  shortsStrategy: ShortsStrategy;
  videoStrategy: VideoStrategy;
  thumbnailPrompt: string;
}

export enum AppState {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR,
}