import { useState, useEffect } from 'react';
import { getUserRole } from '../utils/getUserRole';

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRole().then(({ role, error }) => {
      setRole(role);
      setError(error);
      setLoading(false);
    });
  }, []);

  return { role, error, loading };
}
