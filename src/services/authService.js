import { supabase } from '../config/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';

/**
 * Helper to get a user-friendly error message
 */
const getErrorMessage = (error) => {
  return error.message || 'An unexpected error occurred.';
};

/**
 * 1. Sign up with Email and Password
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName,
        }
      }
    });
    
    if (error) throw error;
    
    // Supabase Auth trigger should ideally create the user in the `users` table.
    // If not using triggers, we create it manually:
    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert([{
        uid: data.user.id,
        email: data.user.email,
        displayName: displayName,
        photoURL: null,
        gender: null,
        dob: null,
        authProvider: 'email',
        preferredLanguage: 'en',
        isProfileComplete: false,
        isOnboarded: false,
      }]);
      // Ignore conflict if it already exists
    }
    
    return data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 2. Sign in with Email and Password
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 3. Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      // Use Native Google Sign-In on Android
      const result = await GoogleSignIn.signIn();
      const idToken = result.idToken;
      
      if (!idToken) throw new Error('Google Sign-In failed, no ID token received.');
      
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      
      if (error) throw error;
      return data;
      
    } else {
      // Use Web OAuth on browser
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: false,
          redirectTo: window.location.origin + import.meta.env.BASE_URL,
        }
      });
      if (error) throw error;
      return data;
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 4. Sign in as Guest (Anonymous)
 */
export const signInAsGuest = async () => {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    
    if (data.user) {
      await supabase.from('users').upsert({
        uid: data.user.id,
        email: null,
        displayName: 'Guest User',
        photoURL: null,
        gender: null,
        dob: null,
        authProvider: 'guest',
        preferredLanguage: 'en',
        isProfileComplete: false,
        isOnboarded: false,
      });
    }
    
    return data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 5. Log out
 */
export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 6. Reset Password
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 7. Update User Profile (Database + Auth)
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { error: dbError } = await supabase
      .from('users')
      .update(profileData)
      .eq('uid', userId);
      
    if (dbError) throw dbError;
    
    // Update auth metadata if display name or photoURL are changing
    if (profileData.displayName || profileData.photoURL) {
      const updateData = {};
      if (profileData.displayName) updateData.displayName = profileData.displayName;
      if (profileData.photoURL) updateData.photoURL = profileData.photoURL;
      
      const { error: authError } = await supabase.auth.updateUser({
        data: updateData
      });
      if (authError) throw authError;
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * 8. Upload Profile Photo
 */
export const uploadProfilePhoto = async (userId, file) => {
  try {
    const filePath = `users/${userId}/profile_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
      
    if (error) throw error;
    
    const { data: publicData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    return publicData.publicUrl;
  } catch (error) {
    throw new Error('Failed to upload profile photo. ' + error.message);
  }
};

/**
 * 9. Get User Profile from Database
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = 0 rows returned
    
    return data || null;
  } catch (error) {
    throw new Error('Failed to fetch user profile. ' + error.message);
  }
};

/**
 * 10. Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      const user = session?.user || null;
      if (user) {
        // Map Supabase user properties to the format the app expects
        user.displayName = user.user_metadata?.displayName || user.email?.split('@')[0] || 'User';
        user.photoURL = user.user_metadata?.photoURL || null;
        user.uid = user.id;
      }
      callback(user, event);
    }
  );
  return () => {
    subscription.unsubscribe();
  };
};

/**
 * 11. Convert Guest to Email
 */
export const convertGuestToEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email,
      password
    });
    if (error) throw error;
    
    const user = data.user;
    if (user) {
      await supabase.from('users').update({
        email: email,
        authProvider: 'email'
      }).eq('uid', user.id);
    }
    
    return user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
