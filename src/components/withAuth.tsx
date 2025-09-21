// src/components/withAuth.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
   const Wrapper = (props: React.ComponentProps<typeof WrappedComponent>) => {
      const auth = useAuth();
      const router = useRouter();

      const { isAuthenticated, loading } = auth;

      useEffect(() => {
         if (!loading && !isAuthenticated) {
            router.push('/login');
         }
      }, [isAuthenticated, loading, router]);

      if (loading) {
         return <div>Loading...</div>;
      }

      if (isAuthenticated) {
         return <WrappedComponent {...props} />;
      }

      return null;
   };

   Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
   return Wrapper;
};

export default withAuth;