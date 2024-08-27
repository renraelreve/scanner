import { StyleSheet, Text, View, Alert, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { CameraView, Camera } from "expo-camera";
import { useEffect, useState } from "react";

export default function App() {
  // For tracking the scanned status
  const [scanned, setScanned] = useState(false);
  // For tracking whether it is in scanning mode
  const [isScanningMode, setIsScanningMode] = useState(false);
  // For tracking the permission status of the camera
  const [hasPermission, setHasPermission] = useState(null);
  // For tracking the scanned data
  const [scannedData, setScannedData] = useState([]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      // Set the hasPermission state based on the status
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Add the scanned data to the scannedData array
    setScannedData((prevData) => [...prevData, { type, data, id: Date.now() }]);
    Alert.alert(
      "Scan Complete",
      `Bar code with type ${type} and data ${data} has been scanned.`,
      [
        {
          text: "OK",
          onPress: () => setIsScanningMode(false),
        },
        {
          text: "Scan Again",
          onPress: () => setScanned(false),
        },
      ]
    );
  };

  const handleStartScanning = () => {
    if (!hasPermission) {
      Alert.alert("No access to camera. Please grant access in your settings!");
      return;
    }
    setIsScanningMode(true);
    setScanned(false);
  };

  // If scanned, then onBarCodeScanned = undefined to stop the scanning
  // Else, pass the callback function to handle the scanning
  const onBarCodeScanned = scanned ? undefined : handleBarCodeScanned;

  if (!isScanningMode) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Bar Code Scanner Demo</Text>
        <Button title="Start Scanning" onPress={handleStartScanning} />
        {scannedData.map((item) => (
          <Text key={item.id}>
            {item.type} - {item.data}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={onBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Overlay to guide users where to position the barcode */}
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            Align the barcode within the frame to scan
          </Text>
        </View>
      </CameraView>
      <View style={styles.backButtonContainer}>
        <Button title="< Back" onPress={() => setIsScanningMode(false)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  backButtonContainer: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
  },
});
