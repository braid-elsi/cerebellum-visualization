export default {
    layers: {
        brainstemLayer: {
            heightFraction: 0.15,
            label: "Brainstem / Spinal Cord",
            color: [248],
        },
        whiteMatterLayer: {
            heightFraction: 0.1,
            label: "White matter",
            color: [255],
        },
        granuleLayer: {
            heightFraction: 0.3,
            label: "Granule layer",
            color: [248],
        },
        purkinjeLayer: {
            heightFraction: 0.1,
            label: "Purkinje layer",
            color: [255],
        },
        molecularLayer: {
            heightFraction: 0.35,
            label: "Molecular layer",
            color: [248],
        },
    },
    granuleCells: {
        color: [98, 104, 190],
        label: {
            text: "Granule Cell",
            x: 660,
            y: 0.3,
        },
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
                y: 0.7,
                width: 20,
                numReceptors: 3,
            },
            {
                id: "gc3",
                x: 460,
                y: 0.4,
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
        label: {
            text: "Mossy Fiber",
            x: 250,
            y: 0.2,
        },
        cellParams: [
            {
                id: "mf1",
                x: 200,
                y: 0.5,
                width: 20,
                connectsTo: ["gc1", "gc2"],
            },
            {
                id: "mf5",
                x: 520,
                y: 0.5,
                width: 20,
                connectsTo: ["gc2", "gc3", "gc4", "gc5"],
            },
        ],
    },
    inferiorOlive: {
        id: "olive",
        label: {
            text: "Inferior Olive",
            x: 900,
            y: 0.5,
        },
        x: 1000,
        y: 0.5,
        color: [139, 123, 188],
        height: 60,
    },
    cerebellarNuclei: {
        id: "cerebellarNuclei",
        label: {
            text: "Cerebellar Nuclei",
            x: 800,
            y: 0.5,
            width: 100,
        },
        x: 800,
        y: 0.5,
        color: [222, 156, 145],
        height: 60,
    },
    purkinjeCell: {
        id: "purkinjeCell",
        x: 800,
        y: 0.5,
        yEnd: 0.05,
        width: 40,
        color: [254, 82, 0],
        connectsTo: ["cerebellarNuclei"],
    },
};
