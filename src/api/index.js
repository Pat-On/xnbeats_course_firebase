import firebase from "firebase/app";
import "firebase/auth";

//was working without it because was already initialize
import "firebase/storage";

import {
  usersCollection,
  reviewsCollection,
  messagesCollection,
} from "../utils/fbase";

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

export const getReviews = (limit) =>
  reviewsCollection
    .orderBy("createdAt")
    .limit(limit)
    .get()
    .then((snapshot) => {
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { posts: reviews, lastVisible: lastVisible };
    });

export const loadMoreReviews = (limit, reviews) => {
  let posts = [...reviews.posts];
  let lastVisible = reviews.lastVisible;

  if (lastVisible) {
    return reviewsCollection
      .orderBy("createdAt")
      .startAfter(lastVisible)
      .limit(limit)
      .get()
      .then((snapshot) => {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        const newReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return { posts: [...posts, ...newReviews], lastVisible };
      });
  } else {
    console.log("no more posts");
    return { posts, lastVisible };
  }
};

export const editReview = (data, id) =>
  reviewsCollection
    .doc(id)
    .update(data)
    .then(() => {
      return getReviewById(id);
    });

export const getReviewById = async (id) => {
  try {
    const snapshot = await reviewsCollection.doc(id).get();
    const data = snapshot.data();

    const url = await firebase
      .storage()
      .ref(`reviews/${data.img}`)
      .getDownloadURL();
    return { ...data, downloadUrl: url };
  } catch (error) {
    return null;
  }
};

export const fetchPosts = (limit = 3, where = null) => {
  return new Promise((resolve, reject) => {
    let query = reviewsCollection.where("public", "==", 1);

    if (where) {
      query = query.where(where[0], where[1], where[2]);
    } else {
      query = query.orderBy("createdAt");
    }

    query
      .limit(limit)
      .get()
      .then((snapshot) => {
        const post = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        resolve(post);
      });
  });
};

export const sendContact = (data) => {
  return messagesCollection
    .add({
      ...data,
      createdAt: serverTimestamp(),
    })
    .then((docRef) => {
      return docRef.id;
    });
};
