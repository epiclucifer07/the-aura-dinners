import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

export interface UserProfile {
  userId: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string;
  phoneVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  phoneVerified: boolean;
  verifiedPhone: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPhoneVerificationCode: (phone: string) => Promise<{ success: boolean; code: string; message: string }>;
  verifyPhoneCode: (phone: string, inputCode: string) => Promise<boolean>;
  resetPhoneVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Phone verification state
  const [pendingCode, setPendingCode] = useState<{ phone: string; code: string; expiresAt: number } | null>(null);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aura_phone_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(() => {
    try {
      return localStorage.getItem('aura_verified_phone') || null;
    } catch {
      return null;
    }
  });

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            if (data.phoneVerified && data.phoneNumber) {
              setPhoneVerified(true);
              setVerifiedPhone(data.phoneNumber);
              localStorage.setItem('aura_phone_verified', 'true');
              localStorage.setItem('aura_verified_phone', data.phoneNumber);
            }
          } else {
            const newProfile: UserProfile = {
              userId: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              phoneNumber: verifiedPhone || undefined,
              phoneVerified: phoneVerified,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Error fetching or creating user profile in Firestore:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [phoneVerified, verifiedPhone]);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userProfileData: UserProfile = {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: verifiedPhone || user.phoneNumber || undefined,
        phoneVerified: phoneVerified,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(userDocRef, userProfileData, { merge: true });
      setUserProfile(userProfileData);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  // Send simulated SMS verification code (generates a secure 6-digit OTP)
  const sendPhoneVerificationCode = async (phone: string) => {
    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    
    setPendingCode({ phone, code, expiresAt });

    return {
      success: true,
      code,
      message: `Verification code generated for ${phone}.`,
    };
  };

  // Verify entered OTP code
  const verifyPhoneCode = async (phone: string, inputCode: string): Promise<boolean> => {
    if (!pendingCode) return false;

    // Check match and expiry
    if (
      pendingCode.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '') &&
      pendingCode.code.trim() === inputCode.trim() &&
      Date.now() <= pendingCode.expiresAt
    ) {
      setPhoneVerified(true);
      setVerifiedPhone(phone);
      localStorage.setItem('aura_phone_verified', 'true');
      localStorage.setItem('aura_verified_phone', phone);
      setPendingCode(null);

      // If user is authenticated, update in Firestore
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            phoneNumber: phone,
            phoneVerified: true,
          });
          setUserProfile((prev) => prev ? { ...prev, phoneNumber: phone, phoneVerified: true } : null);
        } catch (e) {
          console.warn('Could not update Firestore user document:', e);
        }
      }

      return true;
    }

    return false;
  };

  const resetPhoneVerification = () => {
    setPhoneVerified(false);
    setVerifiedPhone(null);
    setPendingCode(null);
    localStorage.removeItem('aura_phone_verified');
    localStorage.removeItem('aura_verified_phone');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        phoneVerified,
        verifiedPhone,
        signInWithGoogle,
        signOut,
        sendPhoneVerificationCode,
        verifyPhoneCode,
        resetPhoneVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
