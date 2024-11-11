import { useState, useEffect } from 'react';
import { UserData } from './types';
import { fetchUserDashboardData } from './dashboardApi';

export const useDashboardData = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('Loading dashboard data...');
      try {
        const userData = await fetchUserDashboardData();
        console.log('Dashboard data loaded:', userData);
        setData(userData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

    console.log('Dashboard hook state:', { data, loading, error });
    return { data, loading, error };
}; 