export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

export interface AuthContextValue {
  user: User | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isLoading: boolean;
}
