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
      <DialogTrigger className="font-jetbrains   md:w-full w-16 h-9 md:h-full text text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-2 rounded">
        <p className="text-sm md:text-md">
          {!isAuthenticated ? 'sign in' : 'sign out'}
        </p>
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
