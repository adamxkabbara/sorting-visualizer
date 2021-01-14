export function animateColor(node, color) {
    node.setAttribute('style', `fill: ${color}`);
}

export function animateSize(node, height) {
    node.setAttribute('height', height);
}