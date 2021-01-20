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
                case 'two-green':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');
                    animateColor(nodes[finalAnimation[iteration].second], 'green');

                break;
                case 'two-red':
                case 'two-red-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'red');
                    animateColor(nodes[finalAnimation[iteration].second], 'red');

                break;
                case 'two-default-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'black');
                    animateColor(nodes[finalAnimation[iteration].second], 'black');

                    break;
                case 'swap-async':
                    let height1 = nodes[finalAnimation[iteration].first].getAttribute('height');
                    let height2 = nodes[finalAnimation[iteration].second].getAttribute('height');
                    animateSize(nodes[finalAnimation[iteration].first], height2);
                    animateSize(nodes[finalAnimation[iteration].second], height1);

                    break;
                case 'set-height-async':
                animateSize(nodes[finalAnimation[iteration].index], finalAnimation[iteration].value);

                break;
                case 'all-green':
                    nodes.forEach((node) => {
                        animateColor(node, 'green');
                    });
                    break;
                case 'all-purple-async':
                    nodes.forEach((node) => {
                        animateColor(node, 'purple');
                    });
                    break;
                case 'final-async':
                    animateColor(nodes[finalAnimation[iteration].first], 'purple');

                    break;
                default:
                    iteration = 10000;
                    break;
            }

        }, (iteration - sync) * speed, iteration);

        if (finalAnimation[iteration].op === 'final-async' ||
            finalAnimation[iteration].op === 'all-purple-async' || 
            finalAnimation[iteration].op === 'two-red-async' || 
            finalAnimation[iteration].op === 'set-height-async' || 
            finalAnimation[iteration].op === 'pivot-async' || 
            finalAnimation[iteration].op === 'swap-async' || 
            finalAnimation[iteration].op === 'one-default-async' || 
            finalAnimation[iteration].op === 'two-default-async') {
            sync++;
        }

        iteration++;
    }
}

function getMergeSortAnimations(array) {
    let animationQueue = [];
    let isFinal = false;

    mergeSort(array, 0, array.length - 1, animationQueue, isFinal);

    localStorage.setItem('sortArray', JSON.stringify(array));

    return animationQueue;
}

function merge(array, l, m, r, animationQueue, isFinal) {
    let i = l;
    let j = m + 1;
    let mid = m;

    // If the direct merge is already sorted 
    if (array[mid] <= array[j]) { 
        animationQueue.push({
            op: 'two-green',
            first: mid,
            second: j,
        });
        //async
        animationQueue.push({
            op: 'two-default-async',
            first: mid,
            second: j,
        });
        if (isFinal) {
            animationQueue.push({
                op: 'all-green',
            });
            animationQueue.push({
                op: 'all-purple-async',
            });
        }

        return; 
    }

    while (i <= mid && j <= r) {
        animationQueue.push({
            op: 'two-green',
            first: i,
            second: j,
        });
        if (array[i] > array[j]) {

            animationQueue.push({
                op: 'two-red',
                first: i,
                second: j,
            });

            let value = array[j];
            let index = j;

            // Shift all the elements in subset right by 1.
            while (index != i) {
                animationQueue.push({
                    op: 'swap-async',
                    first: index,
                    second: index-1,
                });

                array[index] = array[index - 1];
                index--;
            }
            
            array[i] = value;

            animationQueue.push({
                op: 'two-default-async',
                first: i,
                second: j,
            });
            animationQueue.push({
                op: 'two-red-async',
                first: i,
                second: i+1,
            });
            animationQueue.push({
                op: 'set-height-async',
                index: i,
                value: value,
            });
            animationQueue.push({
                op: 'two-green',
                first: i,
                second: i+1,
            });

            //async
            animationQueue.push({
                op: 'two-default-async',
                first: i,
                second: i+1,
            });

            if (isFinal) {
                //async
                animationQueue.push({
                    op: 'final-async',
                    first: i,
                });
            }

            // Update all the pointers 
            i++;
            j++;
            mid++;
        }
        else {
            //async
            animationQueue.push({
                op: 'two-default-async',
                first: i,
                second: j,
            });

            if (isFinal) {
                //async
                animationQueue.push({
                    op: 'final-async',
                    first: i,
                });
            }
            i++;
        }
    }
    if (isFinal) {
        animationQueue.push({
            op: 'all-green',
        });
        //async
        animationQueue.push({
            op: 'all-purple-async',
        });
    }
}

function mergeSort(array, l, r, animationQueue, isFinal) {
    if (l >= r) return;

    let m = Math.floor(l + (r - l) / 2);

    mergeSort(array, l, m, animationQueue, isFinal);
    mergeSort(array, m + 1, r, animationQueue, isFinal);

    isFinal = (m === Math.floor((array.length - 1) / 2))

    merge(array, l, m, r, animationQueue, isFinal);
}
