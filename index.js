import {bubbleSortAnimation} from './sortingAlgorithms/bubbleSort.js';
import {quickSortAnimation} from './sortingAlgorithms/quickSort.js';
import {mergeSortAnimation} from './sortingAlgorithms/mergeSort.js';
import {animateColor} from './utils.js';

window.addEventListener('DOMContentLoaded', () => {

    let defaultSize = 100;

    resetArray(defaultSize);

    let arraySizeSpeed = document.getElementById('arraySizeSpeed');
    arraySizeSpeed.addEventListener('input', (e) => {
        let value = document.getElementById('arraySizeSpeed').value;

        if (value < 6) {
            value = 6;
        }
        if (value > 100) {
            value = 100;
        }
        resetArray(value);
    })

    document.getElementById('resetArrayBtn').addEventListener('click', () => {resetArray(document.getElementById('arraySizeSpeed').value)});
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

function resetArray(size) {
    let array = generateRandomIntegers(size, 5, 600);

    localStorage.setItem('sortArray', JSON.stringify(array));

    let spaceBetweenBars = 2;
    let barWidth = Math.floor((1200 - (size * spaceBetweenBars))/size);    // size if the width of the bar
    let xPos = 0;
    let totalWidth = array.length * (barWidth + spaceBetweenBars);

    let sortingContainer = document.getElementById('sortingContainer');
    let nodes = sortingContainer.childNodes;

    if (nodes.length != size) {
        sortingContainer.innerHTML = '';

        array.forEach((el) => {
            sortingContainer.innerHTML += `<rect x=${xPos} height=${el} width=${barWidth} style='fill:black;' />`;
            xPos+=(barWidth+spaceBetweenBars);     // position each bar 2px from each other bar
        });

        sortingContainer.setAttribute('width', totalWidth);
    }
    else {
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
    let animationSpeed = 20;
    let size = sortArray.length;

    if (size < 15) {
        animationSpeed = 500;
    }
    else if (size > 15 && size < 25) {
        animationSpeed = 200;
    }
    else if (size > 25 && size < 50) {
        animationSpeed = 100;
    }

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
