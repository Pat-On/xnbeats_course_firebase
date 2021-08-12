import firebase from "firebase/app";
import "firebase/auth";

import { usersCollection } from "../utils/fbase";

export const registerUser = async ({ email, password, name, lastname }) => {
  try {
    // add to authentication list and await if it is done and add to db
    console.log(email, password);
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const { user } = response;

    const userProfile = {
      uid: user.uid,
      email: email,
      name: name,
      lastname: lastname,
      role: 1,
    };

    await usersCollection.doc(user.uid).set(userProfile);
    // email verification
    console.log("?");
    const user2 = firebase.auth().currentUser;
    console.log(user2);
    firebase.auth().currentUser.sendEmailVerification();
    return { isAuth: true, user: userProfile };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const loginUser = () => {
  return {
    value: true,
  };
};
