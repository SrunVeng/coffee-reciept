function makeId(name) {
  const slug = String(name || 'item')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug || 'item'}-${Date.now().toString(36)}`
}

function validateRecipe(recipe, ingredientIds, preparationIds) {
  if (!recipe.name?.trim()) return 'Recipe name is required'
  if (!recipe.category?.trim()) return 'Category is required'
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) return 'Add at least one ingredient'
  if (recipe.ingredients.some((item) => !ingredientIds.has(item.ingredientId))) return 'A selected ingredient no longer exists'
  if (recipe.ingredients.some((item) => Number(item.amount) <= 0 || !item.unit?.trim())) return 'Every ingredient needs an amount and unit'
  if (recipe.preparations?.some((item) => !preparationIds.has(item.preparationId))) return 'A selected preparation no longer exists'
  if (recipe.preparations?.some((item) => Number(item.amount) <= 0 || !item.unit?.trim())) return 'Every preparation needs an amount and unit'
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) return 'Add at least one step'
  if (!Number.isFinite(Number(recipe.price)) || Number(recipe.price) <= 0) return 'Price must be greater than zero'
  return null
}

function validatePreparation(preparation, ingredientIds) {
  if (!preparation.name?.trim()) return 'Preparation name is required'
  if (!Array.isArray(preparation.ingredients) || preparation.ingredients.length === 0) return 'Add at least one ingredient'
  if (preparation.ingredients.some((item) => !ingredientIds.has(item.ingredientId))) return 'A selected ingredient no longer exists'
  if (preparation.ingredients.some((item) => Number(item.amount) <= 0 || !item.unit?.trim())) return 'Every ingredient needs an amount and unit'
  if (!Array.isArray(preparation.steps) || preparation.steps.length === 0) return 'Add at least one step'
  if (Number(preparation.yieldAmount) <= 0 || !preparation.yieldUnit?.trim()) return 'Yield amount and unit are required'
  return null
}

function cleanPreparation(body, id) {
  return {
    id,
    name: body.name.trim(),
    nameKm: body.nameKm?.trim() || '',
    description: body.description?.trim() || '',
    descriptionKm: body.descriptionKm?.trim() || '',
    type: body.type?.trim() || 'Other',
    prepTime: Number(body.prepTime) || 1,
    yieldAmount: Number(body.yieldAmount),
    yieldUnit: body.yieldUnit.trim(),
    ingredients: body.ingredients.map((item) => ({
      ingredientId: item.ingredientId,
      amount: Number(item.amount),
      unit: item.unit.trim(),
    })),
    steps: body.steps.map((step) => step.trim()).filter(Boolean),
    stepsKm: body.steps.map((_, index) => body.stepsKm?.[index]?.trim() || ''),
    storage: body.storage?.trim() || '',
    storageKm: body.storageKm?.trim() || '',
    sources: Array.isArray(body.sources) ? body.sources : [],
  }
}

function cleanRecipe(body, id) {
  return {
    id,
    name: body.name.trim(),
    nameKm: body.nameKm?.trim() || '',
    category: body.category.trim(),
    description: body.description?.trim() || '',
    descriptionKm: body.descriptionKm?.trim() || '',
    prepTime: Number(body.prepTime) || 1,
    price: Number(body.price),
    ingredients: body.ingredients.map((item) => ({
      ingredientId: item.ingredientId,
      amount: Number(item.amount),
      unit: item.unit.trim(),
    })),
    preparations: (body.preparations || []).map((item) => ({
      preparationId: item.preparationId,
      amount: Number(item.amount),
      unit: item.unit.trim(),
    })),
    steps: body.steps.map((step) => step.trim()).filter(Boolean),
    stepsKm: body.steps.map((_, index) => body.stepsKm?.[index]?.trim() || ''),
    notes: body.notes?.trim() || '',
    notesKm: body.notesKm?.trim() || '',
    sources: Array.isArray(body.sources) ? body.sources : [],
  }
}

function result(status, body, data, changed = false) {
  return { status, body, data, changed, handled: true }
}

export function processRecipeRequest({ method, pathname, body = {}, data }) {
  if (method === 'GET' && pathname === '/api/data') return result(200, data, data)

  if (method === 'POST' && pathname === '/api/ingredients') {
    if (!body.name?.trim() || !body.defaultUnit?.trim()) return result(400, { error: 'Ingredient name and unit are required' }, data)
    if (data.ingredients.some((item) => item.name.toLowerCase() === body.name.trim().toLowerCase())) {
      return result(409, { error: 'That ingredient already exists' }, data)
    }
    const ingredient = {
      id: makeId(body.name),
      name: body.name.trim(),
      nameKm: body.nameKm?.trim() || '',
      category: body.category?.trim() || 'Other',
      defaultUnit: body.defaultUnit.trim(),
    }
    data.ingredients.push(ingredient)
    return result(201, ingredient, data, true)
  }

  const ingredientMatch = pathname.match(/^\/api\/ingredients\/([^/]+)$/)
  if (ingredientMatch && method === 'PUT') {
    const index = data.ingredients.findIndex((item) => item.id === ingredientMatch[1])
    if (index < 0) return result(404, { error: 'Ingredient not found' }, data)
    if (!body.name?.trim() || !body.defaultUnit?.trim()) return result(400, { error: 'Ingredient name and unit are required' }, data)
    data.ingredients[index] = {
      ...data.ingredients[index],
      name: body.name.trim(),
      nameKm: body.nameKm?.trim() || '',
      category: body.category?.trim() || 'Other',
      defaultUnit: body.defaultUnit.trim(),
    }
    return result(200, data.ingredients[index], data, true)
  }

  if (ingredientMatch && method === 'DELETE') {
    const isUsed = data.recipes.some((recipe) =>
      recipe.ingredients.some((item) => item.ingredientId === ingredientMatch[1]),
    ) || data.preparations?.some((preparation) =>
      preparation.ingredients.some((item) => item.ingredientId === ingredientMatch[1]),
    )
    if (isUsed) return result(409, { error: 'This ingredient is used in a recipe and cannot be deleted' }, data)
    const before = data.ingredients.length
    data.ingredients = data.ingredients.filter((item) => item.id !== ingredientMatch[1])
    if (data.ingredients.length === before) return result(404, { error: 'Ingredient not found' }, data)
    return result(200, { ok: true }, data, true)
  }

  if (method === 'POST' && pathname === '/api/preparations') {
    const error = validatePreparation(body, new Set(data.ingredients.map((item) => item.id)))
    if (error) return result(400, { error }, data)
    const preparation = cleanPreparation(body, makeId(body.name))
    data.preparations = data.preparations || []
    data.preparations.unshift(preparation)
    return result(201, preparation, data, true)
  }

  const preparationMatch = pathname.match(/^\/api\/preparations\/([^/]+)$/)
  if (preparationMatch && method === 'PUT') {
    const index = (data.preparations || []).findIndex((item) => item.id === preparationMatch[1])
    if (index < 0) return result(404, { error: 'Preparation not found' }, data)
    const error = validatePreparation(body, new Set(data.ingredients.map((item) => item.id)))
    if (error) return result(400, { error }, data)
    data.preparations[index] = cleanPreparation(body, data.preparations[index].id)
    return result(200, data.preparations[index], data, true)
  }

  if (preparationMatch && method === 'DELETE') {
    const isUsed = data.recipes.some((recipe) =>
      recipe.preparations?.some((item) => item.preparationId === preparationMatch[1]),
    )
    if (isUsed) return result(409, { error: 'This preparation is used in a drink and cannot be deleted' }, data)
    const before = (data.preparations || []).length
    data.preparations = (data.preparations || []).filter((item) => item.id !== preparationMatch[1])
    if (data.preparations.length === before) return result(404, { error: 'Preparation not found' }, data)
    return result(200, { ok: true }, data, true)
  }

  if (method === 'POST' && pathname === '/api/recipes') {
    const error = validateRecipe(
      body,
      new Set(data.ingredients.map((item) => item.id)),
      new Set((data.preparations || []).map((item) => item.id)),
    )
    if (error) return result(400, { error }, data)
    const recipe = cleanRecipe(body, makeId(body.name))
    data.recipes.unshift(recipe)
    return result(201, recipe, data, true)
  }

  const recipeMatch = pathname.match(/^\/api\/recipes\/([^/]+)$/)
  if (recipeMatch && method === 'PUT') {
    const index = data.recipes.findIndex((item) => item.id === recipeMatch[1])
    if (index < 0) return result(404, { error: 'Recipe not found' }, data)
    const error = validateRecipe(
      body,
      new Set(data.ingredients.map((item) => item.id)),
      new Set((data.preparations || []).map((item) => item.id)),
    )
    if (error) return result(400, { error }, data)
    data.recipes[index] = cleanRecipe(body, data.recipes[index].id)
    return result(200, data.recipes[index], data, true)
  }

  if (recipeMatch && method === 'DELETE') {
    const before = data.recipes.length
    data.recipes = data.recipes.filter((item) => item.id !== recipeMatch[1])
    if (data.recipes.length === before) return result(404, { error: 'Recipe not found' }, data)
    return result(200, { ok: true }, data, true)
  }

  return { status: 404, body: { error: 'Not found' }, data, changed: false, handled: false }
}
