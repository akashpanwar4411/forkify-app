import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

// Polyfilling
import 'core-js/stable'; // for polyfilling everything
import 'regenerator-runtime/runtime'; // for polyfilling async await


if(module.hot){
  module.hot.accept();
}

const controlRecipe = async function(){
  try{

    const recipeId = window.location.hash.slice(1);
    
    if(!recipeId) return;
    // console.log(recipeId);

    // 0) Update result view to mark selected search result 
    resultsView.update(model.getSearchResultsPage());

    // 2) Updating Bookmarks view
    bookmarksView.update(model.state.bookmarks);
    
    recipeView.renderSpinner();

    //  3) Loading the recipe
    await model.loadRacipe(recipeId);
    const {recipe} = model.state;
    
    // 4) Randering the recipe
    recipeView.render(recipe);
  }catch(err){
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search query
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());    

    // 4) Render Pagination
    paginationView.render(model.state);
  }catch(err){
    console.log(err);
    resultsView.renderError();
  }
};

const controlPagination= function(goToPage){
  // 3) Render NEW results 
  resultsView.render(model.getSearchResultsPage(goToPage));    

  // 4) Render NEW Pagination
  paginationView.render(model.state);
};

const controlServings = function(newServings){
  // Updating the recipe servings (in state)
  model.updateServings(newServings);

  // Updating the recipe view
  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe);
};


const controlAddBookmark = function(){
  // 1) Add/Remove bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmark = function(){
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  try{
    // showing spinner before starting to update the recipe
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render the recipe to recipe view
    recipeView.render(model.state.recipe);

    // Show success message for uploading recipe
    addRecipeView.openWindow();
    addRecipeView.renderMessage();


    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // close form window
    setTimeout(() => {
      addRecipeView. closeWindow();
    }, MODEL_CLOSE_SEC * 1000);
    // console.log(newRecipe);
  }catch(err){
    console.error(`🤢 ${err}`);
    addRecipeView.renderError(err.message);
  }
};

const init = function(){
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRander(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
