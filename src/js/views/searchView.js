
class SearchView{
    _parentElement = document.querySelector('.search');

    getQuery(){
        const query = this._parentElement.querySelector('.search__field').value;
        this.clearSearch();
        return query;
    }

    addHandlerSearch(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    }

    clearSearch(){
        this._parentElement.querySelector('.search__field').value = '';
    }
}

export default new SearchView();