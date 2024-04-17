import { useNavigation as useNavigationRN } from '@react-navigation/native';
import { useNavigate as useNavigateWeb } from 'react-router-dom';

export const useNavigate = process.env.REACT_APP_WEB
  ? () => useNavigateWeb()
  : () => useNavigationRN().navigate;
