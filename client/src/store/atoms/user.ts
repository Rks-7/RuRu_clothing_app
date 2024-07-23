import { atom } from "recoil";
import { loadState } from "../../utils/localStorage";

interface UserState {
  isLoading: boolean;
  userEmail: string | null;
  userRole: string | null;
}

const savedUserState=loadState('userState');

export const userState = atom<UserState>({
  key: "userState",
  default: savedUserState || {
    isLoading: true,
    userEmail: null, 
    userRole: null, 
  },
});
