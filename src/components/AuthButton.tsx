'use client';
import { NeynarAuthButton, useNeynarContext } from '@neynar/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AuthButton = () => {
  const { isAuthenticated } = useNeynarContext();
  return (
    <Dialog>
      <DialogTrigger className="font-pixelify text-md text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded">
        {!isAuthenticated ? 'sign in' : 'sign out'}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isAuthenticated ? 'Sign out' : 'Sign in'}</DialogTitle>
          <DialogDescription className="flex items-center justify-center">
            <NeynarAuthButton />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;
