import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, serverTimestamp, query, orderBy, where, Timestamp, or } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorId?: string;
  isPinned: boolean;
  imageUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  content?: string;
}

export interface HeraldicArm {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  owner: string;
  ownerId?: string;
  status: 'pending' | 'approved';
}

interface DataContextType {
  articles: Article[];
  events: Event[];
  arms: HeraldicArm[];
  addArticle: (article: Omit<Article, 'id'>) => Promise<void>;
  updateArticle: (id: string, updates: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addArm: (arm: Omit<HeraldicArm, 'id' | 'status'>) => Promise<void>;
  approveArm: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [arms, setArms] = useState<HeraldicArm[]>([]);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Articles listener
    const articlesQuery = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubArticles = onSnapshot(articlesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'articles');
    });

    // Events listener
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
    });

    return () => {
      unsubArticles();
      unsubEvents();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    let armsQuery;
    if (user?.role === 'admin') {
      armsQuery = query(collection(db, 'arms'));
    } else if (user) {
      armsQuery = query(collection(db, 'arms'), or(where('status', '==', 'approved'), where('ownerId', '==', user.id)));
    } else {
      armsQuery = query(collection(db, 'arms'), where('status', '==', 'approved'));
    }

    const unsubArms = onSnapshot(armsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeraldicArm));
      setArms(data.sort((a, b) => b.status.localeCompare(a.status)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'arms');
    });

    return () => unsubArms();
  }, [isLoading, user]);

  const addArticle = async (article: Omit<Article, 'id'>) => {
    if (!user || user.role !== 'admin') return;
    try {
      await addDoc(collection(db, 'articles'), {
        ...article,
        authorId: user.id,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'articles');
    }
  };

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    if (!user || user.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'articles', id), {
        ...updates
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `articles/${id}`);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!user || user.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `articles/${id}`);
    }
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user || user.role !== 'admin') return;
    try {
      await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    if (!user || user.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'events', id), {
        ...updates
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${id}`);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user || user.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  };

  const addArm = async (arm: Omit<HeraldicArm, 'id' | 'status'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'arms'), {
        ...arm,
        ownerId: user.id,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'arms');
    }
  };

  const approveArm = async (id: string) => {
    if (!user || user.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'arms', id), {
        status: 'approved',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `arms/${id}`);
    }
  };

  return (
    <DataContext.Provider value={{ articles, events, arms, addArticle, updateArticle, deleteArticle, addEvent, updateEvent, deleteEvent, addArm, approveArm }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
