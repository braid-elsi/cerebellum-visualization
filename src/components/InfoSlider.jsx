import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

const CustomDrawer = styled(Drawer)`
    .ant-drawer {
        font-family: "Montserrat";
    }

    .ant-drawer-body {
        padding: 20px 40px 20px 30px;
    }

    .ant-drawer-body p,
    .ant-drawer-body li,
    .ant-drawer-body h1,
    .ant-drawer-body h2,
    .ant-drawer-body h3 {
        font-family: "Montserrat";
    }

    .ant-drawer-body h1,
    .ant-drawer-body h2,
    .ant-drawer-body h3,
    .ant-drawer-body strong {
        font-weight: 600;
    }

    .ant-drawer-body p,
    .ant-drawer-body li {
        font-size: 0.95rem;
        line-height: 1.5rem;
    }

    .ant-drawer-body li {
        margin-bottom: 15px;
    }
`;

const DOCUMENTS = {
    pk: "Purkinje.md",
    gc: "Granule.md",
    dcn: "CerebellarNuclei.md",
    olive: "InferiorOlive.md",
    mf: "MossyFibers.md",
};

export default function InfoSlider({ neuron, isOpen, globals }) {
    const [open, setOpen] = useState(isOpen);
    const [content, setContent] = useState("# Hello world 123!");
    const size = "large"; // can be "default" or "large"

    useEffect(() => {
        console.log("setting open:", isOpen);
        setOpen(isOpen); // Always syncs the state with the prop
        getInfo();
    }, [isOpen, neuron]);

    const onClose = (ev) => {
        globals.isDrawerOpen = false;
        console.log("closing:", globals.isDrawerOpen);
        setOpen(false);
        if (ev) {
            ev.stopPropagation(); // don't interact with underlying canvas
        }
    };

    async function getInfo() {
        const url = DOCUMENTS[neuron.cellType];
        if (url) {
            const response = await fetch(`./markdown-files/${url}`);
            const text = await response.text();
            setContent(text);
        } else {
            setContent("# Some other Neuron");
        }
    }

    function getTitle() {
        if (neuron.cellType === "pk") {
            return "Purkinje Cell";
        }
        return "IDK!";
    }

    return (
        <>
            <CustomDrawer
                title={getTitle()}
                placement="left"
                size={size}
                onClose={onClose}
                open={open}
            >
                <ReactMarkdown>{content}</ReactMarkdown>
            </CustomDrawer>
        </>
    );
}
