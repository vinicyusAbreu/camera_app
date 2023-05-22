import { Camera, CameraType } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
} from "react-native";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

import * as Location from "expo-location";

const MyCamera = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);

  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Solicitação de permissões...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        A permissão para a câmera não foi concedida. Altere isso nas
        configurações.
      </Text>
    );
  }

  const takePhoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);

    if (photo) {
      let sharePic = () => {
        shareAsync(photo.uri).then(() => {
          setPhoto(null);
        });
      };

      let savePhoto = () => {
        MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
          setPhoto(null);
        });
      };

      return (
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.preview}
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          />
          <Button title="Compartilhar" onPress={sharePic} />
          {hasMediaLibraryPermission ? (
            <Button title="Salvar" onPress={savePhoto} />
          ) : (
            ""
          )}

          <Button
            title="Descartar"
            onPress={() => {
              setPhoto(null);
            }}
          />
        </SafeAreaView>
      );
    }
  };

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Tirar foto" onPress={takePhoto} />
      </View>
    </Camera>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
});

export default MyCamera;
