class ViewModel {
    constructor() {
        this.message = ko.observable('Привет Мир!');
    }
    
}

document.addEventListener("DOMContentLoaded", function () {
    const viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById('popup'));
});