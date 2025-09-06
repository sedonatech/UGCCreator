import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import analytics from "@react-native-firebase/analytics";
import { nanoid } from "nanoid/non-secure";
import ImagePicker from "react-native-image-crop-picker";
import { stat } from "react-native-fs";
import { Alert } from "react-native";


export type SampleWork = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  coverUrl: string;
  socialUrl?: string;
  isFeatured: boolean;
  showcaseOptIn: boolean;
  visibility: "public" | "private";
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
  rand: number;
};

export async function pickCoverImage(): Promise<string | null> {
    try {
      const res = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        compressImageQuality: 0.8,
        compressImageMaxWidth: 1080,
        compressImageMaxHeight: 1080,
        mediaType: "photo",
        forceJpg: true,
      });
  
      if (!res?.path) return null;
  
      const fileStats = await stat(res.path);
      const fileSizeInMB = fileStats.size / (1024 * 1024);
  
      if (fileSizeInMB > 3) {
        Alert.alert(
          "Image Too Large",
          "Please select an image under 3 MB for upload."
        );
        return null;
      }
  
      return res.path;
    } catch (err) {
      console.log("Image picker cancelled", err);
      return null;
    }
  }


// --- Upload cover to Storage ---
export async function uploadCover(
  uri: string,
  ownerId: string,
  sampleId?: string
): Promise<string> {
  const id = sampleId || nanoid();
  const ref = storage().ref(`sampleWorks/${ownerId}/${id}.jpg`);
  await ref.putFile(uri, { contentType: "image/jpeg" });
  return await ref.getDownloadURL();
}

// --- Create a sample ---
export async function createSample(
  input: Omit<SampleWork, "id" | "createdAt" | "updatedAt">
) {
  const col = firestore().collection("sampleWorks");
  const now = firestore.FieldValue.serverTimestamp();
  const docRef = await col.add({
    ...input,
    createdAt: now,
    updatedAt: now,
  });

  // log analytics
  await analytics().logEvent("sample_created", {
    ownerId: input.ownerId,
    title: input.title,
    isFeatured: input.isFeatured,
    showcaseOptIn: input.showcaseOptIn,
    visibility: input.visibility,
  });

  return docRef;
}

// --- Update a sample ---
export async function updateSample(id: string, patch: Partial<SampleWork>) {
  await firestore().collection("sampleWorks").doc(id).update({
    ...patch,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  // log analytics
  await analytics().logEvent("sample_updated", {
    sampleId: id,
    ...patch,
  });
}

// --- Delete a sample ---
export async function deleteSample(id: string) {
  await firestore().collection("sampleWorks").doc(id).delete();

  // log analytics
  await analytics().logEvent("sample_deleted", {
    sampleId: id,
  });
}

// --- Get user samples ---
export async function getMySamples(uid: string) {
  const snap = await firestore()
    .collection("sampleWorks")
    .where("ownerId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as SampleWork) }));
}
