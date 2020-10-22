const COLDOWN = 20;
const DEFAULT_ERROR_MESSAGE = 'Ошибок нет';

class ViewModel {
    constructor() {
        this.isBusy = ko.observable(false);
        this.step = ko.observable(1);
        this.errorMessage = ko.observable();
        this.countFollowers = ko.observable(0);
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
        let buttons = Array.from(document.querySelectorAll('.PZuss button'));  
        let buttonsFiltered = buttons.filter((button) => button.innerText === 'Подписаться');
        // for in  плохой выбор, так как довольно медленный и может пойти по свойствам в прототипе + не гарантирует порядок элементов



        if (buttonsFiltered.length < 1) return this.errorMessage('Подписчиков не найдено');
        // просто люблю так делать, для краткости, возможно тут в условии будет выполняться что-то еще в будущем. но я про это не знаю

        function follow() {
            if (buttonsFiltered.length <= this.getIndex()) {
                this.isBusy(false);
                this.cleanErrors();
                return;
            }
            this.incStep();
            let button = buttonsFiltered[this.getIndex()];

            button.click();

            setTimeout(follow.bind(this) , COLDOWN * 1000);
            //сделал bind вместо self

        }
        follow();
        this.isBusy(true);
    }

    startOnPage() {
        this.isBusy(true);

        function startFollow() {
            let index = 0;
            let coldown = 20;
            let count = 0;
            let buttons = Array.from(document.querySelectorAll('.PZuss button')); //теперь мы не зависим от класса который то есть то его нет 
            let buttonsFiltered = buttons.filter((button) => button.innerText === 'Подписаться');

            console.log(buttonsFiltered);
            function follow() {
                if (!buttonsFiltered.length) return;
                let button = buttonsFiltered[index++];

                button.click();
                console.log('Current: ' + count++);
        
                setTimeout(follow, coldown * 1000);
            }
            follow();

            return buttonsFiltered.length;
        }

        chrome.tabs.executeScript(
            {
                code: `(${startFollow})();`
            }, 
            (countFollowers) => this.countFollowers(countFollowers)
        );
    }
    
    stop() {
        this.isBusy(false);
    }

    updateCountFollowers() {
        function checkFollowers() {
            let buttons = Array.from(document.querySelectorAll('.PZuss button')); //теперь мы не зависим от класса который то есть то его нет 
            let buttonsFiltered = buttons.filter((button) => button.innerText === 'Подписаться');
            return buttonsFiltered.length;
        }

        chrome.tabs.executeScript(
            {
                code: `(${checkFollowers})();`
            }, 
            (countFollowers) => this.countFollowers(countFollowers)
        );
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById('popup'));
});