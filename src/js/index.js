import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';
import * as listView from './views/listView.js';
import * as likesView from './views/likesView.js';
import { elements,renderLoader,clearLoader} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - liked recipes
 */

 //testing for development
const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 * 
*/
const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();
    //console.log(query);

    if (query){
        // new search object and add to state
        state.search = new Search(query);

        // prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // search for recipes
            await state.search.getResults();
    
            // render result
            clearLoader();
            searchView.renderResults(state.search.result);

            //preview our object 
            //console.log(state);
        }
        catch (err) {
            alert ('something went wrong with search');
            console.log(err);
            clearLoader();
        }
    }
};

//call control search when user submit text in input search
elements.searchForm.addEventListener('submit' , e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click',e => {
    const btn = e.target.closest('.btn-inline');

    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});



/*
** RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#','');

    if(id){
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
    
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

            //preview our object
            //console.log(state);
        }
        catch (err) {
            console.log(err);
            alert('error processing recipe');
        }
    }
};


/*
**  List Controller
*/

const controlList = () => {
    
    //create a new list if there in none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        
        //add recipe ingredient to list (in state object)
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        
        //render item to the ui
        listView.renderItem(item);
    });
};

/*
** Like Controller
*/

const controlLike = () => {

    //if there is not state like and then create it
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to ui list
        likesView.renderLike(newLike);
        //console.log(state.likes);
    }
    //user has liked current recipeView 
    else {
        
        //remove like from the state
        state.likes.deleteLike(currentID);

        //toggle the like button
        likesView.toggleLikeBtn(false);

        //remove like from ui list
        likesView.deleteLike(currentID);
        //console.log(state.likes);
    }

    //let user see what recipe user like
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


//handle delete and update list item  events
elements.shopping.addEventListener('click', e => {

    //get a closest target from element
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delete from ui
        listView.deleteItem(id);
    }
    else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val);
    }
});


window.addEventListener('load',() => {

    //initial the object we need
    state.likes = new Likes();
    state.list = new List();

    //restore likes
    state.likes.readStorage();

    //restore list shopping
    state.list.readStorage();

    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

    //render the existing list
    if (state.list.list) state.list.list.forEach(item => listView.renderItem(item));
});



//two event for one same function ver 1
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load',controlRecipe);

//two event for one same function ver 2
//to save data when reload

//to set an event for recipe when load and hashchange
['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));

elements.recipe.addEventListener('click', e => {
    //btn-increase * -> all child of btn-increase
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);    
        }
    }
    else if (e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //add ingredient to shopping list
        controlList();
        state.list.persistData();
    }
    else if (e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }
});


//add event lister for clear shopping list
elements.shoppingContainer.addEventListener('click', e => {
    if (e.target.matches('.btn-clear-shopping__list , .btn-clear-shopping__list *')){
        state.list.deleteShoppingList();
        listView.clearShoppingList();
    }
});