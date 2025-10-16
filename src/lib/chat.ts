// src/lib/chat.ts
import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

export const createChat = async (
  userId: string,
  heroSlug: string,
  title: string
) => {
  const chatRef = collection(db, "users", userId, "heroChats");
  const chatDoc = doc(chatRef);
  await setDoc(chatDoc, { heroSlug, title, createdAt: Date.now() });
  return chatDoc.id;
};

export const updateChatTitle = async (userId: string, chatId: string) => {
  const title = "test";
  const chatDocRef = doc(db, "users", userId, "heroChats", chatId);
  await updateDoc(chatDocRef, { title });
};

export type HeroChat = {
  heroSlug: string;
  title: string;
  createdAt: number;
};

export const listChats = async (userId: string, heroSlug: string) => {
  const chatRef = collection(db, "users", userId, "heroChats");
  const q = query(chatRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as HeroChat) }))
    .filter((chat) => chat.heroSlug === heroSlug);
};

export const saveMessage = async (
  userId: string,
  chatId: string,
  message: Message
) => {
  const msgRef = collection(
    db,
    "users",
    userId,
    "heroChats",
    chatId,
    "messages"
  );
  await addDoc(msgRef, message);
};

export const getMessages = async (
  userId: string,
  chatId: string
): Promise<Message[]> => {
  const msgRef = collection(
    db,
    "users",
    userId,
    "heroChats",
    chatId,
    "messages"
  );
  const q = query(msgRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Message);
};
