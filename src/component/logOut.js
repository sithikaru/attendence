import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const logOut = async () => {
  await  signOut(auth)
  window.location.reload();
}

export default logOut