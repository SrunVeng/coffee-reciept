import { memo, useEffect, useMemo, useRef, useState } from 'react'
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
    confirmDeleteTitle: 'Delete this item?',
    confirmDeleteText: '“{name}” will be permanently deleted. This cannot be undone.',
    noKeep: 'No, keep it',
    yesDelete: 'Yes, delete',
    deleting: 'Deleting...',
    selectItems: 'Select items',
    selectedCount: '{count} selected',
    selectAll: 'Select all',
    clearSelection: 'Clear',
    deleteSelected: 'Delete selected',
    confirmDeleteManyTitle: 'Delete selected items?',
    confirmDeleteManyText: 'Permanently delete {count} selected items? This cannot be undone.',
    itemsDeleted: '{count} items deleted',
    usedItemsSkipped: 'Items currently used by recipes cannot be selected.',
    dataChanged: 'Recipe data changed on another device. Reload the page and try again.',
    loginTitle: 'Private staff access',
    loginHelp: 'Enter the shop password to open the recipe library.',
    password: 'Password',
    enterPassword: 'Enter password',
    unlock: 'Open app',
    signingIn: 'Checking...',
    incorrectPassword: 'Incorrect password. Try again.',
    authenticationRequired: 'Your session expired. Enter the password again.',
    authNotConfigured: 'Authentication is not configured on the server.',
    confirmPasswordHelp: 'Enter the password again to delete multiple items.',
    logout: 'Lock app',
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
    confirmDeleteTitle: 'តើអ្នកពិតជាចង់លុបមែនទេ?',
    confirmDeleteText: '“{name}” នឹងត្រូវលុបជាអចិន្ត្រៃយ៍ ហើយមិនអាចយកមកវិញបានទេ។',
    noKeep: 'ទេ រក្សាទុក',
    yesDelete: 'បាទ/ចាស លុប',
    deleting: 'កំពុងលុប...',
    selectItems: 'ជ្រើសរើសច្រើន',
    selectedCount: 'បានជ្រើស {count}',
    selectAll: 'ជ្រើសទាំងអស់',
    clearSelection: 'សម្អាត',
    deleteSelected: 'លុបដែលបានជ្រើស',
    confirmDeleteManyTitle: 'លុបធាតុដែលបានជ្រើសមែនទេ?',
    confirmDeleteManyText: 'ធាតុដែលបានជ្រើស {count} នឹងត្រូវលុបជាអចិន្ត្រៃយ៍ ហើយមិនអាចយកមកវិញបានទេ។',
    itemsDeleted: 'បានលុប {count} ធាតុ',
    usedItemsSkipped: 'ធាតុដែលកំពុងប្រើក្នុងរូបមន្ត មិនអាចជ្រើសដើម្បីលុបបានទេ។',
    dataChanged: 'ទិន្នន័យរូបមន្តត្រូវបានកែប្រែពីឧបករណ៍ផ្សេង។ សូមផ្ទុកទំព័រឡើងវិញ ហើយសាកល្បងម្តងទៀត។',
    loginTitle: 'ការចូលប្រើសម្រាប់បុគ្គលិក',
    loginHelp: 'បញ្ចូលពាក្យសម្ងាត់របស់ហាង ដើម្បីបើកបណ្ណាល័យរូបមន្ត។',
    password: 'ពាក្យសម្ងាត់',
    enterPassword: 'បញ្ចូលពាក្យសម្ងាត់',
    unlock: 'បើកកម្មវិធី',
    signingIn: 'កំពុងពិនិត្យ...',
    incorrectPassword: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ។ សូមសាកល្បងម្តងទៀត។',
    authenticationRequired: 'សម័យចូលបានផុតកំណត់។ សូមបញ្ចូលពាក្យសម្ងាត់ម្តងទៀត។',
    authNotConfigured: 'ម៉ាស៊ីនមេមិនទាន់បានកំណត់ការផ្ទៀងផ្ទាត់ទេ។',
    confirmPasswordHelp: 'បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត ដើម្បីលុបធាតុច្រើន។',
    logout: 'ចាក់សោកម្មវិធី',
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
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  chevron: <path d="m7 10 5 5 5-5" />,
}

function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function categoryKey(category) {
  return String(category || '').toLowerCase()
}

function localText(item, field, language) {
  return language === 'km' && item?.[`${field}Km`] ? item[`${field}Km`] : item?.[field] || ''
}

function translateCategory(category, t) {
  return t[categoryKey(category)] || category || t.other
}

function localizedSteps(item, language) {
  const steps = Array.isArray(item?.steps) ? item.steps : []
  if (language !== 'km') return steps
  return steps.map((step, index) => item.stepsKm?.[index]?.trim() || step)
}

function normalizeData(data) {
  return {
    recipes: Array.isArray(data?.recipes) ? data.recipes : [],
    ingredients: Array.isArray(data?.ingredients) ? data.ingredients : [],
    preparations: Array.isArray(data?.preparations) ? data.preparations : [],
  }
}

function groupIngredients(ingredients) {
  return ingredients.reduce((groups, ingredient) => {
    const category = ingredient.category || 'Other'
    if (!groups[category]) groups[category] = []
    groups[category].push(ingredient)
    return groups
  }, {})
}

