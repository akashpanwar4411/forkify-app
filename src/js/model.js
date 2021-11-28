import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function(data){
    let {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}),
    };
};

export const loadRacipe = async function(recipeId){
    try{
        const data = await AJAX(`${API_URL}${recipeId}?key=${KEY}`);
        
        state.recipe = createRecipeObject(data);
        // console.log(state.recipe);
        if(state.bookmarks.some(bookmark=> bookmark.id === recipeId))
            state.recipe.bookmarked = true;
        else 
            state.recipe.bookmarked = false;

    }catch(err){
        console.error(`${err} 🤔🤔🤔🤔`);
        throw(`${err} 🤔🤔🤔🤔`);
    }
};

export const loadSearchResults = async function(query){
    try{
        // https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
        const data = await AJAX(`${API_URL}?search=${query}&?key=${KEY}`);
        state.search.results = data.data.recipes.map(rec=>{
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key}),
            };
        });
        state.search.page = 1;
        // console.log(state.search.results);
    }catch(err){
        console.error(`${err} 🤔🤔🤔🤔`);
        throw(`${err} 🤔🤔🤔🤔`);
    }
};

export const getSearchResultsPage = function(page = this.state.search.page){
    this.state.search.page = page;
    const start = (page-1) * RES_PER_PAGE; // 0
    const end = page * RES_PER_PAGE; // 9
    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings){

    state.recipe.ingredients.forEach(ing=>{
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
       // newQt = oldQt * newServings / oldServings; // 2 * 8 / 4 = 4 
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe){
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function(id){
    // delete bookmark
    const index = state.bookmarks.findIndex(el=> el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(ing=> ing[0].startsWith('ingredient') && ing[1] !=='').map(ing=>{
            const ingArr = ing[1].split(',').map(el=> el.trim());
            
            if(ingArr.length !== 3) throw new Error('Wrong ingredient formate! Please use the correct formate :)');
            
            const [quantity, unit, description] = ingArr;
            return {quantity: quantity? +quantity: null, unit, description};
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }catch(err){
        throw err;
    }
};

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
};
// clearBookmarks();
