import {animateColor, animateSize} from '../utils.js';


export function quickSortAnimation(array, speed) {
    let finalAnimation = quickSort(array);    
    let nodes = document.getElementById('sortingContainer').childNodes;
    let size = finalAnimation.length;
    let iteration = 0;
    let sync = 0;

    while(iteration < size) {
 
        setTimeout((iteration) => {

            switch (finalAnimation[iteration].op) {
                case 'pivot-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'orange');

                    break;
                case 'one-green':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');

                    break;
                case 'two-green-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');
                    animateColor(nodes[finalAnimation[iteration].second], 'green');

                break;
                case 'two-default-async':
                case 'two-default':
                    animateColor(nodes[finalAnimation[iteration].first], 'black');
                    animateColor(nodes[finalAnimation[iteration].second], 'black');

                    break;
                case 'one-default':
                case 'one-default-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'black');

                    break;
                case 'preSwap':
                    animateColor(nodes[finalAnimation[iteration].first], 'red');
                    animateColor(nodes[finalAnimation[iteration].second], 'red');

                    break;
                case 'swap':
                    let height1 = nodes[finalAnimation[iteration].first].getAttribute('height');
                    let height2 = nodes[finalAnimation[iteration].second].getAttribute('height');
                    animateSize(nodes[finalAnimation[iteration].first], height2);
                    animateSize(nodes[finalAnimation[iteration].second], height1);

                    break;
                case 'postSwap':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');
                    animateColor(nodes[finalAnimation[iteration].second], 'green');

                    break;
                case 'final':
                    animateColor(nodes[finalAnimation[iteration].first], 'purple');

                    break;
                case 'all-purple':
                    nodes.forEach((node) => {
                        animateColor(node, 'purple');
                    });
                    break;
                default:
                    iteration = 1000;
                    break;
            }

        }, (iteration - sync) * speed, iteration);

        if (finalAnimation[iteration].op === 'pivot-async' || finalAnimation[iteration].op === 'one-default-async' || finalAnimation[iteration].op === 'two-default-async') {
            sync++;
        }

        iteration++;
    }
}

function quickSort(array) {
    let animationQueue = [];

    quickSortHelper(array, 0, array.length-1, animationQueue);

    console.log(animationQueue);
    localStorage.setItem('sortArray', JSON.stringify(array));

    return animationQueue;
}

function quickSortHelper(array, start, end, animationQueue) {
    if (start == end) {
        animationQueue.push({
            op: 'final',
            first: start,
        });
    }
    if (start < end) {
        let pIndex = partition(array, start, end, animationQueue);

        quickSortHelper(array, start, pIndex-1, animationQueue);
        quickSortHelper(array, pIndex, end, animationQueue);
    }
}

function partition(array, lo, hi, animationQueue) {
    let pivotIndex = Math.floor((hi + lo) / 2)
    let pivot = array[pivotIndex];
    let i = lo;
    let j = hi;

    // async
    animationQueue.push({
        op: 'pivot-async',
        first: pivotIndex,
    }); 

    while(i <= j) {
        animationQueue.push({
            op: 'two-green-async',
            first: i,
            second: j,
        });
        while (array[i] < pivot) {
            //async
            animationQueue.push({
                op: 'one-default-async',
                first: i,
            });
            i++;
            animationQueue.push({
                op: 'one-green',
                first: i,
            });
        }
        while (array[j] > pivot) {
            //async
            animationQueue.push({
                op: 'one-default-async',
                first: j,
            });  
            j--;
            animationQueue.push({
                op: 'one-green',
                first: j,
            });
        }

        if (i < j) {
            animationQueue.push({
                op: 'preSwap',
                first: i,
                second: j,
            });
            animationQueue.push({
                op: 'swap',
                first: i,
                second: j,
            });
            animationQueue.push({
                op: 'postSwap',
                first: i,
                second: j,
            });

            //async
            animationQueue.push({
                op: 'two-default-async',
                first: i,
                second: j,
            });

            if (i === pivotIndex) {
                pivotIndex = j;
            }
            else if (j === pivotIndex) {
                pivotIndex = i;
            }
            // async
            animationQueue.push({
                op: 'pivot-async',
                first: pivotIndex,
            }); 

            // Swap
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;

            i++;
            j--;
        }
        else if (i === j) {
            //async
            animationQueue.push({
                op: 'two-default-async',
                first: i,
                second: j,
            });
            i++;
            j--;
        }
        else {
            //async
            animationQueue.push({
                op: 'two-default-async',
                first: i,
                second: j,
            });
        }
    }
    //async
    animationQueue.push({
        op: 'one-default-async',
        first: pivotIndex,
    });
    return i;
}
