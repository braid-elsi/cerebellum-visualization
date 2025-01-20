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
        color: [98, 104, 190],
        cellParams: [
            {
                id: "gc1",
                x: 200,
                y: 0.4,
                width: 20,
                numReceptors: 3,
            },
            {
                id: "gc2",
                x: 400,
                y: 0.1,
                width: 20,
                numReceptors: 3,
            },
            {
                id: "gc3",
                x: 460,
                y: 0.3,
                width: 20,
                numReceptors: 4,
            },
            {
                id: "gc4",
                x: 520,
                y: 0.1,
                width: 20,
                numReceptors: 4,
            },
            {
                id: "gc5",
                x: 580,
                y: 0.3,
                width: 20,
                numReceptors: 5,
            },
        ],
    },
    mossyFiberCells: {
        color: [44, 201, 255],
        cellParams: [
            {
                id: "mf1",
                x: 200,
                y: 0.5,
                width: 20,
                connectsTo: ["gc1"],
            },
            {
                id: "mf2",
                x: 400,
                y: 0.5,
                width: 20,
                connectsTo: ["gc2"],
            },
            {
                id: "mf3",
                x: 460,
                y: 0.5,
                width: 20,
                connectsTo: ["gc3"],
            },
            {
                id: "mf4",
                x: 520,
                y: 0.5,
                width: 20,
                connectsTo: ["gc4"],
            },
            {
                id: "mf5",
                x: 580,
                y: 0.5,
                width: 20,
                connectsTo: ["gc5"],
            },
        ],
    },
};
