import View from "./View";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    _generateMarkup(){
        const curPage  = this._data.search.page;
        const numPages = Math.ceil(this._data.search.results.length / this._data.search.resultPerPage);

        // page 1 and their are also other pages
        if(curPage === 1 && numPages > 1)
            return this._generateMarkupBtnRight(curPage);

        // other page
        if(curPage > 1 && curPage < numPages)
            return `${this._generateMarkupBtnLeft(curPage)}${this._generateMarkupBtnRight(curPage)}`;

        // last page
        if(curPage === numPages)
            return this._generateMarkupBtnLeft(curPage);

        // page 1 and no other pages
        if(curPage === 1 && numPages === 1)
            return '';
    }

    _generateMarkupBtnRight(curPage){
        return `
            <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }

    _generateMarkupBtnLeft(curPage){
        return `
        <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
            <span>Page ${curPage-1}</span>
            <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-left"></use>
            </svg>
        </button>
        `;
    }

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }
}

export default new PaginationView();