import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
// import PurkinjeInfo from "./PurkinjeInfo";
import ReactMarkdown from "react-markdown";

export default function InfoSlider({ neuron, isOpen, globals }) {
    const [open, setOpen] = useState(isOpen);
    const size = "large"; // can be "default" or "large"

    useEffect(() => {
        console.log("setting open:", isOpen);
        setOpen(isOpen); // Always syncs the state with the prop
    }, [isOpen]);

    const onClose = (ev) => {
        globals.isDrawerOpen = false;
        console.log("closing:", globals.isDrawerOpen);
        setOpen(false);
        if (ev) {
            ev.stopPropagation(); // don't interact with underlying canvas
        }
    };

    function getInfo() {
        if (neuron.cellType === "pk") {
            return <ReactMarkdown># Hello world!</ReactMarkdown>;
        }
        return "IDK!";
    }

    function getTitle() {
        if (neuron.cellType === "pk") {
            return "Purkinje Cell";
        }
        return "IDK!";
    }

    return (
        <>
            <Drawer
                title={getTitle()}
                placement="left"
                size={size}
                onClose={onClose}
                open={open}
            >
                {getInfo()}
            </Drawer>
        </>
    );
}
