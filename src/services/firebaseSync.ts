import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Product, 
  Article, 
  LabReport, 
  MitraSPPG, 
  Order, 
  DeliveryLog, 
  Ticket, 
  Promo 
} from '../types';

/**
 * Subscribe to a Firestore collection with real-time updates.
 * Seeds Firestore with initial defaults if the collection is completely empty.
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  initialDefaults?: T[]
): () => void {
  const colRef = collection(db, collectionName);

  const unsubscribe = onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty && initialDefaults && initialDefaults.length > 0) {
      console.log(`[Firebase] Collection '${collectionName}' is empty. Seeding initial data...`);
      try {
        const batch = writeBatch(db);
        initialDefaults.forEach((item) => {
          const docRef = doc(db, collectionName, item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
        console.log(`[Firebase] Collection '${collectionName}' seeded successfully.`);
      } catch (err) {
        console.error(`[Firebase] Error seeding '${collectionName}':`, err);
        // Fallback to defaults locally if write fails
        onUpdate(initialDefaults);
      }
      return;
    }

    const items: T[] = snapshot.docs.map((docSnap) => docSnap.data() as T);
    onUpdate(items);
  }, (error) => {
    console.error(`[Firebase] Error subscribing to '${collectionName}':`, error);
    if (initialDefaults) {
      onUpdate(initialDefaults);
    }
  });

  return unsubscribe;
}

/**
 * Subscribe to a single document (e.g. settings) with real-time updates.
 * Seeds Firestore with initial default if document does not exist.
 */
export function subscribeToDocument<T>(
  docName: string,
  onUpdate: (data: T) => void,
  initialDefault?: T
): () => void {
  const docRef = doc(db, 'settings', docName);

  const unsubscribe = onSnapshot(docRef, async (snapshot) => {
    if (!snapshot.exists() && initialDefault) {
      console.log(`[Firebase] Document 'settings/${docName}' is missing. Seeding default settings...`);
      try {
        await setDoc(docRef, initialDefault as any);
        console.log(`[Firebase] Document 'settings/${docName}' seeded successfully.`);
      } catch (err) {
        console.error(`[Firebase] Error seeding 'settings/${docName}':`, err);
        onUpdate(initialDefault);
      }
      return;
    }

    if (snapshot.exists()) {
      onUpdate(snapshot.data() as T);
    }
  }, (error) => {
    console.error(`[Firebase] Error subscribing to 'settings/${docName}':`, error);
    if (initialDefault) {
      onUpdate(initialDefault);
    }
  });

  return unsubscribe;
}

/**
 * Syncs the entire local list to Firestore collection.
 * Reconciles additions, updates, and removals.
 */
export async function syncCollectionToFirestore<T extends { id: string }>(
  collectionName: string,
  newItems: T[]
) {
  try {
    const colRef = collection(db, collectionName);
    const existingSnap = await getDocs(colRef);
    const existingIds = new Set(existingSnap.docs.map((d) => d.id));
    const newIds = new Set(newItems.map((item) => item.id));

    const batch = writeBatch(db);

    // Save/update items
    newItems.forEach((item) => {
      const docRef = doc(db, collectionName, item.id);
      batch.set(docRef, item, { merge: true });
    });

    // Delete items removed locally
    existingIds.forEach((id) => {
      if (!newIds.has(id)) {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      }
    });

    await batch.commit();
    console.log(`[Firebase] Collection '${collectionName}' synced successfully.`);
  } catch (err) {
    console.error(`[Firebase] Error syncing collection '${collectionName}':`, err);
  }
}

/**
 * Save a single item to Firestore collection.
 */
export async function saveItemToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
) {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.error(`[Firebase] Error saving item to '${collectionName}':`, err);
  }
}

/**
 * Delete a single item from Firestore collection.
 */
export async function deleteItemFromFirestore(
  collectionName: string,
  itemId: string
) {
  try {
    const docRef = doc(db, collectionName, itemId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`[Firebase] Error deleting item '${itemId}' from '${collectionName}':`, err);
  }
}

/**
 * Save document to settings.
 */
export async function saveDocumentToFirestore<T>(
  docName: string,
  data: T
) {
  try {
    const docRef = doc(db, 'settings', docName);
    await setDoc(docRef, data as any, { merge: true });
    console.log(`[Firebase] Document 'settings/${docName}' saved successfully.`);
  } catch (err) {
    console.error(`[Firebase] Error saving document 'settings/${docName}':`, err);
  }
}
