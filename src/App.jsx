import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = ['All', 'Phin', 'Espresso', 'Signature', 'Tea', 'Other']
const ingredientCategories = ['Coffee', 'Dairy', 'Tea', 'Fruit', 'Syrup', 'Water', 'Other']
const units = ['g', 'ml', 'shot', 'tsp', 'tbsp', 'piece']

const messages = {
  en: {
    staffRecipes: 'Staff recipes',
    recipes: 'Recipes',
    ingredients: 'Ingredients',
    preparations: 'Preparations',
    newRecipe: 'New recipe',
    quickGuide: 'Quick staff guide',
    whatMaking: 'What are you making?',
    findAndFollow: 'Find a drink and follow the recipe step by step.',
    searchDrink: 'Search for a drink...',
    noDrink: 'No drink found',
    tryDifferent: 'Try a different name or category.',
    minutes: 'minutes',
    minuteShort: 'min',
    price: 'Price',
    toMake: 'to make',
    prepareIngredients: 'Prepare these ingredients',
    prepareFirst: 'Prepare these components first',
    componentRecipe: 'Preparation recipe',
    preparationAmount: 'Amount used',
    yield: 'Yield',
    storage: 'Storage',
    preparationGuide: 'Reusable preparation guide',
    preparationHelp: 'Make toppings and bases consistently before assembling drinks.',
    usedByDrinks: 'Used by menu drinks',
    noPreparations: 'No preparations added',
    addPreparation: 'Add preparation',
    newPreparation: 'New preparation',
    editPreparation: 'Edit preparation',
    preparationNameEn: 'Preparation name (English)',
    preparationNameKm: 'Preparation name (Khmer)',
    preparationType: 'Preparation type',
    yieldAmount: 'Yield amount',
    yieldUnit: 'Yield unit',
    storageEn: 'Storage instructions (English)',
    storageKm: 'Storage instructions (Khmer)',
    preparationSaved: 'Preparation saved to data.json',
    preparationDeleted: 'Preparation deleted',
    cannotDeleteUsedPreparation: 'This preparation is used by a drink and cannot be deleted.',
    makeDrink: 'Make the drink',
    important: 'Important',
    delete: 'Delete',
    editRecipe: 'Edit recipe',
    closeRecipe: 'Close recipe',
    updateInstructions: 'Update instructions',
    addStaffGuide: 'Add to staff guide',
    drinkNameEn: 'Drink name (English)',
    drinkNameKm: 'Drink name (Khmer)',
    category: 'Category',
    timeMinutes: 'Time (minutes)',
    priceUsd: 'Price (USD)',
    descriptionEn: 'Description (English)',
    descriptionKm: 'Description (Khmer)',
    chooseWarehouse: 'Choose from the warehouse, then set the amount.',
    ingredient: 'Ingredient',
    chooseIngredient: 'Choose ingredient...',
    amount: 'Amount',
    unit: 'Unit',
    addIngredient: 'Add ingredient',
    addPreparationToDrink: 'Add preparation',
    choosePreparation: 'Choose preparation...',
    steps: 'Steps',
    clearAction: 'Write each instruction in English and Khmer.',
    stepEn: 'Step in English',
    stepKm: 'Step in Khmer',
    addStep: 'Add step',
    noteEn: 'Important note (English)',
    noteKm: 'Important note (Khmer)',
    optional: 'optional',
    cancel: 'Cancel',
    saving: 'Saving...',
    saveRecipe: 'Save recipe',
    ingredientWarehouse: 'Ingredient warehouse',
    warehouseHelp: 'Add ingredients once, then choose them when building any recipe.',
    editIngredient: 'Edit ingredient',
    ingredientNameEn: 'Name (English)',
    ingredientNameKm: 'Name (Khmer)',
    group: 'Group',
    defaultUnit: 'Default unit',
    saveChanges: 'Save changes',
    cancelEditing: 'Cancel editing',
    availableRecipes: 'Available for recipes',
    findIngredient: 'Find ingredient...',
    usedIn: 'used in',
    recipe: 'recipe',
    recipePlural: 'recipes',
    defaultLabel: 'default',
    loading: 'Loading staff recipes…',
    savedJson: 'Recipe saved to data.json',
    recipeDeleted: 'Recipe deleted',
    ingredientAdded: 'Ingredient added',
    ingredientUpdated: 'Ingredient updated',
    ingredientDeleted: 'Ingredient deleted',
    backendError: 'Cannot connect to the recipe server. Start the app with “npm run dev”, then open the shown address.',
    storageError: 'The recipe library is available read-only. To save changes, connect a Public Vercel Blob store to this project and redeploy.',
    all: 'All',
    phin: 'Phin',
    espresso: 'Espresso',
    signature: 'Signature',
    tea: 'Tea',
    other: 'Other',
  },
  km: {
    staffRecipes: 'រូបមន្តសម្រាប់បុគ្គលិក',
    recipes: 'រូបមន្ត',
    ingredients: 'គ្រឿងផ្សំ',
    preparations: 'ការត្រៀមជាមុន',
    newRecipe: 'បង្កើតរូបមន្ត',
    quickGuide: 'មគ្គុទ្ទេសក៍រហ័សសម្រាប់បុគ្គលិក',
    whatMaking: 'តើអ្នកកំពុងធ្វើភេសជ្ជៈអ្វី?',
    findAndFollow: 'ស្វែងរកភេសជ្ជៈ ហើយអនុវត្តតាមរូបមន្តជាជំហានៗ។',
    searchDrink: 'ស្វែងរកភេសជ្ជៈ...',
    noDrink: 'រកមិនឃើញភេសជ្ជៈ',
    tryDifferent: 'សូមសាកល្បងឈ្មោះ ឬប្រភេទផ្សេង។',
    minutes: 'នាទី',
    minuteShort: 'នាទី',
    price: 'តម្លៃ',
    toMake: 'សម្រាប់ធ្វើ',
    prepareIngredients: 'ត្រៀមគ្រឿងផ្សំទាំងនេះ',
    prepareFirst: 'ត្រៀមសមាសភាគទាំងនេះជាមុន',
    componentRecipe: 'រូបមន្តត្រៀមជាមុន',
    preparationAmount: 'បរិមាណប្រើ',
    yield: 'បរិមាណដែលទទួលបាន',
    storage: 'ការរក្សាទុក',
    preparationGuide: 'មគ្គុទ្ទេសក៍សមាសភាគប្រើឡើងវិញ',
    preparationHelp: 'ធ្វើក្រែម ទឹកស៊ីរ៉ូ និងបេសឱ្យដូចគ្នាមុនពេលផ្សំភេសជ្ជៈ។',
    usedByDrinks: 'ប្រើដោយភេសជ្ជៈក្នុងម៉ឺនុយ',
    noPreparations: 'មិនទាន់មានការត្រៀមជាមុន',
    addPreparation: 'បន្ថែមការត្រៀម',
    newPreparation: 'បង្កើតការត្រៀមថ្មី',
    editPreparation: 'កែការត្រៀម',
    preparationNameEn: 'ឈ្មោះការត្រៀម (អង់គ្លេស)',
    preparationNameKm: 'ឈ្មោះការត្រៀម (ខ្មែរ)',
    preparationType: 'ប្រភេទការត្រៀម',
    yieldAmount: 'បរិមាណដែលទទួលបាន',
    yieldUnit: 'ឯកតាដែលទទួលបាន',
    storageEn: 'ការណែនាំរក្សាទុក (អង់គ្លេស)',
    storageKm: 'ការណែនាំរក្សាទុក (ខ្មែរ)',
    preparationSaved: 'បានរក្សាទុកការត្រៀមក្នុង data.json',
    preparationDeleted: 'បានលុបការត្រៀម',
    cannotDeleteUsedPreparation: 'ការត្រៀមនេះកំពុងប្រើក្នុងភេសជ្ជៈ ដូច្នេះមិនអាចលុបបានទេ។',
    makeDrink: 'របៀបធ្វើភេសជ្ជៈ',
    important: 'ចំណាំសំខាន់',
    delete: 'លុប',
    editRecipe: 'កែរូបមន្ត',
    closeRecipe: 'បិទរូបមន្ត',
    updateInstructions: 'កែប្រែការណែនាំ',
    addStaffGuide: 'បន្ថែមទៅមគ្គុទ្ទេសក៍បុគ្គលិក',
    drinkNameEn: 'ឈ្មោះភេសជ្ជៈ (អង់គ្លេស)',
    drinkNameKm: 'ឈ្មោះភេសជ្ជៈ (ខ្មែរ)',
    category: 'ប្រភេទ',
    timeMinutes: 'ពេលវេលា (នាទី)',
    priceUsd: 'តម្លៃ (ដុល្លារ)',
    descriptionEn: 'ការពិពណ៌នា (អង់គ្លេស)',
    descriptionKm: 'ការពិពណ៌នា (ខ្មែរ)',
    chooseWarehouse: 'ជ្រើសរើសពីឃ្លាំងគ្រឿងផ្សំ ហើយកំណត់បរិមាណ។',
    ingredient: 'គ្រឿងផ្សំ',
    chooseIngredient: 'ជ្រើសរើសគ្រឿងផ្សំ...',
    amount: 'បរិមាណ',
    unit: 'ឯកតា',
    addIngredient: 'បន្ថែមគ្រឿងផ្សំ',
    addPreparationToDrink: 'បន្ថែមសមាសភាគ',
    choosePreparation: 'ជ្រើសរើសការត្រៀម...',
    steps: 'ជំហាន',
    clearAction: 'សរសេរការណែនាំនីមួយៗជាភាសាអង់គ្លេស និងខ្មែរ។',
    stepEn: 'ជំហានជាភាសាអង់គ្លេស',
    stepKm: 'ជំហានជាភាសាខ្មែរ',
    addStep: 'បន្ថែមជំហាន',
    noteEn: 'ចំណាំសំខាន់ (អង់គ្លេស)',
    noteKm: 'ចំណាំសំខាន់ (ខ្មែរ)',
    optional: 'មិនចាំបាច់',
    cancel: 'បោះបង់',
    saving: 'កំពុងរក្សាទុក...',
    saveRecipe: 'រក្សាទុករូបមន្ត',
    ingredientWarehouse: 'ឃ្លាំងគ្រឿងផ្សំ',
    warehouseHelp: 'បន្ថែមគ្រឿងផ្សំម្តង រួចជ្រើសរើសវាពេលបង្កើតរូបមន្ត។',
    editIngredient: 'កែគ្រឿងផ្សំ',
    ingredientNameEn: 'ឈ្មោះ (អង់គ្លេស)',
    ingredientNameKm: 'ឈ្មោះ (ខ្មែរ)',
    group: 'ក្រុម',
    defaultUnit: 'ឯកតាលំនាំដើម',
    saveChanges: 'រក្សាទុកការកែប្រែ',
    cancelEditing: 'បោះបង់ការកែ',
    availableRecipes: 'អាចប្រើក្នុងរូបមន្ត',
    findIngredient: 'ស្វែងរកគ្រឿងផ្សំ...',
    usedIn: 'ប្រើក្នុង',
    recipe: 'រូបមន្ត',
    recipePlural: 'រូបមន្ត',
    defaultLabel: 'លំនាំដើម',
    loading: 'កំពុងផ្ទុករូបមន្ត…',
    savedJson: 'បានរក្សាទុករូបមន្តក្នុង data.json',
    recipeDeleted: 'បានលុបរូបមន្ត',
    ingredientAdded: 'បានបន្ថែមគ្រឿងផ្សំ',
    ingredientUpdated: 'បានកែគ្រឿងផ្សំ',
    ingredientDeleted: 'បានលុបគ្រឿងផ្សំ',
    backendError: 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេរូបមន្តបានទេ។ សូមដំណើរការ “npm run dev” ហើយបើកអាសយដ្ឋានដែលបានបង្ហាញ។',
    storageError: 'អាចមើលរូបមន្តបាន ប៉ុន្តែមិនទាន់អាចរក្សាទុកការកែប្រែបានទេ។ សូមភ្ជាប់ Public Vercel Blob Store ទៅ Project នេះ ហើយ Deploy ម្តងទៀត។',
    all: 'ទាំងអស់',
    phin: 'កាហ្វេហ្វីន',
    espresso: 'អេស្ព្រេសសូ',
    signature: 'ពិសេស',
    tea: 'តែ',
    other: 'ផ្សេងៗ',
  },
}

