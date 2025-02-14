import React from "react";
import ReactMarkdown from "react-markdown";

const markdownText = `
# Purkinje Cells
Cerebellar Purkinje cells are inhibitory neurons, meaning that in
their presynaptic role, they release the neurotransmitter GABA,
which inhibits the activity of their target neurons. 

## Purkinje Cells as a Postsynaptic Neuron 🛑 (Receiving Signals) 
* Purkinje cells receive excitatory input from two main sources: 
    * Climbing fibers (from the inferior olive) → form powerful, one-to-one synapses.
    * Parallel fibers (from granule cells) → form weaker, many-to-one synapses. 
  These excitatory inputs influence the firing patterns of
the Purkinje cells. 

## Purkinje Cells as a Presynaptic Neuron 🛑(Sending Signals) 
Purkinje cells send inhibitory output to the deep
cerebellar nuclei (DCN). They release GABA, which inhibits the DCN
neurons and modulates motor output. Summary Postsynaptic Role:
Receives excitatory input from climbing and parallel fibers.
Presynaptic Role: Sends inhibitory output to the deep cerebellar
nuclei. Thus, Purkinje cells are excitatory in their inputs but
inhibitory in their outputs.
`;

export default function PurkinjeInfo({ neuron }) {
    return <ReactMarkdown>{markdownText}</ReactMarkdown>;
}
