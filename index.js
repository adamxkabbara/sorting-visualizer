import {bubbleSortAnimation} from './sortingAlgorithms/bubbleSort.js';
import {quickSortAnimation} from './sortingAlgorithms/quickSort.js';
import {mergeSortAnimation} from './sortingAlgorithms/mergeSort.js';
import {animateColor} from './utils.js';

window.addEventListener('DOMContentLoaded', () => {

    resetArray();

    document.getElementById('resetArrayBtn').addEventListener('click', resetArray);
    document.getElementById('sortForm').addEventListener('submit', (e) => {
        e.preventDefault();
        sort();
    });
})

function generateRandomIntegers(size, min, max) {
    let resultArray = [];

    for (let i = 0; i < size; i++) {
        resultArray.push(Math.floor((Math.random() * 600) + 1));        
    }

    return resultArray;
}

function resetArray() {
    let array = generateRandomIntegers(100, 5, 600);

    localStorage.setItem('sortArray', JSON.stringify(array));

    let barWidth = 7;    // size if the width of the bar
    let spaceBetweenBars = 2;
    let xPos = 0;
    let totalWidth = array.length * (barWidth + spaceBetweenBars);

    let sortingContainer = document.getElementById('sortingContainer');
    if (sortingContainer.innerHTML == '') {
        array.forEach((el) => {
            sortingContainer.innerHTML += `<rect x=${xPos} height=${el} width=${barWidth} style='fill:black;' />`;
            xPos+=(barWidth+spaceBetweenBars);     // position each bar 2px from each other bar
        });

        sortingContainer.setAttribute('width', totalWidth);
    }
    else {
        let nodes = sortingContainer.childNodes;

        for (let index = 0; index < nodes.length; index++) {
            nodes[index].setAttribute('height', array[index]);
            nodes[index].style = 'fill:black';

        }
    }
}

function sort() {
    let formData = new FormData(document.getElementById('sortForm'));
    let algorithm = formData.get('sortingAlgorithm');
    let sortArray = JSON.parse(localStorage.getItem('sortArray'));
    let nodes = document.getElementById('sortingContainer').childNodes;
    let animationSpeed = 5;

    nodes.forEach((node) => {
        animateColor(node, 'black');
    });

    switch (algorithm) {
        case 'bubble':
            bubbleSortAnimation(sortArray, animationSpeed);
            break;
        case 'quick':
            quickSortAnimation(sortArray, animationSpeed);
            break;
        case 'merge':
            mergeSortAnimation(sortArray, animationSpeed);
            break;
        default:
            break;
    }
}
