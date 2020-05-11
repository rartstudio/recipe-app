import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ''
};

export const clearResults = () => {
    //clear list
    elements.searchResList.innerHTML = '';
    //clear result page (button navigation)
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    //href* is all that results__link have href attribute
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');  
};

/*
** example title : ' Pasta with tomato and spinach '
** acc : 0 / acc + cur.length = 5 / newTitle = ['Pasta'];
** acc : 5 / acc + cur.length = 9 / newTitle = ['Pasta','with']
** acc : 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
** acc : 15/ acc + cur.length = 18 / newTitle = ['pasta','with','tomato']
** acc : 18/ acc + cur.length = 21 / newTitle = ['Pasta', 'with','tomato','and']
*/

export const limitRecipeTitle = (title, limit = 17) =>{
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="/#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend',markup);
}

//with pagination

//return button to template string 
const createButton = (page,type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;

//render button 
const renderButtons = (page, numResults, resPerPage) => {
    //turn it to integer value 
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1){
        //only button to go to next page
        button = createButton(page, 'next');
    }
    else if (page < pages){
        //both buttons
        button = `
            ${createButton(page,'prev')}
            ${createButton(page,'next')}
        `;
    }
    else if (page === pages && pages > 1){
        //only button to go to prev page
        button = createButton(page,'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

//pagination main function
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    
    //render results of currents page
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page,recipes.length, resPerPage);
}


//without pagination
// export const renderResults = recipes => {
//     recipes.forEach(renderRecipe);
// }