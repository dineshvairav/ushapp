import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

const AuthListener = () => {
  const navigation = useNavigation();

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session) {
          console.log('Session exists. Navigating to Home.');
          navigation.replace('Home');
        } else {
          console.log('No session. Staying on current screen.');
        }
      });

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log('User signed in. Navigating to Home.');
        navigation.replace('Home');
      } else {
        console.log('User signed out.');
      }
    });
  }, []);

  return null; // This component doesn't render anything
};

export default AuthListener;
