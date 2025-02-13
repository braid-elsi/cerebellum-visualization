function getRandomItems(arr, n) {
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function logBase(x, base) {
    return Math.log(x) / Math.log(base);
}

async function loadTreeFromFile(url) {
    const response = await fetch(url);
    const treeJSON = await response.json();
    return JSONTreeLoader.fromJSON(treeJSON);
}
