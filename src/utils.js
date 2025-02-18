import { JSONTreeLoader } from "./tree.js";

export function getRandomItems(arr, n) {
    if (n > arr.length) {
        throw new Error("n cannot be larger than the array length");
    }

    let shuffled = arr.slice(); // Copy the array to avoid modifying the original
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled.slice(0, n); // Take the first n elements
}

export function getRandomSign() {
    return Math.random() < 0.5 ? -1 : 1;
}
export function weightedRandomInt(low, high, weightFactor = 4) {
    if (low >= high) {
        return high;
    }
    const numbers = [];
    const weights = [];

    for (let num = low; num <= high; num++) {
        numbers.push(num);
        weights.push(Math.pow(weightFactor, (num - low) / (high - low)));
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const randomValue = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < numbers.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue < cumulativeWeight) {
            return numbers[i];
        }
    }
}

export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function dist1(x1, y1, x2, y2) {
    const point1 = [x1, y1];
    const point2 = [x2, y2];
    return Math.sqrt(
        point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0),
    );
}

export function logBase(x, base) {
    return Math.log(x) / Math.log(base);
}

export async function loadTreeFromFile(url) {
    const response = await fetch(url);
    const treeJSON = await response.json();
    return JSONTreeLoader.fromJSON(treeJSON);
}