const icons = {
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" /></>,
  box: <><path d="m4 7 8-4 8 4-8 4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  trash: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="m6 7 1 14h10l1-14M9 7V4h6v3" /></>,
  arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>,
  phin: <><path d="M7 5h10M8 5l1 5h6l1-5M9 10v3c0 2 1.3 3 3 3s3-1 3-3v-3M6 19h12M12 16v3" /><path d="M12 2v3" /></>,
  espresso: <><path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" /><path d="M16 11h2a2 2 0 0 1 0 4h-2M8 5c0 1 1 1 1 2M12 5c0 1 1 1 1 2" /></>,
  signature: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z" /><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" /></>,
  tea: <><path d="M6 19c7 0 11-4 12-13-9 1-13 5-12 13Z" /><path d="M6 19c3-5 6-8 10-10" /></>,
  other: <><circle cx="8" cy="14" r="4" /><circle cx="16" cy="9" r="3" /><circle cx="17" cy="17" r="2" /></>,
  prep: <><path d="M7 4h10l-1 15H8Z" /><path d="M9 8h6M9.5 12h5M10 16h4" /><path d="M10 2h4" /></>,
}

function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function categoryKey(category) {
  return category.toLowerCase()
}

function localText(item, field, language) {
  return language === 'km' && item?.[`${field}Km`] ? item[`${field}Km`] : item?.[field] || ''
}

