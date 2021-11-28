import View from './View.js';

class AddRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow();
    }

    closeWindow(){
        this._overlay.classList.add('hidden');
        this._window.classList.add('hidden');
    }
    openWindow(){
        // ***Important Very Important to Know
        // ***Here before opening the window we need to render the window first
        this.render('no data needed to pass');
        this._overlay.classList.remove('hidden');
        this._window.classList.remove('hidden');
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.openWindow.bind(this));
    }
    
    _addHandlerCloseWindow(){
        this._btnClose.addEventListener('click', this.closeWindow.bind(this));
        this._overlay.addEventListener('click', this.closeWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            const dataArray = [...new FormData(this)]; // converting this weird object into an array
            const data = Object.fromEntries(dataArray); // now converting array entries into an object
            handler(data);
        });
    }

    _generateMarkup(){
        return `
            <div class="upload__column">
                <h3 class="upload__heading">Recipe data</h3>
                <label>Title</label>
                <input value="" required name="title" type="text" />
                <label>URL</label>
                <input value="" required name="sourceUrl" type="text" />
                <label>Image URL</label>
                <input value="" required name="image" type="text" />
                <label>Publisher</label>
                <input value="" required name="publisher" type="text" />
                <label>Prep time</label>
                <input value="" required name="cookingTime" type="number" />
                <label>Servings</label>
                <input value="" required name="servings" type="number" />
            </div>
    
            <div class="upload__column">
                <h3 class="upload__heading">Ingredients</h3>
                <label>Ingredient 1</label>
                <input
                value=""
                type="text"
                required
                name="ingredient-1"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 2</label>
                <input
                value=""
                type="text"
                name="ingredient-2"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 3</label>
                <input
                value=""
                type="text"
                name="ingredient-3"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 4</label>
                <input
                type="text"
                name="ingredient-4"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 5</label>
                <input
                type="text"
                name="ingredient-5"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 6</label>
                <input
                type="text"
                name="ingredient-6"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
            </div>
    
            <button class="btn upload__btn">
                <svg>
                <use href="src/img/icons.svg#icon-upload-cloud"></use>
                </svg>
                <span>Upload</span>
            </button>
        `;
    }
}

export default new AddRecipeView();