async function api(path, options) {
  let response
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('BACKEND_UNAVAILABLE', { cause: error })
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('BACKEND_UNAVAILABLE')
  }

  let body
  try {
    body = await response.json()
  } catch {
    throw new Error('BACKEND_UNAVAILABLE')
  }
  if (!response.ok) {
    const error = new Error(body.error || 'Something went wrong')
    error.code = body.code
    throw error
  }
  return body
}

function errorMessage(error, translations) {
  if (error.message === 'BACKEND_UNAVAILABLE') return translations.backendError
  if (error.message.includes('Vercel Blob is not connected')) return translations.storageError
  if (error.code === 'DATA_CHANGED') return translations.dataChanged
  if (error.code === 'INVALID_PASSWORD') return translations.incorrectPassword
  if (error.code === 'UNAUTHORIZED') return translations.authenticationRequired
  if (error.code === 'AUTH_NOT_CONFIGURED') return translations.authNotConfigured
  return error.message
}

function CustomSelect({ value, onChange, options, placeholder = '—', ariaLabel, disabled = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((option) => option.value === value)
  const groups = options.reduce((result, option) => {
    const group = option.group || ''
    if (!result[group]) result[group] = []
    result[group].push(option)
    return result
  }, {})

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div className={`custom-select${open ? ' open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="custom-select-trigger"
        disabled={disabled}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? '' : 'placeholder'}>{selected?.label || placeholder}</span>
        <Icon name="chevron" size={17} />
      </button>
      {open && (
        <div className="custom-select-menu" role="listbox" aria-label={ariaLabel}>
          {Object.entries(groups).map(([group, items]) => (
            <div className="custom-select-group" key={group || 'options'}>
              {group && <span>{group}</span>}
              {items.map((option) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={option.value === value ? 'selected' : ''}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  {option.value === value && <Icon name="check" size={16} />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryArtwork({ category }) {
  const key = categoryKey(category)
  const iconName = icons[key] ? key : 'other'
  return <span className={`drink-icon ${iconName}`}><Icon name={iconName} size={34} /></span>
}

const RecipeCard = memo(function RecipeCard({ recipe, language, t, onOpen, selectionMode, selected, onToggle }) {
  return (
    <button
      className={`recipe-card${selected ? ' selected' : ''}`}
      onClick={() => selectionMode ? onToggle(recipe.id) : onOpen(recipe)}
      aria-pressed={selectionMode ? selected : undefined}
    >
      <CategoryArtwork category={recipe.category} />
      <span className="recipe-card-copy">
        <span className="card-title-row">
          <strong>{localText(recipe, 'name', language)}</strong>
          <b>${Number(recipe.price || 0).toFixed(2)}</b>
        </span>
        <small>{localText(recipe, 'description', language)}</small>
        <span><Icon name="clock" size={15} /> {recipe.prepTime} {t.minutes} · {translateCategory(recipe.category, t)}</span>
      </span>
      <span className={selectionMode ? 'selection-check' : 'open-arrow'}>
        <Icon name={selected ? 'check' : selectionMode ? 'plus' : 'arrow'} size={20} />
      </span>
    </button>
  )
})

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
  const steps = localizedSteps(preparation, language)
  return (
    <ol className="steps-list compact">
      {steps.map((step, index) => (
        <li key={`${step}-${index}`}><span>{index + 1}</span><p>{step}</p></li>
      ))}
    </ol>
  )
}

function PreparationCard({ preparation, language, t, usedCount, onOpen, onEdit, onDelete, selectionMode, selected, onToggle }) {
  const unavailable = selectionMode && usedCount > 0
  return (
    <article className={`preparation-card${selected ? ' selected' : ''}${unavailable ? ' unavailable' : ''}`}>
      <button
        className="preparation-open"
        disabled={unavailable}
        onClick={() => selectionMode ? onToggle(preparation.id) : onOpen(preparation)}
        aria-pressed={selectionMode ? selected : undefined}
        title={unavailable ? t.cannotDeleteUsedPreparation : undefined}
      >
        <span className="prep-icon"><Icon name="prep" size={26} /></span>
        <span>
          <strong>{localText(preparation, 'name', language)}</strong>
          <small>{localText(preparation, 'description', language)}</small>
          <em>{t.yield}: {preparation.yieldAmount} {preparation.yieldUnit} · {usedCount} {t.recipePlural}</em>
        </span>
        <span className={selectionMode ? 'selection-check' : ''}><Icon name={selected ? 'check' : selectionMode ? 'plus' : 'arrow'} size={19} /></span>
      </button>
      {!selectionMode && <div className="preparation-actions">
        <button onClick={() => onEdit(preparation)} aria-label={`${t.editPreparation} ${preparation.name}`}><Icon name="edit" size={17} /></button>
        <button disabled={usedCount > 0} onClick={() => onDelete(preparation.id)} aria-label={`${t.delete} ${preparation.name}`} title={usedCount > 0 ? t.cannotDeleteUsedPreparation : t.delete}><Icon name="trash" size={17} /></button>
      </div>}
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
  const steps = localizedSteps(recipe, language)

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

function IngredientLine({ line, index, ingredients, ingredientsByCategory, language, t, onChange, onRemove }) {
  const selectIngredient = (ingredientId) => {
    const selected = ingredients.find((item) => item.id === ingredientId)
    onChange(index, { ...line, ingredientId, unit: selected?.defaultUnit || line.unit })
  }

  return (
    <div className="ingredient-picker-row">
      <div className="select-field">
        <span>{t.ingredient}</span>
        <CustomSelect
          value={line.ingredientId}
          onChange={selectIngredient}
          placeholder={t.chooseIngredient}
          ariaLabel={`${t.ingredient} ${index + 1}`}
          options={ingredientCategories.flatMap((category) =>
            (ingredientsByCategory[category] || []).map((item) => ({
              value: item.id,
              label: localText(item, 'name', language),
              group: category,
            })),
          )}
        />
      </div>
      <label className="amount-field">
        <span>{t.amount}</span>
        <input type="number" min="0.01" step="0.01" value={line.amount} onChange={(event) => onChange(index, { ...line, amount: event.target.value })} required />
      </label>
      <div className="select-field unit-field">
        <span>{t.unit}</span>
        <CustomSelect
          value={line.unit}
          onChange={(unit) => onChange(index, { ...line, unit })}
          ariaLabel={`${t.unit} ${index + 1}`}
          options={units.map((unit) => ({ value: unit, label: unit }))}
        />
      </div>
      <button type="button" className="remove-row" onClick={() => onRemove(index)} aria-label={`${t.delete} ${t.ingredient} ${index + 1}`}>
        <Icon name="trash" size={18} />
      </button>
    </div>
  )
}

function PreparationLine({ line, index, preparations, language, t, onChange, onRemove }) {
  return (
    <div className="ingredient-picker-row preparation-picker-row">
      <div className="select-field">
        <span>{t.preparations}</span>
        <CustomSelect
          value={line.preparationId}
          onChange={(preparationId) => onChange(index, { ...line, preparationId })}
          placeholder={t.choosePreparation}
          ariaLabel={`${t.preparations} ${index + 1}`}
          options={preparations.map((item) => ({ value: item.id, label: localText(item, 'name', language) }))}
        />
      </div>
      <label className="amount-field">
        <span>{t.amount}</span>
        <input type="number" min="0.01" step="0.01" value={line.amount} onChange={(event) => onChange(index, { ...line, amount: event.target.value })} required />
      </label>
      <div className="select-field unit-field">
        <span>{t.unit}</span>
        <CustomSelect
          value={line.unit}
          onChange={(unit) => onChange(index, { ...line, unit })}
          ariaLabel={`${t.unit} ${index + 1}`}
          options={units.map((unit) => ({ value: unit, label: unit }))}
        />
      </div>
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
  const ingredientsByCategory = useMemo(
    () => groupIngredients(ingredients),
    [ingredients],
  )

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
              <div className="field">
                <span>{t.category}</span>
                <CustomSelect
                  value={form.category}
                  onChange={(category) => setForm({ ...form, category })}
                  ariaLabel={t.category}
                  options={categories.slice(1).map((category) => ({ value: category, label: translateCategory(category, t) }))}
                />
              </div>
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
                    ingredientsByCategory={ingredientsByCategory}
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
  const ingredientsByCategory = useMemo(
    () => groupIngredients(ingredients),
    [ingredients],
  )

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
              <div className="field">
                <span>{t.preparationType}</span>
                <CustomSelect
                  value={form.type}
                  onChange={(type) => setForm({ ...form, type })}
                  ariaLabel={t.preparationType}
                  options={['Topping', 'Base', 'Batch', 'Syrup', 'Other'].map((type) => ({ value: type, label: type }))}
                />
              </div>
              <label className="field"><span>{t.timeMinutes}</span><input type="number" min="1" required value={form.prepTime} onChange={(event) => setForm({ ...form, prepTime: event.target.value })} /></label>
              <label className="field"><span>{t.yieldAmount}</span><input type="number" min="0.01" step="0.01" required value={form.yieldAmount} onChange={(event) => setForm({ ...form, yieldAmount: event.target.value })} /></label>
              <div className="field">
                <span>{t.yieldUnit}</span>
                <CustomSelect
                  value={form.yieldUnit}
                  onChange={(yieldUnit) => setForm({ ...form, yieldUnit })}
                  ariaLabel={t.yieldUnit}
                  options={units.map((unit) => ({ value: unit, label: unit }))}
                />
              </div>
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
                    ingredientsByCategory={ingredientsByCategory}
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

function SelectionToolbar({ active, selectedCount, selectableIds, t, onStart, onToggleAll, onDelete, onCancel }) {
  if (!active) {
    return (
      <div className="selection-toolbar idle">
        <button className="secondary-button" onClick={onStart}><Icon name="check" size={17} /> {t.selectItems}</button>
      </div>
    )
  }

  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length
  return (
    <div className="selection-toolbar active" role="toolbar" aria-label={t.selectItems}>
      <strong>{t.selectedCount.replace('{count}', selectedCount)}</strong>
      <div>
        <button className="secondary-button" disabled={!selectableIds.length} onClick={onToggleAll}>
          {allSelected ? t.clearSelection : t.selectAll}
        </button>
        <button className="bulk-delete-button" disabled={!selectedCount} onClick={onDelete}>
          <Icon name="trash" size={17} /> {t.deleteSelected}
        </button>
        <button className="text-button" onClick={onCancel}>{t.cancel}</button>
      </div>
    </div>
  )
}

function Warehouse({
  ingredients,
  usageCounts,
  language,
  t,
  onAdd,
  onUpdate,
  onDelete,
  selectionMode,
  selectedIds,
  onStartSelection,
  onToggleSelection,
  onToggleAll,
  onDeleteSelected,
  onCancelSelection,
}) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', nameKm: '', category: 'Coffee', defaultUnit: 'g' })
  const [submitting, setSubmitting] = useState(false)
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return ingredients
    return ingredients.filter((item) =>
      `${item.name} ${item.nameKm || ''}`.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [ingredients, query])
  const selectableIds = useMemo(
    () => filtered.filter((item) => (usageCounts.get(item.id) || 0) === 0).map((item) => item.id),
    [filtered, usageCounts],
  )
  const reset = () => { setEditing(null); setForm({ name: '', nameKm: '', category: 'Coffee', defaultUnit: 'g' }) }

  const submit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      if (editing) await onUpdate(editing.id, form)
      else await onAdd(form)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="warehouse-page">
      <div className="page-heading"><div><span>{t.ingredientWarehouse}</span><h1>{t.ingredients}</h1><p>{t.warehouseHelp}</p></div></div>
      {!!ingredients.length && (
        <SelectionToolbar
          active={selectionMode}
          selectedCount={selectedIds.size}
          selectableIds={selectableIds}
          t={t}
          onStart={onStartSelection}
          onToggleAll={() => onToggleAll(selectableIds)}
          onDelete={onDeleteSelected}
          onCancel={onCancelSelection}
        />
      )}
      {selectionMode && selectableIds.length < filtered.length && <p className="selection-help">{t.usedItemsSkipped}</p>}
      <div className="warehouse-layout">
        <form id="ingredient-form" className="ingredient-form" onSubmit={submit}>
          <h2>{editing ? t.editIngredient : t.addIngredient}</h2>
          <label className="field"><span>{t.ingredientNameEn}</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label className="field"><span>{t.ingredientNameKm}</span><input lang="km" value={form.nameKm} onChange={(event) => setForm({ ...form, nameKm: event.target.value })} /></label>
          <div className="field">
            <span>{t.group}</span>
            <CustomSelect
              value={form.category}
              onChange={(category) => setForm({ ...form, category })}
              ariaLabel={t.group}
              options={ingredientCategories.map((item) => ({ value: item, label: item }))}
            />
          </div>
          <div className="field">
            <span>{t.defaultUnit}</span>
            <CustomSelect
              value={form.defaultUnit}
              onChange={(defaultUnit) => setForm({ ...form, defaultUnit })}
              ariaLabel={t.defaultUnit}
              options={units.map((unit) => ({ value: unit, label: unit }))}
            />
          </div>
          <button className="primary-button" disabled={submitting}>{submitting ? t.saving : editing ? t.saveChanges : t.addIngredient}</button>
          {editing && <button type="button" className="text-button" onClick={reset}>{t.cancelEditing}</button>}
        </form>

        <div className="warehouse-list-card">
          <div className="warehouse-toolbar">
            <div><strong>{ingredients.length} {t.ingredients.toLowerCase()}</strong><span>{t.availableRecipes}</span></div>
            <label className="small-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.findIngredient} aria-label={t.findIngredient} /></label>
          </div>
          <div className="warehouse-list">
            {filtered.map((ingredient) => {
              const usedCount = usageCounts.get(ingredient.id) || 0
              return (
                <div className={`warehouse-row${selectedIds.has(ingredient.id) ? ' selected' : ''}`} key={ingredient.id}>
                  <span className="ingredient-symbol"><Icon name={ingredient.category === 'Tea' ? 'tea' : ingredient.category === 'Coffee' ? 'espresso' : 'box'} size={20} /></span>
                  <div><strong>{localText(ingredient, 'name', language)}</strong><span>{ingredient.category} · {t.defaultLabel} {ingredient.defaultUnit} · {t.usedIn} {usedCount} {usedCount === 1 ? t.recipe : t.recipePlural}</span></div>
                  <div className="row-actions">
                    {selectionMode ? (
                      <button
                        className="row-select"
                        disabled={usedCount > 0}
                        onClick={() => onToggleSelection(ingredient.id)}
                        aria-label={`${t.selectItems} ${ingredient.name}`}
                        aria-pressed={selectedIds.has(ingredient.id)}
                        title={usedCount > 0 ? t.usedItemsSkipped : t.selectItems}
                      >
                        <Icon name={selectedIds.has(ingredient.id) ? 'check' : 'plus'} size={17} />
                      </button>
                    ) : (
                      <>
                        <button onClick={() => { setEditing(ingredient); setForm({ name: ingredient.name, nameKm: ingredient.nameKm || '', category: ingredient.category, defaultUnit: ingredient.defaultUnit }) }} aria-label={`${t.editIngredient} ${ingredient.name}`}><Icon name="edit" size={17} /></button>
                        <button disabled={usedCount > 0} onClick={() => onDelete(ingredient.id)} aria-label={`${t.delete} ${ingredient.name}`}><Icon name="trash" size={17} /></button>
                      </>
                    )}
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

function PreparationsPage({
  preparations,
  usageCounts,
  language,
  t,
  onOpen,
  onEdit,
  onDelete,
  selectionMode,
  selectedIds,
  onStartSelection,
  onToggleSelection,
  onToggleAll,
  onDeleteSelected,
  onCancelSelection,
}) {
  const selectableIds = useMemo(
    () => preparations.filter((item) => (usageCounts.get(item.id) || 0) === 0).map((item) => item.id),
    [preparations, usageCounts],
  )
  return (
    <section className="warehouse-page">
      <div className="page-heading preparation-heading">
        <div><span>{t.preparationGuide}</span><h1>{t.preparations}</h1><p>{t.preparationHelp}</p></div>
      </div>
      {!!preparations.length && (
        <SelectionToolbar
          active={selectionMode}
          selectedCount={selectedIds.size}
          selectableIds={selectableIds}
          t={t}
          onStart={onStartSelection}
          onToggleAll={() => onToggleAll(selectableIds)}
          onDelete={onDeleteSelected}
          onCancel={onCancelSelection}
        />
      )}
      {selectionMode && selectableIds.length < preparations.length && <p className="selection-help">{t.usedItemsSkipped}</p>}
      {preparations.length ? (
        <div className="preparation-grid">
          {preparations.map((preparation) => {
            const usedCount = usageCounts.get(preparation.id) || 0
            return (
              <PreparationCard
                key={preparation.id}
                preparation={preparation}
                language={language}
                t={t}
                usedCount={usedCount}
                onOpen={onOpen}
                onEdit={onEdit}
                onDelete={onDelete}
                selectionMode={selectionMode}
                selected={selectedIds.has(preparation.id)}
                onToggle={onToggleSelection}
              />
            )
          })}
        </div>
      ) : (
        <div className="empty"><Icon name="prep" size={30} /><h2>{t.noPreparations}</h2></div>
      )}
    </section>
  )
}

function LoginScreen({ language, t, onLanguageChange, onLogin }) {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (!password || submitting) return
    setSubmitting(true)
    setMessage('')
    try {
      await onLogin(password)
    } catch (error) {
      setMessage(errorMessage(error, t))
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={`login-screen lang-${language}`}>
      <form className="login-card" onSubmit={submit}>
        <div className="login-language language-switch" aria-label="Language">
          <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => onLanguageChange('en')}>EN</button>
          <button type="button" className={language === 'km' ? 'active' : ''} onClick={() => onLanguageChange('km')}>KH</button>
        </div>
        <span className="login-mark"><Icon name="lock" size={30} /></span>
        <div>
          <span className="category-label">PHIN &amp; POUR</span>
          <h1>{t.loginTitle}</h1>
          <p>{t.loginHelp}</p>
        </div>
        <label className="field">
          <span>{t.password}</span>
          <input
            autoFocus
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.enterPassword}
            required
          />
        </label>
        {message && <p className="login-error" role="alert">{message}</p>}
        <button className="primary-button" disabled={submitting || !password}>
          {submitting ? t.signingIn : t.unlock}
        </button>
      </form>
    </main>
  )
}

function ConfirmDeleteDialog({ item, t, deleting, error, onCancel, onConfirm }) {
  const [password, setPassword] = useState('')
  if (!item) return null
  const count = item.ids.length
  const title = count > 1 ? t.confirmDeleteManyTitle : t.confirmDeleteTitle
  const description = count > 1
    ? t.confirmDeleteManyText.replace('{count}', count)
    : t.confirmDeleteText.replace('{name}', item.names[0])

  return (
    <div className="overlay confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && !deleting && onCancel()}>
      <form
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-text"
        onSubmit={(event) => {
          event.preventDefault()
          onConfirm(password)
        }}
      >
        <span className="confirm-icon"><Icon name="trash" size={25} /></span>
        <h2 id="confirm-delete-title">{title}</h2>
        <p id="confirm-delete-text">{description}</p>
        {count > 1 && (
          <label className="field confirm-password">
            <span>{t.confirmPasswordHelp}</span>
            <input
              autoFocus
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.enterPassword}
              required
            />
          </label>
        )}
        {error && <p className="confirm-error" role="alert">{error}</p>}
        <div className="confirm-actions">
          <button type="button" className="secondary-button" disabled={deleting} onClick={onCancel}>{t.noKeep}</button>
          <button className="confirm-delete-button" disabled={deleting || (count > 1 && !password)}>
            {deleting ? t.deleting : t.yesDelete}
          </button>
        </div>
      </form>
    </div>
  )
}

function App() {
  const [data, setData] = useState({ recipes: [], ingredients: [], preparations: [] })
  const [language, setLanguage] = useState('km')
  const [authChecking, setAuthChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
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
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [selectionModes, setSelectionModes] = useState({ recipe: false, preparation: false, ingredient: false })
  const [selectedForDelete, setSelectedForDelete] = useState({ recipe: [], preparation: [], ingredient: [] })
  const toastTimer = useRef(null)
  const t = messages[language]
  const selectedSets = useMemo(() => ({
    recipe: new Set(selectedForDelete.recipe),
    preparation: new Set(selectedForDelete.preparation),
    ingredient: new Set(selectedForDelete.ingredient),
  }), [selectedForDelete])

  const showError = (error) => {
    if (error.code === 'UNAUTHORIZED') {
      setAuthenticated(false)
      setData({ recipes: [], ingredients: [], preparations: [] })
    }
    setError(errorMessage(error, t))
  }

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    api('/api/auth', { signal: controller.signal })
      .then((result) => {
        if (active) setAuthenticated(Boolean(result.authenticated))
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          setAuthenticated(false)
          if (error.code === 'AUTH_NOT_CONFIGURED') setError(errorMessage(error, messages.km))
        }
      })
      .finally(() => {
        if (active) setAuthChecking(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return undefined

    const controller = new AbortController()
    let active = true
    api('/api/data', { signal: controller.signal })
      .then((nextData) => {
        if (active) setData(normalizeData(nextData))
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          if (error.code === 'UNAUTHORIZED') {
            setAuthenticated(false)
            setData({ recipes: [], ingredients: [], preparations: [] })
          }
          setError(errorMessage(error, messages.km))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [authenticated])

  useEffect(() => {
    document.documentElement.lang = language === 'km' ? 'km' : 'en'
  }, [language])

  const overlayOpen = Boolean(selectedRecipe || selectedPreparation || formOpen || preparationFormOpen || deleteTarget)
  useEffect(() => {
    if (!overlayOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [overlayOpen])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const notify = (message) => {
    window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(''), 2200)
  }

  const filteredRecipes = useMemo(() => data.recipes.filter((recipe) => {
    const matchesCategory = category === 'All' || recipe.category === category
    const text = `${recipe.name} ${recipe.nameKm || ''} ${recipe.description} ${recipe.descriptionKm || ''}`.toLocaleLowerCase()
    return matchesCategory && text.includes(query.trim().toLocaleLowerCase())
  }), [data.recipes, category, query])
  const filteredRecipeIds = useMemo(() => filteredRecipes.map((recipe) => recipe.id), [filteredRecipes])

  const preparationUsageCounts = useMemo(() => {
    const counts = new Map()
    data.recipes.forEach((recipe) => {
      new Set((recipe.preparations || []).map((line) => line.preparationId)).forEach((id) => {
        counts.set(id, (counts.get(id) || 0) + 1)
      })
    })
    return counts
  }, [data.recipes])

  const ingredientUsageCounts = useMemo(() => {
    const counts = new Map()
    const addUsage = (items) => {
      new Set(items.map((line) => line.ingredientId)).forEach((id) => {
        counts.set(id, (counts.get(id) || 0) + 1)
      })
    }
    data.recipes.forEach((recipe) => addUsage(recipe.ingredients || []))
    data.preparations.forEach((preparation) => addUsage(preparation.ingredients || []))
    return counts
  }, [data.recipes, data.preparations])

  const startSelection = (type) => {
    setSelectionModes((current) => ({ ...current, [type]: true }))
  }

  const cancelSelection = (type) => {
    setSelectionModes((current) => ({ ...current, [type]: false }))
    setSelectedForDelete((current) => ({ ...current, [type]: [] }))
  }

  const toggleSelection = (type, id) => {
    setSelectedForDelete((current) => {
      const selected = new Set(current[type])
      if (selected.has(id)) selected.delete(id)
      else selected.add(id)
      return { ...current, [type]: [...selected] }
    })
  }

  const toggleAllSelection = (type, ids) => {
    setSelectedForDelete((current) => {
      const selected = new Set(current[type])
      const allSelected = ids.length > 0 && ids.every((id) => selected.has(id))
      if (allSelected) return { ...current, [type]: [] }
      ids.forEach((id) => selected.add(id))
      return { ...current, [type]: [...selected] }
    })
  }

  const itemsForType = (type) => {
    if (type === 'recipe') return data.recipes
    if (type === 'preparation') return data.preparations
    return data.ingredients
  }

  const askToDeleteSelected = (type) => {
    const ids = selectedForDelete[type]
    if (!ids.length || deleting) return
    const idSet = new Set(ids)
    const names = itemsForType(type)
      .filter((item) => idSet.has(item.id))
      .map((item) => localText(item, 'name', language))
    setDeleteError('')
    setDeleteTarget({ type, ids, names })
  }

  const saveRecipe = async (recipe) => {
    const isEditing = Boolean(editingRecipe)
    setError('')
    try {
      const saved = await api(
        isEditing ? `/api/recipes/${editingRecipe.id}` : '/api/recipes',
        { method: isEditing ? 'PUT' : 'POST', body: JSON.stringify(recipe) },
      )
      setData((current) => ({
        ...current,
        recipes: isEditing
          ? current.recipes.map((item) => item.id === saved.id ? saved : item)
          : [saved, ...current.recipes],
      }))
      setFormOpen(false)
      setEditingRecipe(null)
      setSelectedRecipe(saved)
      notify(t.savedJson)
    } catch (error) { showError(error); throw error }
  }

  const addIngredient = async (ingredient) => {
    setError('')
    try {
      const saved = await api('/api/ingredients', { method: 'POST', body: JSON.stringify(ingredient) })
      setData((current) => ({ ...current, ingredients: [...current.ingredients, saved] }))
      notify(t.ingredientAdded)
    }
    catch (error) { showError(error); throw error }
  }

  const updateIngredient = async (id, ingredient) => {
    setError('')
    try {
      const saved = await api(`/api/ingredients/${id}`, { method: 'PUT', body: JSON.stringify(ingredient) })
      setData((current) => ({
        ...current,
        ingredients: current.ingredients.map((item) => item.id === saved.id ? saved : item),
      }))
      notify(t.ingredientUpdated)
    } catch (error) { showError(error); throw error }
  }

  const savePreparation = async (preparation) => {
    const isEditing = Boolean(editingPreparation)
    setError('')
    try {
      const saved = await api(
        isEditing ? `/api/preparations/${editingPreparation.id}` : '/api/preparations',
        { method: isEditing ? 'PUT' : 'POST', body: JSON.stringify(preparation) },
      )
      setData((current) => ({
        ...current,
        preparations: isEditing
          ? current.preparations.map((item) => item.id === saved.id ? saved : item)
          : [saved, ...current.preparations],
      }))
      setPreparationFormOpen(false)
      setEditingPreparation(null)
      setSelectedPreparation(saved)
      notify(t.preparationSaved)
    } catch (error) {
      showError(error)
      throw error
    }
  }

  const askToDelete = (type, id, name) => {
    if (deleting) return
    setDeleteError('')
    setDeleteTarget({ type, ids: [id], names: [name] })
  }

  const confirmDelete = async (password = '') => {
    if (!deleteTarget || deleting) return

    const target = deleteTarget
    const settings = {
      recipe: { path: `/api/recipes/${target.ids[0]}`, message: t.recipeDeleted },
      preparation: { path: `/api/preparations/${target.ids[0]}`, message: t.preparationDeleted },
      ingredient: { path: `/api/ingredients/${target.ids[0]}`, message: t.ingredientDeleted },
    }[target.type]

    if (!settings) return

    setDeleting(true)
    setError('')
    setDeleteError('')

    try {
      let result
      if (target.ids.length === 1) {
        result = await api(settings.path, { method: 'DELETE' })
      } else {
        result = await api('/api/data', {
          method: 'POST',
          body: JSON.stringify({ action: 'bulk-delete', type: target.type, ids: target.ids, password }),
        })
      }
      const deletedIds = new Set(result.deletedIds || target.ids)
      setData((current) => {
        if (target.type === 'recipe') {
          return { ...current, recipes: current.recipes.filter((item) => !deletedIds.has(item.id)) }
        }
        if (target.type === 'preparation') {
          return { ...current, preparations: current.preparations.filter((item) => !deletedIds.has(item.id)) }
        }
        return { ...current, ingredients: current.ingredients.filter((item) => !deletedIds.has(item.id)) }
      })
      cancelSelection(target.type)
      if (target.type === 'recipe' && target.ids.includes(selectedRecipe?.id)) setSelectedRecipe(null)
      if (target.type === 'preparation' && target.ids.includes(selectedPreparation?.id)) setSelectedPreparation(null)
      notify(target.ids.length > 1
        ? t.itemsDeleted.replace('{count}', deletedIds.size)
        : settings.message)
      setDeleteTarget(null)
    } catch (error) {
      if (error.code === 'INVALID_PASSWORD') {
        setDeleteError(t.incorrectPassword)
      } else if (error.code === 'ITEMS_IN_USE') {
        setDeleteError(target.type === 'preparation' ? t.cannotDeleteUsedPreparation : t.usedItemsSkipped)
      } else {
        showError(error)
      }
    } finally {
      setDeleting(false)
    }
  }

  const openMobileCreate = () => {
    if (page === 'preparations') {
      setEditingPreparation(null)
      setPreparationFormOpen(true)
      return
    }
    if (page === 'warehouse') {
      const form = document.getElementById('ingredient-form')
      form?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      form?.querySelector('input')?.focus({ preventScroll: true })
      return
    }
    setEditingRecipe(null)
    setFormOpen(true)
  }

  const mobileCreateLabel = page === 'preparations'
    ? t.newPreparation
    : page === 'warehouse'
      ? t.addIngredient
      : t.newRecipe
  const currentSelectionType = page === 'recipes' ? 'recipe' : page === 'preparations' ? 'preparation' : 'ingredient'
  const isSelecting = selectionModes[currentSelectionType]

  const changePage = (nextPage) => {
    setPage(nextPage)
    setSelectionModes({ recipe: false, preparation: false, ingredient: false })
    setSelectedForDelete({ recipe: [], preparation: [], ingredient: [] })
  }

  const login = async (password) => {
    await api('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', password }),
    })
    setError('')
    setLoading(true)
    setAuthenticated(true)
  }

  const logout = async () => {
    try {
      await api('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) })
    } finally {
      setAuthenticated(false)
      setData({ recipes: [], ingredients: [], preparations: [] })
      setSelectedRecipe(null)
      setSelectedPreparation(null)
      setError('')
    }
  }

  if (authChecking) return <div className="state-screen"><span className="loader" /></div>
  if (!authenticated) return <LoginScreen language={language} t={t} onLanguageChange={setLanguage} onLogin={login} />
  if (loading) return <div className="state-screen"><span className="loader" /><p>{t.loading}</p></div>

  return (
    <div className={`app lang-${language}`}>
      <header className="topbar">
        <button className="brand" onClick={() => changePage('recipes')}>
          <span className="brand-word">PHIN</span><i className="brand-amp">&</i><span className="brand-word">POUR</span>
          <span className="brand-short">P&amp;P</span><small>{t.staffRecipes}</small>
        </button>
        <nav>
          <button aria-label={t.recipes} title={t.recipes} className={page === 'recipes' ? 'active' : ''} onClick={() => changePage('recipes')}><Icon name="book" size={18} /><span className="nav-label">{t.recipes}</span></button>
          <button aria-label={t.preparations} title={t.preparations} className={page === 'preparations' ? 'active' : ''} onClick={() => changePage('preparations')}><Icon name="prep" size={18} /><span className="nav-label">{t.preparations}</span></button>
          <button aria-label={t.ingredients} title={t.ingredients} className={page === 'warehouse' ? 'active' : ''} onClick={() => changePage('warehouse')}><Icon name="box" size={18} /><span className="nav-label">{t.ingredients}</span></button>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            <button className={language === 'km' ? 'active' : ''} onClick={() => setLanguage('km')}>KH</button>
          </div>
          <button aria-label={mobileCreateLabel} className="primary-button top-add" onClick={openMobileCreate}><Icon name="plus" size={18} /><span className="top-add-label">{mobileCreateLabel}</span></button>
          <button className="icon-button logout-button" onClick={logout} aria-label={t.logout} title={t.logout}><Icon name="lock" size={17} /></button>
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
              <>
                <SelectionToolbar
                  active={selectionModes.recipe}
                  selectedCount={selectedSets.recipe.size}
                  selectableIds={filteredRecipeIds}
                  t={t}
                  onStart={() => startSelection('recipe')}
                  onToggleAll={() => toggleAllSelection('recipe', filteredRecipeIds)}
                  onDelete={() => askToDeleteSelected('recipe')}
                  onCancel={() => cancelSelection('recipe')}
                />
                <div className="recipe-list">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      language={language}
                      t={t}
                      onOpen={setSelectedRecipe}
                      selectionMode={selectionModes.recipe}
                      selected={selectedSets.recipe.has(recipe.id)}
                      onToggle={(id) => toggleSelection('recipe', id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty"><Icon name="search" size={30} /><h2>{t.noDrink}</h2><p>{t.tryDifferent}</p></div>
            )}
          </section>
        ) : page === 'preparations' ? (
          <PreparationsPage
            preparations={data.preparations || []}
            usageCounts={preparationUsageCounts}
            language={language}
            t={t}
            onOpen={setSelectedPreparation}
            onEdit={(preparation) => { setEditingPreparation(preparation); setPreparationFormOpen(true) }}
            onDelete={(id) => {
              const preparation = data.preparations.find((item) => item.id === id)
              askToDelete('preparation', id, localText(preparation, 'name', language))
            }}
            selectionMode={selectionModes.preparation}
            selectedIds={selectedSets.preparation}
            onStartSelection={() => startSelection('preparation')}
            onToggleSelection={(id) => toggleSelection('preparation', id)}
            onToggleAll={(ids) => toggleAllSelection('preparation', ids)}
            onDeleteSelected={() => askToDeleteSelected('preparation')}
            onCancelSelection={() => cancelSelection('preparation')}
          />
        ) : (
          <Warehouse
            ingredients={data.ingredients} usageCounts={ingredientUsageCounts} language={language} t={t}
            onAdd={addIngredient}
            onUpdate={updateIngredient}
            onDelete={(id) => {
              const ingredient = data.ingredients.find((item) => item.id === id)
              askToDelete('ingredient', id, localText(ingredient, 'name', language))
            }}
            selectionMode={selectionModes.ingredient}
            selectedIds={selectedSets.ingredient}
            onStartSelection={() => startSelection('ingredient')}
            onToggleSelection={(id) => toggleSelection('ingredient', id)}
            onToggleAll={(ids) => toggleAllSelection('ingredient', ids)}
            onDeleteSelected={() => askToDeleteSelected('ingredient')}
            onCancelSelection={() => cancelSelection('ingredient')}
          />
        )}
      </main>

      {selectedRecipe && <RecipeView recipe={selectedRecipe} ingredients={data.ingredients} preparations={data.preparations || []} language={language} t={t} onClose={() => setSelectedRecipe(null)} onEdit={(recipe) => { setSelectedRecipe(null); setEditingRecipe(recipe); setFormOpen(true) }} onDelete={(id) => askToDelete('recipe', id, localText(selectedRecipe, 'name', language))} />}
      {selectedPreparation && (
        <PreparationView
          preparation={selectedPreparation}
          ingredients={data.ingredients}
          language={language}
          t={t}
          usedCount={preparationUsageCounts.get(selectedPreparation.id) || 0}
          onClose={() => setSelectedPreparation(null)}
          onEdit={(preparation) => { setSelectedPreparation(null); setEditingPreparation(preparation); setPreparationFormOpen(true) }}
          onDelete={(id) => askToDelete('preparation', id, localText(selectedPreparation, 'name', language))}
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
      <ConfirmDeleteDialog
        key={deleteTarget ? `${deleteTarget.type}:${deleteTarget.ids.join(',')}` : 'no-delete'}
        item={deleteTarget}
        t={t}
        deleting={deleting}
        error={deleteError}
        onCancel={() => { setDeleteTarget(null); setDeleteError('') }}
        onConfirm={confirmDelete}
      />

      {!isSelecting && <button className="mobile-add" onClick={openMobileCreate} aria-label={mobileCreateLabel}><Icon name="plus" size={23} /></button>}
      {error && <div className="error-toast"><Icon name="alert" size={18} /><span>{error}</span><button onClick={() => setError('')} aria-label={t.cancel}><Icon name="close" size={16} /></button></div>}
      {toast && <div className="success-toast"><Icon name="check" size={17} />{toast}</div>}
    </div>
  )
}

export default App
