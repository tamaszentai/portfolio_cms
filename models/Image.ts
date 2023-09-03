import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export interface Image {
    id: string;
    description: string;
    createdAt: Timestamp;
    modifiedAt: Timestamp;
    source: string;
    uploadedBy: string;
    name: string;
    size: number;
    contentType: string;
    isFeatured: boolean;
}