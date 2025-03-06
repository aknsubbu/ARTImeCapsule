import React from "react";
import { View, Text } from "react-native";
import { ViroARScene, ViroARSceneNavigator } from "@viro-community/react-viro";
import ARNote from "../../components/ARNote";

const ARTestScene: React.FC = () => {
  return (
    <ViroARScene>
      <ARNote />
    </ViroARScene>
  );
};

const ARTestingScreen: React.FC = () => {
  return (
    <ViroARSceneNavigator
      initialScene={{
        scene: () => <ARTestScene />,
      }}
      style={{ flex: 1 }}
    />
  );
};

export default ARTestingScreen;
