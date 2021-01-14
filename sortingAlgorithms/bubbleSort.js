import {animateColor, animateSize} from '../utils.js';

export function bubbleSortAnimation(array, speed) {
    let finalAnimation = bubbleSort(array);    
    let nodes = document.getElementById('sortingContainer').childNodes;
    let size = finalAnimation.length;
    let iteration = 0;
    let sync = 0;

    while(iteration < size) {
 
        setTimeout((iteration) => {

            switch (finalAnimation[iteration].op) {
                case 'compare':
                    animateColor(nodes[finalAnimation[iteration].first], 'green');
                    animateColor(nodes[finalAnimation[iteration].second], 'green');

                    break;
                case 'doneCompare':
                    animateColor(nodes[finalAnimation[iteration].first], 'black');
                    animateColor(nodes[finalAnimation[iteration].second], 'black');

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
                case 'all-green':
                    nodes.forEach((node) => {
                        animateColor(node, 'green');
                    });
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

        if (finalAnimation[iteration].op === 'doneCompare' || finalAnimation[iteration].op === 'final') {
            sync++;
        }

        iteration++;
    }
}

function bubbleSort(sortArray) {
    let animationQueue = [];
    let size = sortArray.length;
    let flag = false;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - i - 1; j++) {
            animationQueue.push({
                op: 'compare',
                first: j,
                second: j+1,
            });

            if (sortArray[j] > sortArray[j+1]) {
                flag = true; // making a swap so list is still not ordered.
                // swap
                animationQueue.push({
                    op: 'preSwap',
                    first: j,
                    second: j+1,
                });
                animationQueue.push({
                    op: 'swap',
                    first: j,
                    second: j+1,
                });
                animationQueue.push({
                    op: 'postSwap',
                    first: j,
                    second: j+1,
                });

                let temp = sortArray[j];
                sortArray[j] = sortArray[j+1];
                sortArray[j+1] = temp;
            }
            animationQueue.push({
                op: 'doneCompare',
                first: j,
                second: j+1,
            });
        }
        if (!flag) {
            // list is all ordered, no need to keep checking.
            animationQueue.push({
                op: 'all-green',
            });

            animationQueue.push({
                op: 'all-purple',
            });

            break;          
        }
        animationQueue.push({
            op: 'final',
            first: size - i - 1,
        });

    }
    localStorage.setItem('sortArray', JSON.stringify(sortArray));

    return animationQueue;
}