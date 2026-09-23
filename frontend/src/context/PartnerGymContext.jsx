import { createContext, useContext, useState, useEffect } from 'react';
import { partnerApi } from '../services/partnerApi';

const PartnerGymContext = createContext(null);

export function PartnerGymProvider({ children }) {
  const [availableGyms, setAvailableGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [staffRole, setStaffRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const { gyms } = await partnerApi.getGyms();
        setAvailableGyms(gyms);
        
        // Select first gym by default if none selected
        if (gyms.length > 0) {
          const defaultGym = gyms[0];
          setSelectedGym(defaultGym.gym);
          setStaffRole(defaultGym.role);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load partner gyms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGyms();
  }, []);

  const changeGym = (gymId) => {
    const staffGym = availableGyms.find(sg => sg.gym.id === gymId);
    if (staffGym) {
      setSelectedGym(staffGym.gym);
      setStaffRole(staffGym.role);
    }
  };

  const hasPermission = (requiredRoles) => {
    if (!staffRole) return false;
    return requiredRoles.includes(staffRole);
  };

  return (
    <PartnerGymContext.Provider value={{
      availableGyms,
      selectedGym,
      staffRole,
      isLoading,
      error,
      changeGym,
      hasPermission
    }}>
      {children}
    </PartnerGymContext.Provider>
  );
}

export function usePartnerGym() {
  const context = useContext(PartnerGymContext);
  if (!context) throw new Error('usePartnerGym must be used within PartnerGymProvider');
  return context;
}