function translateCategory(category, t) {
  return t[categoryKey(category)]
}

async function api(path, options) {
  let response
  try {
    response = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
  } catch {
    throw new Error('BACKEND_UNAVAILABLE')
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('BACKEND_UNAVAILABLE')
  }

  const body = await response.json()
  if (!response.ok) throw new Error(body.error || 'Something went wrong')
  return body
}

function errorMessage(error, translations) {
  if (error.message === 'BACKEND_UNAVAILABLE') return translations.backendError
  if (error.message.includes('Vercel Blob is not connected')) return translations.storageError
  return error.message
}

function CategoryArtwork({ category }) {
  const iconName = categoryKey(category)
  return <span className={`drink-icon ${iconName}`}><Icon name={iconName} size={34} /></span>
}

function RecipeCard({ recipe, language, t, onOpen }) {
  return (
    <button className="recipe-card" onClick={() => onOpen(recipe)}>
      <CategoryArtwork category={recipe.category} />
      <span className="recipe-card-copy">
        <span className="card-title-row">
          <strong>{localText(recipe, 'name', language)}</strong>
          <b>${Number(recipe.price || 0).toFixed(2)}</b>
        </span>
        <small>{localText(recipe, 'description', language)}</small>
        <span><Icon name="clock" size={15} /> {recipe.prepTime} {t.minutes} · {translateCategory(recipe.category, t)}</span>
      </span>
      <span className="open-arrow"><Icon name="arrow" size={20} /></span>
    </button>
  )
}

function PreparationIngredients({ preparation, ingredientById, language }) {
  return (
    <div className="view-ingredients compact">
      {preparation.ingredients.map((line) => (
        <div key={`${line.ingredientId}-${line.unit}`}>
          <span>{localText(ingredientById[line.ingredientId], 'name', language) || '—'}</span>
          <strong>{line.amount} {line.unit}</strong>
        </div>
      ))}
    </div>
  )
}

function PreparationSteps({ preparation, language }) {
  const steps = language === 'km' && preparation.stepsKm?.some(Boolean)
    ? preparation.stepsKm
    : preparation.steps
  return (
    <ol className="steps-list compact">
      {steps.map((step, index) => (
        <li key={`${step}-${index}`}><span>{index + 1}</span><p>{step}</p></li>
      ))}
    </ol>
  )
}

function PreparationCard({ preparation, language, t, usedCount, onOpen, onEdit, onDelete }) {
  return (
    <article className="preparation-card">
      <button className="preparation-open" onClick={() => onOpen(preparation)}>
        <span className="prep-icon"><Icon name="prep" size={26} /></span>
        <span>
          <strong>{localText(preparation, 'name', language)}</strong>
          <small>{localText(preparation, 'description', language)}</small>
          <em>{t.yield}: {preparation.yieldAmount} {preparation.yieldUnit} · {usedCount} {t.recipePlural}</em>
        </span>
        <Icon name="arrow" size={19} />
      </button>
      <div className="preparation-actions">
        <button onClick={() => onEdit(preparation)} aria-label={`${t.editPreparation} ${preparation.name}`}><Icon name="edit" size={17} /></button>
        <button disabled={usedCount > 0} onClick={() => onDelete(preparation.id)} aria-label={`${t.delete} ${preparation.name}`} title={usedCount > 0 ? t.cannotDeleteUsedPreparation : t.delete}><Icon name="trash" size={17} /></button>
      </div>
    </article>
  )
}

function PreparationView({ preparation, ingredients, language, t, usedCount, onClose, onEdit, onDelete }) {
  const ingredientById = useMemo(
    () => Object.fromEntries(ingredients.map((item) => [item.id, item])),
    [ingredients],
  )
  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="recipe-view" role="dialog" aria-modal="true" aria-label={localText(preparation, 'name', language)}>
        <header className="recipe-view-header">
          <span className="drink-icon preparation"><Icon name="prep" size={32} /></span>
          <div className="recipe-view-title">
            <span className="category-label">{t.componentRecipe}</span>
            <h2>{localText(preparation, 'name', language)}</h2>
            <p>{localText(preparation, 'description', language)}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t.cancel}><Icon name="close" /></button>
        </header>
        <div className="recipe-summary">
          <span><strong>{preparation.yieldAmount} {preparation.yieldUnit}</strong> {t.yield}</span>
          <span><strong>{preparation.prepTime} {t.minuteShort}</strong> {t.toMake}</span>
          <span><strong>{usedCount}</strong> {t.usedByDrinks}</span>
        </div>
        <section className="view-section">
          <h3>{t.prepareIngredients}</h3>
          <PreparationIngredients preparation={preparation} ingredientById={ingredientById} language={language} />
        </section>
        <section className="view-section">
          <h3>{t.steps}</h3>
          <PreparationSteps preparation={preparation} language={language} />
        </section>
        {localText(preparation, 'storage', language) && (
          <div className="staff-note storage-note">
            <Icon name="alert" size={20} />
            <div><strong>{t.storage}</strong><p>{localText(preparation, 'storage', language)}</p></div>
          </div>
        )}
        <footer className="recipe-actions">
          <button className="danger-button" disabled={usedCount > 0} onClick={() => onDelete(preparation.id)} title={usedCount > 0 ? t.cannotDeleteUsedPreparation : t.delete}><Icon name="trash" size={17} /> {t.delete}</button>
          <button className="secondary-button" onClick={() => onEdit(preparation)}><Icon name="edit" size={17} /> {t.editPreparation}</button>
        </footer>
      </article>
    </div>
  )
}

