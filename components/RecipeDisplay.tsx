import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, ChefHat, CheckCircle2 } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-orange-50 p-6 border-b border-orange-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{recipe.title}</h2>
        <p className="text-slate-600 leading-relaxed">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Prep: {recipe.prepTime || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <ChefHat className="w-4 h-4 text-orange-500" />
            <span>Cook: {recipe.cookTime || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <Users className="w-4 h-4 text-orange-500" />
            <span>Serves: {recipe.servings || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-0">
        <div className="p-6 md:border-r border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">1</span>
            Ingredients
          </h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 md:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">2</span>
            Instructions
          </h3>
          <div className="space-y-6">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-slate-100 text-slate-400 font-semibold flex items-center justify-center text-sm group-hover:border-orange-200 group-hover:text-orange-600 transition-colors">
                  {idx + 1}
                </div>
                <p className="text-slate-700 pt-1 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
