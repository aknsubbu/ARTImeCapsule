// import React, { useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { Camera } from "expo-camera";
// import { useTheme } from "@/context/ThemeContext";
// // import { ARView } from "@/components/ARView";
// // import { CapsuleForm } from "@/components/CapsuleForm";

// export default function ARCameraScreen() {
//   const { colors } = useTheme();
//   const [hasPermission, setHasPermission] = React.useState<boolean | null>(
//     null
//   );
//   const [isCreating, setIsCreating] = useState(false);

//   React.useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }

//   if (hasPermission === false) {
//     return (
//       <View
//         className="flex-1 justify-center items-center"
//         style={{ backgroundColor: colors.background }}
//       >
//         <Text style={{ color: colors.text }}>No access to camera</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1">
//       {isCreating ? (
//         <CapsuleForm onClose={() => setIsCreating(false)} />
//       ) : (
//         <ARView onCreatePress={() => setIsCreating(true)} />
//       )}
//     </View>
//   );
// }
