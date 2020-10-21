const COLDOWN = 20;
const DEFAULT_ERROR_MESSAGE = 'Ошибок нет';

console.log("Popup DOM fully loaded and parsed");

    function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        console.log('Tab script:');
        console.log(document.querySelectorAll('.wo9IH button'));
        return document.querySelectorAll('.wo9IH button');
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:');
        console.log(results);
    });
class ViewModel {
    constructor() {
        this.isBusy = ko.observable(false);
        this.step = ko.observable(1);
        this.errorMessage = ko.observable();
    }

    getIndex() {
        return this.step() - 1;
    }

    incStep() {
        this.step(this.step() + 1);
    }

    cleanErrors() {
        this.errorMessage(DEFAULT_ERROR_MESSAGE);
    }
    
    start() {
        let buttons = document.querySelectorAll('.wo9IH button');
        let buttonsFiltered = [];
        for (let key in buttons) {
            let button = buttons[key];
            if ('Подписаться' === button.innerText) {
                buttonsFiltered.push(button);
            }
        }

        if (buttonsFiltered.length < 1) {
            this.errorMessage('Подписчиков не найдено');
            return;
        }

        let self = this;
        function follow() {
            if (buttonsFiltered.length <= self.getIndex()) {
                self.isBusy(false);
                self.cleanErrors();
                return;
            }
            self.incStep();
            let button = buttonsFiltered[self.getIndex()];

            button.click();

            setTimeout(follow, COLDOWN * 1000);
        }
        follow();
        this.isBusy(true);
    }

    startOnPage() {
        function startFollow() {
            let index = 0;
            let coldown = 20;
            let count = 0;
            let buttons = document.querySelectorAll('.wo9IH button');
            let buttonsFiltered = [];
            for (let key in buttons) {
                let button = buttons[key];
                if ('Подписаться' === button.innerText) {
                    buttonsFiltered.push(button);
                }
            }
            function follow() {
                if (buttonsFiltered.length <= index) {
                    return;
                }
                index++;
                let button = buttonsFiltered[index];
        
                count++;
                button.click();
                console.log('Current: '+count);
        
                setTimeout(follow, coldown * 1000);
            }
            follow();
        }

        chrome.tabs.executeScript({
            code: '(' + startFollow + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {
            //Here we have just the innerHTML and not DOM structure
            console.log('Popup script:');
            console.log(results);
        });
    }
    
    stop() {
        this.isBusy(false);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById('popup'));
});