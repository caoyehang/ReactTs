export type AuthState = {
  token: string | null;
  siderCollapsed: boolean;
};

export interface LoginFormValues {
  username: string;
  password: string;
}
