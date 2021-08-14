import firebase from "firebase/app";
import "firebase/auth";

import { usersCollection, reviewsCollection } from "../utils/fbase";

const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// async await
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

// then
// because we are using redux promise redux  know by default how to handle promises
export const loginUser = ({ email, password }) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      return usersCollection
        .doc(response.user.uid)
        .get()
        .then((snapshot) => {
          return { isAuth: true, user: snapshot.data() };
        });
    })
    .catch((error) => {
      console.log(error);
      return { error: error.message };
    });

// promise
export const autoSignIn = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersCollection
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            resolve({ isAuth: true, user: snapshot.data() });
          });
      } else {
        resolve({ isAuth: false, user: null });
      }
    });
  });
};

export const logoutUser = () => {
  firebase.auth().signOut();
};

export const updateProfile = (formData, isEmailChanged) => {
  const collection = usersCollection.doc(formData.uid);
  const updateDocument = () =>
    collection
      .update(formData)
      .then(() =>
        collection
          .get()
          .then((snapshot) => ({ isAuth: true, user: snapshot.data() }))
      );

  if (isEmailChanged) {
    let getUser = firebase.auth().currentUser;
    getUser.updateEmail(formData.email);
    return updateDocument();
  } else {
    return updateDocument();
  }
};

export const addReview = (data, user) =>
  reviewsCollection
    .add({
      ...data,
      createdAt: serverTimestamp(),
      rating: parseInt(data.rating),
      public: parseInt(data.public),
      ownerData: {
        ownerId: user.uid,
        name: `${user.name} ${user.lastname}`,
      },
    })
    .then((docRef) => {
      return docRef.id;
    });
