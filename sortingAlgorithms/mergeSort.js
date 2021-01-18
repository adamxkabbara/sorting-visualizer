import {animateColor, animateSize} from '../utils.js';

export function mergeSortAnimation(array, speed) {
    let finalAnimation = getMergeSortAnimations(array);    
    let nodes = document.getElementById('sortingContainer').childNodes;
    let size = finalAnimation.length;
    let iteration = 0;
    let sync = 0;
console.log(finalAnimation);
    while(iteration < size) {
 
        setTimeout((iteration) => {

            switch (finalAnimation[iteration].op) {
                case 'one-green':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');

                    break;
                case 'two-green':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');
                    animateColor(nodes[finalAnimation[iteration].second], 'green');

                break;
                case 'two-default-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'black');
                    animateColor(nodes[finalAnimation[iteration].second], 'black');

                    break;
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
                default:
                    iteration = 10000;
                    break;
            }

        }, (iteration - sync) * speed, iteration);

        if (finalAnimation[iteration].op === 'pivot-async' || finalAnimation[iteration].op === 'one-default-async' || finalAnimation[iteration].op === 'two-default-async') {
            sync++;
        }

        iteration++;
    }
}

function getMergeSortAnimations(array) {
    let animationQueue = [];

    mergeSort(array, 0, array.length - 1, animationQueue);

    localStorage.setItem('sortArray', JSON.stringify(array));
    console.log(array);
    return animationQueue;
}

function merge(array, l, m, r, animationQueue) {
    let n1 = m - l + 1;
    let n2 = r - m;

    let left = [];
    let right = [];

    let i = 0;
    let j = 0;
    let k = l;

    for (i = 0; i < n1; i++) {
        left[i] = {
            index: l + i,
            value: array[l + i],
        };
    }
    for (j = 0; j < n2; j++) {
        right[j] = {
            index: m + j + 1,
            value: array[m + j + 1],
        };
    }

    i = 0;
    j = 0;

    while (i < n1 && j < n2) {
        animationQueue.push({
            op: 'two-green',
            first: left[i].index,
            second: right[j].index,
        });
        if (left[i].value > right[j].value) {
            animationQueue.push({
                op: 'preSwap',
                first: left[i].index,
                second: right[j].index,
            });
            animationQueue.push({
                op: 'swap',
                first: left[i].index,
                second: right[j].index,
            });
            animationQueue.push({
                op: 'postSwap',
                first: left[i].index,
                second: right[j].index,
            });

            //async
            animationQueue.push({
                op: 'two-default-async',
                first: left[i].index,
                second: right[j].index,
            });

            array[k] = right[j].value;
            j++;
        }
        else {
            //async
            animationQueue.push({
                op: 'two-default-async',
                first: left[i].index,
                second: right[j].index,
            });
            array[k] = left[i].value;
            i++;
        }
        k++;
    }

    while (i < n1) {
        array[k] = left[i].value;
        k++;
        i++;
    }
    while (j < n2) {
        array[k] = right[j].value;
        k++;
        j++;
    }
}

function mergeSort(array, l, r, animationQueue) {
    if (l >= r) return;

    let m = Math.floor(l + (r - l) / 2);

    mergeSort(array, l, m, animationQueue);
    mergeSort(array, m + 1, r, animationQueue);
    merge(array, l, m, r, animationQueue);
}
