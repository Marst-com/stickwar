import { createApp } from "./ui/app.js";
import { initFirebase } from "./firebase/firebase.js";
import { initGame } from "./game/game.js";
import { initRoom } from "./room/room.js";
import { initFriends } from "./friends/friends.js";

async function main() {

    console.log(
        "%cSTICKWAR",
        "font-size:30px;font-weight:900"
    );

    await initFirebase();

    initFriends();
    initRoom();
    initGame();

    createApp();

    console.log(
        "StickWar initialized."
    );
}

main().catch(error => {

    console.error(
        "StickWar boot failed:",
        error
    );

});
