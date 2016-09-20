'use strict';

{
    var task1 = document.querySelector('#task1'),
        task2 = document.querySelector('#task2'),
        task4 = document.querySelector('#task4');

    // task1.addEventListener('mdl-componentupgraded', () => {
    //     task1.MaterialProgress.setProgress(44);
    // });
    // task2.addEventListener('mdl-componentupgraded', () => {
    //     task2.MaterialProgress.setProgress(14);
    // });
    // task4.addEventListener('mdl-componentupgraded', () => {
    //     task4.MaterialProgress.setProgress(31);
    // });

    setTimeout(function () {
        var classList = document.querySelector('.projects-table .is-selected td > label');
        if (classList) {
            classList.classList.add('is-checked');
        }
        componentHandler.upgradeDom();
    }, 100);
}