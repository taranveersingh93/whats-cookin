import { getIngredientProperty } from "./helper-functions"

const getInstructions = recipe => {
  return recipe.instructions.map(item => item.instruction)
}

const filterRecipesByTag = (allRecipes, ...tags) => {
  let filteredRecipes = tags.flatMap((tag) => {
    return allRecipes.filter(recipe => {
      return recipe.tags.includes(tag);
    });
  });

  return [ ...new Set(filteredRecipes)];
}

const getIngredients = (recipe, ingredients) => {
  return recipe.ingredients.map(ingredient => getIngredientProperty(ingredient, ingredients, 'name'))
}

const getIngredientAmounts = (recipe, ingredients) => {
  return recipe.ingredients.map(ingredient => {
    return {
      amount: ingredient.quantity.amount,
      unit: ingredient.quantity.unit,
      name: getIngredientProperty(ingredient, ingredients, 'name')
    }
  })
}

const calculateRecipeCost = (recipe, ingredients) => {
  const recipeIngredients = recipe.ingredients.map(ingredient => ({amount: ingredient.quantity.amount, costPerUnit: getIngredientProperty(ingredient, ingredients, 'estimatedCostInCents')}))
  const costInCents = recipeIngredients.reduce((totalCost, curr) => totalCost += (curr.amount * curr.costPerUnit), 0);
  return `$${(costInCents/100).toFixed(2)}`;
}

const filterRecipesByName = (recipes, name) => {
  return recipes.filter(recipe => recipe.name.toLowerCase().includes(name.toLowerCase()));
}

const filterRecipesByIngredient = (recipes, searchedIngredient, ingredientData) => {
  const matchingIngredients = ingredientData.filter(ingredient => ingredient.name?.toLowerCase().includes(searchedIngredient.toLowerCase()));
  const matchingIngredientsID = matchingIngredients.map(ingredient => ingredient.id);
  const matchedRecipes = recipes.filter(recipe => recipe.ingredients.some(ingredient => matchingIngredientsID.includes(ingredient.id)));
  return matchedRecipes;
};

const searchRecipes = (allRecipes, allIngredients, userSearch) => {
    const searchedItems = userSearch.split(' ').filter(word => word.length)
    if(searchedItems.length) {
      const recipesByName = searchedItems.flatMap(searchWord => filterRecipesByName(allRecipes, searchWord))
      const recipesByIngredient = searchedItems.flatMap(searchWord => filterRecipesByIngredient(allRecipes, searchWord, allIngredients))
      const foundRecipes = [...recipesByName, ...recipesByIngredient]
      return [...new Set(foundRecipes)]
    }
}

const getUniqueTagsFromRecipes = recipes => {
  const uniqueTags = [];
  const allTags = recipes.flatMap(recipe => recipe.tags)
  allTags.forEach(tag => {
    if (!uniqueTags.includes(tag)) {
      uniqueTags.push(tag);
    }
  })
  return uniqueTags;
}

const addInfoToTags = tags => {
  return tags.map((tag, index) => {
    return {
      name: tag,
      isActive: false,
      path: `./images/${tag}.png`,
      row: (index + 1) % 2
    }
  })
}

const populateTags = (recipes) => {
  const tagData = getUniqueTagsFromRecipes(recipes);
  const refinedTagData =  addInfoToTags(tagData);
  return refinedTagData;
}



export {
  getInstructions,
  filterRecipesByTag,
  getIngredients,
  getIngredientAmounts,
  calculateRecipeCost,
  filterRecipesByName,
  filterRecipesByIngredient,
  searchRecipes,
  populateTags,
}
