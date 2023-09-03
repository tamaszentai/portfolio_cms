import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export interface ServiceModel {
    id: string;
    title: string;
    description: string;
    createdAt: Timestamp;
    modifiedAt: Timestamp;
    createdBy: string;
    order: number;
    price: number;
}