function RecipeView({ recipe, ingredients, preparations, language, t, onClose, onEdit, onDelete }) {
  const ingredientById = useMemo(
    () => Object.fromEntries(ingredients.map((item) => [item.id, item])),
    [ingredients],
  )
  const preparationById = useMemo(
    () => Object.fromEntries(preparations.map((item) => [item.id, item])),
    [preparations],
  )
  const steps = language === 'km' && recipe.stepsKm?.some(Boolean) ? recipe.stepsKm : recipe.steps

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="recipe-view" role="dialog" aria-modal="true" aria-label={localText(recipe, 'name', language)}>
        <header className="recipe-view-header">
          <CategoryArtwork category={recipe.category} />
          <div className="recipe-view-title">
            <span className="category-label">{translateCategory(recipe.category, t)}</span>
            <h2>{localText(recipe, 'name', language)}</h2>
            <p>{localText(recipe, 'description', language)}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t.closeRecipe}><Icon name="close" /></button>
        </header>

        <div className="recipe-summary">
          <span><Icon name="clock" size={18} /><strong>{recipe.prepTime} {t.minuteShort}</strong> {t.toMake}</span>
          <span className="recipe-price"><strong>${Number(recipe.price || 0).toFixed(2)}</strong> {t.price}</span>
          <span><strong>{recipe.ingredients.length}</strong> {t.ingredients.toLowerCase()}</span>
          <span><strong>{steps.length}</strong> {t.steps.toLowerCase()}</span>
        </div>

        {!!recipe.preparations?.length && (
          <section className="view-section dependency-section">
            <h3>{t.prepareFirst}</h3>
            <div className="dependency-list">
              {recipe.preparations.map((line) => {
                const preparation = preparationById[line.preparationId]
                if (!preparation) return null
                return (
                  <details className="dependency-card" key={line.preparationId} open>
                    <summary>
                      <span className="prep-icon"><Icon name="prep" size={20} /></span>
                      <span><strong>{localText(preparation, 'name', language)}</strong><small>{t.preparationAmount}: {line.amount} {line.unit}</small></span>
                      <span className="yield-badge">{t.yield} {preparation.yieldAmount} {preparation.yieldUnit}</span>
                    </summary>
                    <div className="dependency-body">
                      <PreparationIngredients preparation={preparation} ingredientById={ingredientById} language={language} />
                      <PreparationSteps preparation={preparation} language={language} />
                      {localText(preparation, 'storage', language) && <p className="inline-storage"><strong>{t.storage}:</strong> {localText(preparation, 'storage', language)}</p>}
                    </div>
                  </details>
                )
              })}
            </div>
          </section>
        )}

        <section className="view-section">
          <h3>{t.prepareIngredients}</h3>
          <div className="view-ingredients">
            {recipe.ingredients.map((line) => (
              <div key={`${line.ingredientId}-${line.unit}`}>
                <span>{localText(ingredientById[line.ingredientId], 'name', language) || '—'}</span>
                <strong>{line.amount} {line.unit}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="view-section">
          <h3>{t.makeDrink}</h3>
          <ol className="steps-list">
            {steps.map((step, index) => (
              <li key={`${step}-${index}`}><span>{index + 1}</span><p>{step}</p></li>
            ))}
          </ol>
        </section>

        {localText(recipe, 'notes', language) && (
          <div className="staff-note">
            <Icon name="alert" size={20} />
            <div><strong>{t.important}</strong><p>{localText(recipe, 'notes', language)}</p></div>
          </div>
        )}

        <footer className="recipe-actions">
          <button className="danger-button" onClick={() => onDelete(recipe.id)}><Icon name="trash" size={17} /> {t.delete}</button>
          <button className="secondary-button" onClick={() => onEdit(recipe)}><Icon name="edit" size={17} /> {t.editRecipe}</button>
        </footer>
      </article>
    </div>
  )
}

function IngredientLine({ line, index, ingredients, language, t, onChange, onRemove }) {
  const selectIngredient = (ingredientId) => {
    const selected = ingredients.find((item) => item.id === ingredientId)
    onChange(index, { ...line, ingredientId, unit: selected?.defaultUnit || line.unit })
  }

  return (
    <div className="ingredient-picker-row">
      <label>
        <span>{t.ingredient}</span>
        <select value={line.ingredientId} onChange={(event) => selectIngredient(event.target.value)} required>
          <option value="">{t.chooseIngredient}</option>
          {ingredientCategories.map((category) => {
            const items = ingredients.filter((item) => item.category === category)
            if (!items.length) return null
            return (
              <optgroup label={category} key={category}>
                {items.map((item) => <option value={item.id} key={item.id}>{localText(item, 'name', language)}</option>)}
              </optgroup>
            )
          })}
        </select>
      </label>
      <label className="amount-field">
        <span>{t.amount}</span>
        <input type="number" min="0.01" step="0.01" value={line.amount} onChange={(event) => onChange(index, { ...line, amount: event.target.value })} required />
      </label>
      <label className="unit-field">
        <span>{t.unit}</span>
        <select value={line.unit} onChange={(event) => onChange(index, { ...line, unit: event.target.value })} required>
          {units.map((unit) => <option key={unit}>{unit}</option>)}
        </select>
      </label>
      <button type="button" className="remove-row" onClick={() => onRemove(index)} aria-label={`${t.delete} ${t.ingredient} ${index + 1}`}>
        <Icon name="trash" size={18} />
      </button>
    </div>
  )
}

function PreparationLine({ line, index, preparations, language, t, onChange, onRemove }) {
  return (
    <div className="ingredient-picker-row preparation-picker-row">
      <label>
        <span>{t.preparations}</span>
        <select value={line.preparationId} onChange={(event) => onChange(index, { ...line, preparationId: event.target.value })} required>
          <option value="">{t.choosePreparation}</option>
          {preparations.map((item) => <option value={item.id} key={item.id}>{localText(item, 'name', language)}</option>)}
        </select>
      </label>
      <label className="amount-field">
        <span>{t.amount}</span>
        <input type="number" min="0.01" step="0.01" value={line.amount} onChange={(event) => onChange(index, { ...line, amount: event.target.value })} required />
      </label>
      <label className="unit-field">
        <span>{t.unit}</span>
        <select value={line.unit} onChange={(event) => onChange(index, { ...line, unit: event.target.value })} required>
          {units.map((unit) => <option key={unit}>{unit}</option>)}
        </select>
      </label>
      <button type="button" className="remove-row" onClick={() => onRemove(index)} aria-label={`${t.delete} ${t.preparations} ${index + 1}`}>
        <Icon name="trash" size={18} />
      </button>
    </div>
  )
}

function RecipeForm({ recipe, ingredients, preparations, language, t, onClose, onSave }) {
  const [form, setForm] = useState(() => recipe ? {
    ...recipe,
    ingredients: recipe.ingredients.map((line) => ({ ...line })),
    preparations: (recipe.preparations || []).map((line) => ({ ...line })),
    steps: [...recipe.steps],
    stepsKm: recipe.stepsKm?.length ? [...recipe.stepsKm] : recipe.steps.map(() => ''),
  } : {
    name: '', nameKm: '', category: 'Phin', description: '', descriptionKm: '',
    prepTime: 5, price: '', ingredients: [{ ingredientId: '', amount: '', unit: 'g' }],
    preparations: [],
    steps: [''], stepsKm: [''], notes: '', notesKm: '',
  })
  const [saving, setSaving] = useState(false)

  const updateLines = (field, index, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((line, lineIndex) => lineIndex === index ? value : line),
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...form,
        prepTime: Number(form.prepTime),
        price: Number(form.price),
        ingredients: form.ingredients.map((line) => ({ ...line, amount: Number(line.amount) })),
        preparations: form.preparations.map((line) => ({ ...line, amount: Number(line.amount) })),
        steps: form.steps.filter((step) => step.trim()),
        stepsKm: form.steps.map((_, index) => form.stepsKm[index]?.trim() || ''),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="form-modal" role="dialog" aria-modal="true" aria-label={recipe ? t.editRecipe : t.newRecipe}>
        <header className="modal-header">
          <div><span>{recipe ? t.updateInstructions : t.addStaffGuide}</span><h2>{recipe ? t.editRecipe : t.newRecipe}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={t.cancel}><Icon name="close" /></button>
        </header>
        <form onSubmit={submit}>
          <div className="form-body">
            <div className="two-columns">
              <label className="field"><span>{t.drinkNameEn}</span><input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label className="field"><span>{t.drinkNameKm}</span><input lang="km" value={form.nameKm} onChange={(event) => setForm({ ...form, nameKm: event.target.value })} /></label>
              <label className="field"><span>{t.category}</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((category) => <option key={category} value={category}>{translateCategory(category, t)}</option>)}</select></label>
              <label className="field"><span>{t.timeMinutes}</span><input type="number" min="1" required value={form.prepTime} onChange={(event) => setForm({ ...form, prepTime: event.target.value })} /></label>
              <label className="field"><span>{t.priceUsd}</span><input type="number" min="0.01" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
              <span />
              <label className="field"><span>{t.descriptionEn}</span><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <label className="field"><span>{t.descriptionKm}</span><input lang="km" value={form.descriptionKm} onChange={(event) => setForm({ ...form, descriptionKm: event.target.value })} /></label>
            </div>

            <div className="form-section">
              <div className="form-section-title"><h3>{t.preparations}</h3><p>{t.preparationHelp}</p></div>
              {!!form.preparations.length && (
                <div className="picker-list">
                  {form.preparations.map((line, index) => (
                    <PreparationLine
                      key={index}
                      line={line}
                      index={index}
                      preparations={preparations}
                      language={language}
                      t={t}
                      onChange={(lineIndex, value) => updateLines('preparations', lineIndex, value)}
                      onRemove={(lineIndex) => setForm((current) => ({ ...current, preparations: current.preparations.filter((_, itemIndex) => itemIndex !== lineIndex) }))}
                    />
                  ))}
                </div>
              )}
              <button type="button" className="add-row-button" onClick={() => setForm((current) => ({ ...current, preparations: [...current.preparations, { preparationId: '', amount: '', unit: 'g' }] }))}>
                <Icon name="plus" size={17} /> {t.addPreparationToDrink}
              </button>
            </div>

            <div className="form-section">
              <div className="form-section-title"><h3>{t.ingredients}</h3><p>{t.chooseWarehouse}</p></div>
              <div className="picker-list">
                {form.ingredients.map((line, index) => (
                  <IngredientLine
                    key={index}
                    line={line}
                    index={index}
                    ingredients={ingredients}
                    language={language}
                    t={t}
                    onChange={(lineIndex, value) => updateLines('ingredients', lineIndex, value)}
                    onRemove={(lineIndex) => setForm((current) => ({ ...current, ingredients: current.ingredients.filter((_, itemIndex) => itemIndex !== lineIndex) }))}
                  />
                ))}
              </div>
              <button type="button" className="add-row-button" onClick={() => setForm((current) => ({ ...current, ingredients: [...current.ingredients, { ingredientId: '', amount: '', unit: 'g' }] }))}>
                <Icon name="plus" size={17} /> {t.addIngredient}
              </button>
            </div>

            <div className="form-section">
              <div className="form-section-title"><h3>{t.steps}</h3><p>{t.clearAction}</p></div>
              <div className="step-editor">
                {form.steps.map((step, index) => (
                  <div className="bilingual-step" key={index}>
                    <span>{index + 1}</span>
                    <div>
                      <input required value={step} onChange={(event) => updateLines('steps', index, event.target.value)} placeholder={t.stepEn} />
                      <input lang="km" value={form.stepsKm[index] || ''} onChange={(event) => updateLines('stepsKm', index, event.target.value)} placeholder={t.stepKm} />
                    </div>
                    <button type="button" onClick={() => setForm((current) => ({
                      ...current,
                      steps: current.steps.filter((_, itemIndex) => itemIndex !== index),
                      stepsKm: current.stepsKm.filter((_, itemIndex) => itemIndex !== index),
                    }))} aria-label={`${t.delete} ${index + 1}`}><Icon name="trash" size={17} /></button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-row-button" onClick={() => setForm((current) => ({ ...current, steps: [...current.steps, ''], stepsKm: [...current.stepsKm, ''] }))}>
                <Icon name="plus" size={17} /> {t.addStep}
              </button>
            </div>

            <div className="two-columns">
              <label className="field"><span>{t.noteEn} <small>{t.optional}</small></span><textarea rows="3" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
              <label className="field"><span>{t.noteKm} <small>{t.optional}</small></span><textarea lang="km" rows="3" value={form.notesKm} onChange={(event) => setForm({ ...form, notesKm: event.target.value })} /></label>
            </div>
          </div>
          <footer className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>{t.cancel}</button>
            <button className="primary-button" disabled={saving}>{saving ? t.saving : t.saveRecipe}</button>
          </footer>
        </form>
      </div>
    </div>
  )
}

function PreparationForm({ preparation, ingredients, language, t, onClose, onSave }) {
  const [form, setForm] = useState(() => preparation ? {
    ...preparation,
    ingredients: preparation.ingredients.map((line) => ({ ...line })),
    steps: [...preparation.steps],
    stepsKm: preparation.stepsKm?.length ? [...preparation.stepsKm] : preparation.steps.map(() => ''),
  } : {
    name: '',
    nameKm: '',
    description: '',
    descriptionKm: '',
    type: 'Topping',
    prepTime: 5,
    yieldAmount: '',
    yieldUnit: 'g',
    ingredients: [{ ingredientId: '', amount: '', unit: 'g' }],
    steps: [''],
    stepsKm: [''],
    storage: '',
    storageKm: '',
    sources: [],
  })
  const [saving, setSaving] = useState(false)

  const updateLines = (field, index, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((line, lineIndex) => lineIndex === index ? value : line),
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...form,
        prepTime: Number(form.prepTime),
        yieldAmount: Number(form.yieldAmount),
        ingredients: form.ingredients.map((line) => ({ ...line, amount: Number(line.amount) })),
        steps: form.steps.filter((step) => step.trim()),
        stepsKm: form.steps.map((_, index) => form.stepsKm[index]?.trim() || ''),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="form-modal" role="dialog" aria-modal="true" aria-label={preparation ? t.editPreparation : t.newPreparation}>
        <header className="modal-header">
          <div><span>{t.preparationGuide}</span><h2>{preparation ? t.editPreparation : t.newPreparation}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={t.cancel}><Icon name="close" /></button>
        </header>
        <form onSubmit={submit}>
          <div className="form-body">
            <div className="two-columns">
              <label className="field"><span>{t.preparationNameEn}</span><input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label className="field"><span>{t.preparationNameKm}</span><input lang="km" value={form.nameKm} onChange={(event) => setForm({ ...form, nameKm: event.target.value })} /></label>
              <label className="field"><span>{t.preparationType}</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Topping</option><option>Base</option><option>Batch</option><option>Syrup</option><option>Other</option></select></label>
              <label className="field"><span>{t.timeMinutes}</span><input type="number" min="1" required value={form.prepTime} onChange={(event) => setForm({ ...form, prepTime: event.target.value })} /></label>
              <label className="field"><span>{t.yieldAmount}</span><input type="number" min="0.01" step="0.01" required value={form.yieldAmount} onChange={(event) => setForm({ ...form, yieldAmount: event.target.value })} /></label>
              <label className="field"><span>{t.yieldUnit}</span><select value={form.yieldUnit} onChange={(event) => setForm({ ...form, yieldUnit: event.target.value })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
              <label className="field"><span>{t.descriptionEn}</span><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <label className="field"><span>{t.descriptionKm}</span><input lang="km" value={form.descriptionKm} onChange={(event) => setForm({ ...form, descriptionKm: event.target.value })} /></label>
            </div>

            <div className="form-section">
              <div className="form-section-title"><h3>{t.ingredients}</h3><p>{t.chooseWarehouse}</p></div>
              <div className="picker-list">
                {form.ingredients.map((line, index) => (
                  <IngredientLine
                    key={index}
                    line={line}
                    index={index}
                    ingredients={ingredients}
                    language={language}
                    t={t}
                    onChange={(lineIndex, value) => updateLines('ingredients', lineIndex, value)}
                    onRemove={(lineIndex) => setForm((current) => ({ ...current, ingredients: current.ingredients.filter((_, itemIndex) => itemIndex !== lineIndex) }))}
                  />
                ))}
              </div>
              <button type="button" className="add-row-button" onClick={() => setForm((current) => ({ ...current, ingredients: [...current.ingredients, { ingredientId: '', amount: '', unit: 'g' }] }))}>
                <Icon name="plus" size={17} /> {t.addIngredient}
              </button>
            </div>

            <div className="form-section">
              <div className="form-section-title"><h3>{t.steps}</h3><p>{t.clearAction}</p></div>
              <div className="step-editor">
                {form.steps.map((step, index) => (
                  <div className="bilingual-step" key={index}>
                    <span>{index + 1}</span>
                    <div>
                      <input required value={step} onChange={(event) => updateLines('steps', index, event.target.value)} placeholder={t.stepEn} />
                      <input lang="km" value={form.stepsKm[index] || ''} onChange={(event) => updateLines('stepsKm', index, event.target.value)} placeholder={t.stepKm} />
                    </div>
                    <button type="button" onClick={() => setForm((current) => ({
                      ...current,
                      steps: current.steps.filter((_, itemIndex) => itemIndex !== index),
                      stepsKm: current.stepsKm.filter((_, itemIndex) => itemIndex !== index),
                    }))} aria-label={`${t.delete} ${index + 1}`}><Icon name="trash" size={17} /></button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-row-button" onClick={() => setForm((current) => ({ ...current, steps: [...current.steps, ''], stepsKm: [...current.stepsKm, ''] }))}>
                <Icon name="plus" size={17} /> {t.addStep}
              </button>
            </div>

            <div className="two-columns">
              <label className="field"><span>{t.storageEn}</span><textarea rows="4" value={form.storage} onChange={(event) => setForm({ ...form, storage: event.target.value })} /></label>
              <label className="field"><span>{t.storageKm}</span><textarea lang="km" rows="4" value={form.storageKm} onChange={(event) => setForm({ ...form, storageKm: event.target.value })} /></label>
            </div>
          </div>
          <footer className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>{t.cancel}</button>
            <button className="primary-button" disabled={saving}>{saving ? t.saving : t.saveChanges}</button>
          </footer>
        </form>
      </div>
    </div>
  )
}

function Warehouse({ ingredients, recipes, preparations, language, t, onAdd, onUpdate, onDelete }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', nameKm: '', category: 'Coffee', defaultUnit: 'g' })
  const filtered = ingredients.filter((item) => `${item.name} ${item.nameKm || ''}`.toLowerCase().includes(query.toLowerCase()))
  const reset = () => { setEditing(null); setForm({ name: '', nameKm: '', category: 'Coffee', defaultUnit: 'g' }) }

  const submit = async (event) => {
    event.preventDefault()
    if (editing) await onUpdate(editing.id, form)
    else await onAdd(form)
    reset()
  }

  return (
    <section className="warehouse-page">
      <div className="page-heading"><div><span>{t.ingredientWarehouse}</span><h1>{t.ingredients}</h1><p>{t.warehouseHelp}</p></div></div>
      <div className="warehouse-layout">
        <form className="ingredient-form" onSubmit={submit}>
          <h2>{editing ? t.editIngredient : t.addIngredient}</h2>
          <label className="field"><span>{t.ingredientNameEn}</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label className="field"><span>{t.ingredientNameKm}</span><input lang="km" value={form.nameKm} onChange={(event) => setForm({ ...form, nameKm: event.target.value })} /></label>
          <label className="field"><span>{t.group}</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{ingredientCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field"><span>{t.defaultUnit}</span><select value={form.defaultUnit} onChange={(event) => setForm({ ...form, defaultUnit: event.target.value })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
          <button className="primary-button">{editing ? t.saveChanges : t.addIngredient}</button>
          {editing && <button type="button" className="text-button" onClick={reset}>{t.cancelEditing}</button>}
        </form>

        <div className="warehouse-list-card">
          <div className="warehouse-toolbar">
            <div><strong>{ingredients.length} {t.ingredients.toLowerCase()}</strong><span>{t.availableRecipes}</span></div>
            <label className="small-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.findIngredient} aria-label={t.findIngredient} /></label>
          </div>
          <div className="warehouse-list">
            {filtered.map((ingredient) => {
              const usedCount = recipes.filter((recipe) => recipe.ingredients.some((line) => line.ingredientId === ingredient.id)).length
                + preparations.filter((preparation) => preparation.ingredients.some((line) => line.ingredientId === ingredient.id)).length
              return (
                <div className="warehouse-row" key={ingredient.id}>
                  <span className="ingredient-symbol"><Icon name={ingredient.category === 'Tea' ? 'tea' : ingredient.category === 'Coffee' ? 'espresso' : 'box'} size={20} /></span>
                  <div><strong>{localText(ingredient, 'name', language)}</strong><span>{ingredient.category} · {t.defaultLabel} {ingredient.defaultUnit} · {t.usedIn} {usedCount} {usedCount === 1 ? t.recipe : t.recipePlural}</span></div>
                  <div className="row-actions">
                    <button onClick={() => { setEditing(ingredient); setForm({ name: ingredient.name, nameKm: ingredient.nameKm || '', category: ingredient.category, defaultUnit: ingredient.defaultUnit }) }} aria-label={`${t.editIngredient} ${ingredient.name}`}><Icon name="edit" size={17} /></button>
                    <button disabled={usedCount > 0} onClick={() => onDelete(ingredient.id)} aria-label={`${t.delete} ${ingredient.name}`}><Icon name="trash" size={17} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PreparationsPage({ preparations, recipes, language, t, onOpen, onCreate, onEdit, onDelete }) {
  return (
    <section className="warehouse-page">
      <div className="page-heading preparation-heading">
        <div><span>{t.preparationGuide}</span><h1>{t.preparations}</h1><p>{t.preparationHelp}</p></div>
        <button className="primary-button" onClick={onCreate}><Icon name="plus" size={18} /> {t.newPreparation}</button>
      </div>
      {preparations.length ? (
        <div className="preparation-grid">
          {preparations.map((preparation) => {
            const usedCount = recipes.filter((recipe) =>
              recipe.preparations?.some((line) => line.preparationId === preparation.id),
            ).length
            return <PreparationCard key={preparation.id} preparation={preparation} language={language} t={t} usedCount={usedCount} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
          })}
        </div>
      ) : (
        <div className="empty"><Icon name="prep" size={30} /><h2>{t.noPreparations}</h2></div>
      )}
    </section>
  )
}

function App() {
  const [data, setData] = useState({ recipes: [], ingredients: [], preparations: [] })
  const [language, setLanguage] = useState('km')
  const [page, setPage] = useState('recipes')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [selectedPreparation, setSelectedPreparation] = useState(null)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [editingPreparation, setEditingPreparation] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [preparationFormOpen, setPreparationFormOpen] = useState(false)
  const [toast, setToast] = useState('')
  const t = messages[language]

  const showError = (error) => setError(errorMessage(error, t))
  const refresh = async () => { const nextData = await api('/api/data'); setData(nextData); return nextData }

  useEffect(() => {
    api('/api/data')
      .then((nextData) => setData(nextData))
      .catch((error) => setError(errorMessage(error, messages.km)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'km' ? 'km' : 'en'
  }, [language])

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2200) }
  const filteredRecipes = useMemo(() => data.recipes.filter((recipe) => {
    const matchesCategory = category === 'All' || recipe.category === category
    const text = `${recipe.name} ${recipe.nameKm || ''} ${recipe.description} ${recipe.descriptionKm || ''}`.toLowerCase()
    return matchesCategory && text.includes(query.toLowerCase())
  }), [data.recipes, category, query])

  const saveRecipe = async (recipe) => {
    try {
      const saved = await api(editingRecipe ? `/api/recipes/${editingRecipe.id}` : '/api/recipes', { method: editingRecipe ? 'PUT' : 'POST', body: JSON.stringify(recipe) })
      await refresh()
      setFormOpen(false); setEditingRecipe(null); setSelectedRecipe(saved); notify(t.savedJson)
    } catch (error) { showError(error); throw error }
  }

  const deleteRecipe = async (id) => {
    try { await api(`/api/recipes/${id}`, { method: 'DELETE' }); await refresh(); setSelectedRecipe(null); notify(t.recipeDeleted) }
    catch (error) { showError(error) }
  }

  const ingredientAction = async (path, options, message) => {
    try { await api(path, options); await refresh(); notify(message) }
    catch (error) { showError(error); throw error }
  }

  const savePreparation = async (preparation) => {
    try {
      const saved = await api(
        editingPreparation ? `/api/preparations/${editingPreparation.id}` : '/api/preparations',
        { method: editingPreparation ? 'PUT' : 'POST', body: JSON.stringify(preparation) },
      )
      await refresh()
      setPreparationFormOpen(false)
      setEditingPreparation(null)
      setSelectedPreparation(saved)
      notify(t.preparationSaved)
    } catch (error) {
      showError(error)
      throw error
    }
  }

  const deletePreparation = async (id) => {
    try {
      await api(`/api/preparations/${id}`, { method: 'DELETE' })
      await refresh()
      setSelectedPreparation(null)
      notify(t.preparationDeleted)
    } catch (error) {
      setError(error.message.includes('used in a drink') ? t.cannotDeleteUsedPreparation : error.message)
    }
  }

  if (loading) return <div className="state-screen"><span className="loader" /><p>{t.loading}</p></div>

  return (
    <div className={`app lang-${language}`}>
      <header className="topbar">
        <button className="brand" onClick={() => setPage('recipes')}><span>PHIN</span><i>&</i><span>POUR</span><small>{t.staffRecipes}</small></button>
        <nav>
          <button className={page === 'recipes' ? 'active' : ''} onClick={() => setPage('recipes')}><Icon name="book" size={18} /> {t.recipes}</button>
          <button className={page === 'preparations' ? 'active' : ''} onClick={() => setPage('preparations')}><Icon name="prep" size={18} /> {t.preparations}</button>
          <button className={page === 'warehouse' ? 'active' : ''} onClick={() => setPage('warehouse')}><Icon name="box" size={18} /> {t.ingredients}</button>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            <button className={language === 'km' ? 'active' : ''} onClick={() => setLanguage('km')}>KH</button>
          </div>
          <button className="primary-button top-add" onClick={() => { setEditingRecipe(null); setFormOpen(true) }}><Icon name="plus" size={18} /> {t.newRecipe}</button>
        </div>
      </header>

      <main>
        {page === 'recipes' ? (
          <section className="recipes-page">
            <div className="page-heading">
              <div><span>{t.quickGuide}</span><h1>{t.whatMaking}</h1><p>{t.findAndFollow}</p></div>
              <label className="main-search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchDrink} aria-label={t.searchDrink} /></label>
            </div>
            <div className="category-filter">
              {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{translateCategory(item, t)}</button>)}
            </div>
            {filteredRecipes.length ? (
              <div className="recipe-list">{filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} language={language} t={t} onOpen={setSelectedRecipe} />)}</div>
            ) : (
              <div className="empty"><Icon name="search" size={30} /><h2>{t.noDrink}</h2><p>{t.tryDifferent}</p></div>
            )}
          </section>
        ) : page === 'preparations' ? (
          <PreparationsPage
            preparations={data.preparations || []}
            recipes={data.recipes}
            language={language}
            t={t}
            onOpen={setSelectedPreparation}
            onCreate={() => { setEditingPreparation(null); setPreparationFormOpen(true) }}
            onEdit={(preparation) => { setEditingPreparation(preparation); setPreparationFormOpen(true) }}
            onDelete={deletePreparation}
          />
        ) : (
          <Warehouse
            ingredients={data.ingredients} recipes={data.recipes} preparations={data.preparations || []} language={language} t={t}
            onAdd={(ingredient) => ingredientAction('/api/ingredients', { method: 'POST', body: JSON.stringify(ingredient) }, t.ingredientAdded)}
            onUpdate={(id, ingredient) => ingredientAction(`/api/ingredients/${id}`, { method: 'PUT', body: JSON.stringify(ingredient) }, t.ingredientUpdated)}
            onDelete={(id) => ingredientAction(`/api/ingredients/${id}`, { method: 'DELETE' }, t.ingredientDeleted)}
          />
        )}
      </main>

      {selectedRecipe && <RecipeView recipe={selectedRecipe} ingredients={data.ingredients} preparations={data.preparations || []} language={language} t={t} onClose={() => setSelectedRecipe(null)} onEdit={(recipe) => { setSelectedRecipe(null); setEditingRecipe(recipe); setFormOpen(true) }} onDelete={deleteRecipe} />}
      {selectedPreparation && (
        <PreparationView
          preparation={selectedPreparation}
          ingredients={data.ingredients}
          language={language}
          t={t}
          usedCount={data.recipes.filter((recipe) => recipe.preparations?.some((line) => line.preparationId === selectedPreparation.id)).length}
          onClose={() => setSelectedPreparation(null)}
          onEdit={(preparation) => { setSelectedPreparation(null); setEditingPreparation(preparation); setPreparationFormOpen(true) }}
          onDelete={deletePreparation}
        />
      )}
      {formOpen && <RecipeForm key={editingRecipe?.id || 'new'} recipe={editingRecipe} ingredients={data.ingredients} preparations={data.preparations || []} language={language} t={t} onClose={() => { setFormOpen(false); setEditingRecipe(null) }} onSave={saveRecipe} />}
      {preparationFormOpen && (
        <PreparationForm
          key={editingPreparation?.id || 'new-preparation'}
          preparation={editingPreparation}
          ingredients={data.ingredients}
          language={language}
          t={t}
          onClose={() => { setPreparationFormOpen(false); setEditingPreparation(null) }}
          onSave={savePreparation}
        />
      )}

      <button className="mobile-add" onClick={() => { setEditingRecipe(null); setFormOpen(true) }} aria-label={t.newRecipe}><Icon name="plus" size={23} /></button>
      {error && <div className="error-toast"><Icon name="alert" size={18} /><span>{error}</span><button onClick={() => setError('')} aria-label={t.cancel}><Icon name="close" size={16} /></button></div>}
      {toast && <div className="success-toast"><Icon name="check" size={17} />{toast}</div>}
    </div>
  )
}

export default App
