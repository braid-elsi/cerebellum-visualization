export default {
    layers: {
        brainstemLayer: {
            heightFraction: 0.15,
            label: "Brainstem / Spinal Cord",
            color: [249, 242, 250],
        },
        whiteMatterLayer: {
            heightFraction: 0.1,
            label: "White matter",
            color: [255, 255, 255],
        },
        granuleLayer: {
            heightFraction: 0.3,
            label: "Granule layer",
            color: [249, 242, 250],
        },
        purkinjeLayer: {
            heightFraction: 0.1,
            label: "Purkinje layer",
            color: [255, 255, 255],
        },
        molecularLayer: {
            heightFraction: 0.35,
            label: "Molecular layer",
            color: [249, 242, 250],
        },
    },
    granuleCells: {
        numCells: 5,
        distanceBetweenCells: 110,
        minWidth: 10,
        maxWidth: 50,
        minReceptors: 3,
        maxReceptors: 6,
        color: [98, 104, 190],
    },
};
