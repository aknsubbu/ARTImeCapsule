import React from "react";
import {
  ViroNode,
  ViroText,
  ViroQuad,
  ViroMaterials,
} from "@viro-community/react-viro";

// Use ViroMaterials to define colors
ViroMaterials.createMaterials({
  whitePaper: {
    diffuseColor: "#FFFFFF",
  },
  grayEdge: {
    diffuseColor: "#E0E0E0",
  },
});

const ARNote: React.FC = () => {
  return (
    <ViroNode
      position={[0, 0, -1]}
      rotation={[-15, 0, 0]}
      scale={[0.3, 0.3, 0.01]}
    >
      {/* Note body */}
      <ViroQuad height={10} width={7} materials={["whitePaper"]} />

      {/* Note top edge */}
      <ViroNode position={[0, 5, 0.01]}>
        <ViroQuad height={0.5} width={7} materials={["grayEdge"]} />
      </ViroNode>

      {/* Note bottom edge */}
      <ViroNode position={[0, -5, 0.01]}>
        <ViroQuad height={0.5} width={7} materials={["grayEdge"]} />
      </ViroNode>

      {/* Note left edge */}
      <ViroNode position={[-3.5, 0, 0.01]} rotation={[0, 0, 90]}>
        <ViroQuad height={0.5} width={10} materials={["grayEdge"]} />
      </ViroNode>

      {/* Note right edge */}
      <ViroNode position={[3.5, 0, 0.01]} rotation={[0, 0, 90]}>
        <ViroQuad height={0.5} width={10} materials={["grayEdge"]} />
      </ViroNode>

      {/* NEXT Text */}
      <ViroText
        text="NEXT"
        scale={[1, 1, 1]}
        position={[0, 0, 0.02]}
        style={{
          color: "#000000",
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
        }}
        width={7}
        height={2}
      />
    </ViroNode>
  );
};

export default ARNote;
