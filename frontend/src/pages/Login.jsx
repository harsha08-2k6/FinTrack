import React from 'react';
import { Auth } from './Auth';

export const Login = ({ onNavigateRegister, onSuccess }) => {
  return <Auth initialMode="login" onSuccess={onSuccess} />;
};
