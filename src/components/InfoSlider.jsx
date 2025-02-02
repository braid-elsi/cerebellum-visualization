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

    blockquote {
        background: #f0f0f0;
        padding: 10px 30px;
        margin: auto 0;
    }
`;

const REFERENCES = {
    pk: {
        docs: "Purkinje.md",
        title: "Purkinje Cell",
    },
    gc: {
        docs: "Granule.md",
        title: "Granule Cell",
    },
    dcn: {
        docs: "CerebellarNuclei.md",
        title: "Deep Cerebellar Nuclei Cell",
    },
    olive: {
        docs: "InferiorOlive.md",
        title: "Inferior Olive",
    },
    mf: {
        docs: "MossyFibers.md",
        title: "MossyFibers",
    },
};

export default function InfoSlider({ neuron, isOpen, globals }) {
    const [open, setOpen] = useState(isOpen);
    const [content, setContent] = useState("# Hello world 123!");
    const size = "large"; // can be "default" or "large"
    const disclaimer = `
> ## Note: Work in Progress
>These are notes that need to be reworked (and verified) as as to be useful to others.
    `;

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
        const entry = REFERENCES[neuron.cellType];
        if (entry) {
            const url = entry.docs;
            const response = await fetch(`./documentation/${url}`);
            const text = await response.text();
            setContent(text);
        } else {
            setContent("# Documentation Not Found");
        }
    }

    function getTitle() {
        const entry = REFERENCES[neuron.cellType];
        if (entry) {
            return entry.title;
        } else {
            return "Cell not found";
        }
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
                <ReactMarkdown>{disclaimer + "\n" + content}</ReactMarkdown>
            </CustomDrawer>
        </>
    );
}
