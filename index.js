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
    let array = generateRandomIntegers(10, 5, 600);
    array = [50, 10, 60, 70, 5, 20, 40, 30, 80, 90]
    localStorage.setItem('sortArray', JSON.stringify(array));

    let barWidth = 5;    // size if the width of the bar
    let xPos = 0;

    let sortingContainer = document.getElementById('sortingContainer');
    if (sortingContainer.innerHTML == '') {
        array.forEach((el) => {
            sortingContainer.innerHTML += `<rect x=${xPos} height=${el} width=${barWidth} style='fill:black;' />`;
            xPos+=(barWidth+2);     // position each bar 2px from each other bar
        });
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
    let animationSpeed = 2000;

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
