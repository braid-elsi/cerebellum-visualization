import Neuron from "./base.js";
import Axon from "./axon.js";
import Dendrites from "./dendrites.js";
import { Branch } from "../branch.js";
import { Tree, PurkinjeTreeGenerator, PurkinjeTreeLoader } from "../tree.js";
import { Receptor } from "../synapses.js";

export default class PurkinjeNeuron extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.type = "purkinje";
    }

    async generateDendrites(numBranches = 2, maxLevel = 9) {
        // Generate a dendritic tree based on number of connections
        // const tree = PurkinjeTreeGenerator.generate({
        //     x: this.x,
        //     y: this.y,
        //     numBranches,
        //     maxLevel: 4,
        //     numBranches: numBranches,
        //     angle: -Math.PI / 2,
        //     yMax: this.y,
        // });

        const tree = await PurkinjeTreeLoader.loadTreeFromJSON(
            "./180524_E1_KO.json",
            {
                offsetX: this.x,
                offsetY: this.y,
                scaleX: 9,
                scaleY: 5,
            },
        );

        const dendriteOptions = { 
            neuron: this, 
            tree, 
            receptorOptions: {
                width: 8, 
                height: 3, 
                doRotation: true,
                color: this.color
            } 
        }
        this.dendrites = new Dendrites(dendriteOptions);
    }

    generateAxon() {
        const vertical = new Branch({
            start: { x: this.x, y: this.y },
            end: { x: this.x, y: this.y + 650 },
            level: 0,
            parent: null,
        });

        this.axon = new Axon({ neuron: this, tree: new Tree([vertical]) });
    }

    addReceptorToBranch(currentBranch, point) {
        // Split the branch at the intersection point
        const newBranch = new Branch({
            start: point,
            end: { x: point.x, y: point.y },
            level: currentBranch.level + 1,
            parent: currentBranch,
            branches: null,
        });
        currentBranch.attachBranchAtPoint(point, newBranch);

        // Create receptor
        const receptor = new Receptor({
            width: 0,
            height: 0,
            branch: newBranch,
            color: this.color,
        });
        this.dendrites.addReceptor(receptor);

        return receptor;
    }

    // Helper method to find all intersection points between a granule cell and this Purkinje cell
    findAllIntersections(granuleCell) {
        const intersections = [];
        for (let gcBranch of granuleCell.axon.tree.getAllBranches()) {
            const branchIntersections = this.dendrites.tree.findIntersectionsWithExternalBranch(gcBranch);
            intersections.push(...branchIntersections.map(entry => ({
                gcBranch,
                pkBranch: entry.branch,
                point: entry.intersectionPoint
            })));
        }
        return intersections;
    }

    // Helper method to sort intersections from branch tips toward roots.
    // This is important because as we're adding new terminal branches to the granule
    // cell's axon, we need to do it in the correct order (from furthest away to closest)
    // otherwise the parent-child relationships of the axon branches will be all messed up.
    sortIntersectionsByDistance(intersections) {
        return intersections.sort((a, b) => {
            const aDistFromEnd = Math.hypot(
                a.gcBranch.end.x - a.point.x,
                a.gcBranch.end.y - a.point.y
            );
            const bDistFromEnd = Math.hypot(
                b.gcBranch.end.x - b.point.x,
                b.gcBranch.end.y - b.point.y
            );
            return aDistFromEnd - bDistFromEnd;
        });
    }

    // Helper method to create a single connection at an intersection point
    createConnection(granuleCell, intersection) {
        const { gcBranch, pkBranch, point } = intersection;
        try {
            const terminal = granuleCell.addTerminalToBranch(gcBranch, point);
            const receptor = this.addReceptorToBranch(pkBranch, point);

            if (!terminal || !receptor) {
                console.error('Failed to create terminal or receptor');
                return false;
            }

            receptor.setTerminal(terminal);
            terminal.setReceptor(receptor);
            return true;
        } catch (error) {
            console.error('Error creating connection:', error);
            return false;
        }
    }

    connectWithGranuleCells(granuleCells) {
        let totalConnections = 0;
        
        for (const granuleCell of granuleCells) {
            // Find and sort all possible connection points
            const intersections = this.findAllIntersections(granuleCell);
            const sortedIntersections = this.sortIntersectionsByDistance(intersections);

            // Create connections at each intersection point
            let connections = 0;
            for (const intersection of sortedIntersections) {
                if (this.createConnection(granuleCell, intersection)) {
                    connections++;
                }
            }

            console.log(`Connections made with granule cell: ${connections}`);
            totalConnections += connections;
        }
        return totalConnections;
    }

}
