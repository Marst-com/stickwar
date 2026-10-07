import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyA9et64waizsOB-_vdZPtCZCfmAcJu9s8c",

    authDomain:
        "stickwar-3b833.firebaseapp.com",

    databaseURL:
        "https://stickwar-3b833-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "stickwar-3b833",

    storageBucket:
        "stickwar-3b833.firebasestorage.app",

    messagingSenderId:
        "157384061391",

    appId:
        "1:157384061391:web:bea3eb1147b697f230a2ba",

    measurementId:
        "G-8J21LW7Q6W"

};


export let app;
export let auth;
export let db;


export async function initFirebase() {

    app =
        getApps().length
            ? getApps()[0]
            : initializeApp(
                firebaseConfig
            );

    auth =
        getAuth(app);

    db =
        getDatabase(app);

    console.log(
        "Firebase ready."
    );

    return {
        app,
        auth,
        db
    };

}
