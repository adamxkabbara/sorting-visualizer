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
    let array = generateRandomIntegers(2, 5, 600);

    localStorage.setItem('sortArray', JSON.stringify(array));

    let barWidth = 4    // size if the width of the bar
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
    let animationQueue = [];
    let animationSpeed = 100;

    switch (algorithm) {
        case 'bubble':
            animationQueue = bubbleSortAnimation(sortArray);
            break;
        case 'quick':
            animationQueue = quickSort(sortArray);
            break;
        default:
            break;
    }

    let nodes = document.getElementById('sortingContainer').childNodes;
    let size = animationQueue.length;
    let index = 0;
    let iteration = 0;
    console.log(size);
    
    while(iteration < size) {
        console.log(animationQueue[index]);

        setTimeout(() => {

            switch (animationQueue[index]) {
                case 'compare':
                    animateColor(nodes[animationQueue[index+1]], 'green');
                    animateColor(nodes[animationQueue[index+2]], 'green');
                    index = index + 3;

                    break;
                case 'preSwap':
                    animateColor(nodes[animationQueue[index+1]], 'red');
                    animateColor(nodes[animationQueue[index+2]], 'red');

                    index = index + 3;
                    break;
                case 'swap':
                    let height1 = nodes[animationQueue[index+1]].getAttribute('height');
                    let height2 = nodes[animationQueue[index+2]].getAttribute('height');
                    animateSize(nodes[animationQueue[index+1]], height2);
                    animateSize(nodes[animationQueue[index+2]], height1);

                    index = index + 3;
                    break;
                case 'postSwap':
                    animateColor(nodes[animationQueue[index+1]], 'black');
                    animateColor(nodes[animationQueue[index+2]], 'black');

                    index = index + 3;
                    break;
                case 'final':
                    animateColor(nodes[animationQueue[index+1]], 'purple');

                    index = index + 2;
                    break;
                default:
                    index = 1000;
                    break;
            }

        }, iteration * animationSpeed);

        iteration++;
    }

    /*for (let index = 0; index < animationQueue.length; index++) {
        setTimeout(() => {
            animationQueue[index].call();
        }, index * 10);
    }*/
}

function quickSort(array) {
    let animationQueue = [];

    quickSortHelper(array, 0, array.length-1, animationQueue);
    
    localStorage.setItem('sortArray', JSON.stringify(array));

    return animationQueue;
}

function quickSortHelper(array, start, end, animationQueue) {
    if (start < end) {
        let pivotIndex = partition(array, start, end, animationQueue);
        //animationQueue.push('pivotPoint');
        //animationQueue.push(pivotIndex);

        console.log('pivotIndex', pivotIndex, 'array', array);

        quickSortHelper(array, start, pivotIndex-1, animationQueue);
        quickSortHelper(array, pivotIndex+1, end, animationQueue);
    }
}

function partition(array, start, end, animationQueue) {
    let pivot = array[end];
    let partitionIndex = start;
    let animation = new Animation();

    for (let i = start; i < end; i++) {

        animationQueue.push('compare');
        animationQueue.push(i);
        animationQueue.push(end);

        if (array[i] <= pivot) {
            // swap animation

            animationQueue.push('swap');
            animationQueue.push(partitionIndex);
            animationQueue.push(i);

            // Swap
            let temp = array[partitionIndex];
            array[partitionIndex] = array[i];
            array[i] = temp;

            partitionIndex++;
        }
    }

    animationQueue.push('swap');
    animationQueue.push(partitionIndex);
    animationQueue.push(end);

    // Swap
    let temp = array[partitionIndex];
    array[partitionIndex] = array[end];
    array[end] = temp;

    return partitionIndex;
}
function bubbleSortAnimation(array) {
    let animations = bubbleSort(array);
    let size = animations.length;
    let finalAnimation = [];

    let i = 0;
    while (i < size) {
        
        switch (animations[i]) {
            case 'compare':
                finalAnimation.push('compare');
                finalAnimation.push(animations[i-1]);
                finalAnimation.push(animations[i-2]);
                i+=3;
                break;
            case 'swap':
                finalAnimation.push('preSwap');
                finalAnimation.push(animations[i-1]);
                finalAnimation.push(animations[i-2]);
                finalAnimation.push('swap');
                finalAnimation.push(animations[i-1]);
                finalAnimation.push(animations[i-2]);
                finalAnimation.push('postSwap');
                finalAnimation.push(animations[i-1]);
                finalAnimation.push(animations[i-2]);
                i+=3;
                break;
            case 'final':
                finalAnimation.push('final');
                finalAnimation.push(animations[i-1]);
                i+=2;
                break;
            default:
                break;
        }
    }
    return finalAnimation;
}

function bubbleSort(sortArray) {
    let nodes = document.getElementById('sortingContainer').childNodes;
    //let animation = new Animation();
    let animationQueue = [];
    let size = sortArray.length;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - i - 1; j++) {

            //animationQueue.push({call: () => animation.compare(nodes[j], nodes[j+1])});
            animationQueue.push('compare');
            animationQueue.push(j);
            animationQueue.push(j+1);

            if (sortArray[j] > sortArray[j+1]) {
                // swap
                //animationQueue.push({call: ()=>animation.swap(nodes[j], nodes[j+1])});
                animationQueue.push('swap');
                animationQueue.push(j);
                animationQueue.push(j+1);

                let temp = sortArray[j];
                sortArray[j] = sortArray[j+1];
                sortArray[j+1] = temp;

            }

            //animationQueue.push({call: () => animation.compareDone(nodes[j], nodes[j+1])});
        }
        //animationQueue.push({call: () => animation.finalPosition(nodes[size - i - 1])});
        animationQueue.push('final');
        animationQueue.push(size - i - 1);
    }
    localStorage.setItem('sortArray', JSON.stringify(sortArray));

    return animationQueue;
}

function animateColor(node, color) {
    console.log(node);
    
    node.setAttribute('style', `fill: ${color}`);
}

function animationSize(node, height) {
    node2.setAttribute('height', height);
}

/*
class Animation {
    
    compare(node1, node2) {
        node1.setAttribute('style', 'fill: green');
        node2.setAttribute('style', 'fill: green');
    }

    swap(node1, node2) {
        let tempN1 = node1.getAttribute('height');
        node1.setAttribute('style', 'fill: red');
        node2.setAttribute('style', 'fill: red');
        node1.setAttribute('height', node2.getAttribute('height'));
        node2.setAttribute('height', tempN1);
    }

    compareDone(node1, node2) {
        node1.setAttribute('style', 'fill: black');
        node2.setAttribute('style', 'fill: black');
    }

    finalPosition(node) {
        node.setAttribute('style', 'fill: purple');
    }
}
*/
