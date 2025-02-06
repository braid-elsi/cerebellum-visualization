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

function branchFromJSON(data) {
    if (!data) return null;

    return new Branch({
        angle: data.angle,
        start: data.start,
        end: data.end,
        level: data.level,
        branches: data.branches ? data.branches.map(branchFromJSON) : null,
    });
}

function treeFromJSON(data) {
    let tree = new Tree(data.levels, data.maxBranches, 0, 0);
    tree.branches = data.branches.map(branchFromJSON);
    return tree;
}

function unflattenTree(flatBranches) {
    if (flatBranches.length === 0) return new Tree(0, 0, []);

    // Step 1: Group branches by their start positions
    let branchMap = new Map();
    for (let branch of flatBranches) {
        let key = JSON.stringify(branch.start);
        if (!branchMap.has(key)) {
            branchMap.set(key, []);
        }
        const args = {
            start: branch.start,
            end: branch.end,
            level: branch.level,
        };
        branchMap.get(key).push(new Branch(args));
    }

    // Step 2: Recursively build the tree
    function buildTree(branch) {
        let key = JSON.stringify(branch.end);
        if (branchMap.has(key)) {
            branch.branches = branchMap.get(key).map(buildTree);
            branch.terminal = null;
        }
        return branch;
    }

    // Step 3: Identify root branches (level 0) and construct the tree

    const rootBranches = flatBranches
        .filter((branch) => branch.level === 0)
        .map((branch) => {
            const args = {
                start: branch.start,
                end: branch.end,
                level: branch.level,
            };
            return new Branch(args);
        });
    const roots = rootBranches.map(buildTree);

    function getLevels() {
        return flatBranches
            .map((b) => b.level)
            .filter((level) => level !== undefined);
    }

    function getMaxBranches() {
        return 2;
        const branchLengths = flatBranches.map((b) =>
            b.branches ? b.branches.length : 0,
        );
        console.log(branchLengths);
        return Math.max(...branchLengths);
    }
    const tree = new Tree({
        levels: getLevels(),
        maxBranches: getMaxBranches(),
        branches: roots,
    });
    return tree;
}
