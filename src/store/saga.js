import { call, put , all, takeLatest } from 'redux-saga/effects';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase_1';  

function* fetchUserDetailsSaga(user) {
  try {
    const userDocRef = doc(db, "users", user.payload.uid); 
    const userDoc = yield call(getDoc, userDocRef); 
    const userDetails = userDoc.data();

    yield put({ type: 'FETCH_DETAILS', payload: userDetails }); 
  } catch (error) {
    console.error("Error fetching user details:", error.message);
  }
}

export function* rootSaga() {
    yield all([
      takeLatest("FETCH_USER_DETAILS_REQUEST", fetchUserDetailsSaga),
    ]);
  }
  
  export default rootSaga;