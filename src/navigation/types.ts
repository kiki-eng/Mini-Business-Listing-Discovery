import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  AddBusiness: undefined;
  MyListings: undefined;
  AllListings: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Splash: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  BusinessDetails: { businessId: string };
  EditBusiness: { businessId: string };
};
