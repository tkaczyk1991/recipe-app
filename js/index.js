import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app
 * - search object
 * - current recipe object
 * - shopping list
 * - liked recipes
 * */ 
const state = {};


/**
 *  SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();
    //TESTING
    // const query = 'pizza';
    // console.log(query);

    if(query){
        // 2. New search object, add to state
        // search class contains an async function
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            // async function from search class returns a promise
            await state.search.getResults();

            // 5. Render results on UI
            // dont render UI until the promise has been returned from the API
            clearLoader();
            // console.log(state.search.result);
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert('Something went wrong with the search!!');
            clearLoader();
        }


    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    // console.log(btn);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 *  RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // get ID from url
    // replace # in the url with an empty string, so we are left with only the number
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id){
        // prepare UI for changes

        // create new recipe object
        state.recipe = new Recipe(id);
        
        // TESTING
        // window.r = state.recipe;

        try{
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            console.log(state.recipe);
        } catch(err){
            alert('Error processing recipe!');
        }

    }
};

//  window.addEventListener('hashchange', controlRecipe);
//  window.addEventListener('load', controlRecipe);
// two lines above condensed into one line
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));