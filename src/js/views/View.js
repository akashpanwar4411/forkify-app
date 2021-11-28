import icons from 'url:../../img/icons.svg'; // Parcel 2
export default class View{
    _data;

    render(data, render=true){
        
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        
        this._data = data;
        const markup = this._generateMarkup();
        
        if(!render) return markup;
        
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data){   
        this._data = data;

        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        // console.log(newElements);
        // console.log(curElements);

        newElements.forEach((newEl, i)=>{
            const curEl = curElements[i];
            // console.log(newEl.isEqualNode(curEl));

            // Update Changed Text
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !==''){
                // console.log(newEl.firstChild.nodeValue.trim());
                curEl.textContent = newEl.textContent;
            }

            // Update Changed Attribute
            if(!newEl.isEqualNode(curEl))
                Array.from(newEl.attributes).forEach(attr=>{
                    // console.log(attr);
                    curEl.setAttribute(attr.name, attr.value);
                });
        });
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        this._clear();
        const markup = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
        `;
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };
    
    renderError(message = this._errMessage){
        const markup = `
            <div class="error">
            <div>
                <svg>
                <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message){
        const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}