import { collection } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export const usersCollection = db.collection("users");
