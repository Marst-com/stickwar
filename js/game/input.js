import { SW } from "../core/state.js";


export function setupGameInput() {

    window.addEventListener(
        "keydown",
        event => {

            switch(event.code) {

                case "KeyA":
                case "ArrowLeft":
                    SW.input.left = true;
                    break;

                case "KeyD":
                case "ArrowRight":
                    SW.input.right = true;
                    break;

                case "Space":
                case "KeyW":
                case "ArrowUp":
                    SW.input.jump = true;
                    break;

                case "KeyJ":
                case "KeyF":
                    SW.input.attack = true;
                    break;

                case "ShiftLeft":
                case "ShiftRight":
                    SW.input.dash = true;
                    break;

                case "KeyS":
                case "ArrowDown":
                    SW.input.block = true;
                    break;

            }

        }
    );


    window.addEventListener(
        "keyup",
        event => {

            switch(event.code) {

                case "KeyA":
                case "ArrowLeft":
                    SW.input.left = false;
                    break;

                case "KeyD":
                case "ArrowRight":
                    SW.input.right = false;
                    break;

                case "Space":
                case "KeyW":
                case "ArrowUp":
                    SW.input.jump = false;
                    break;

                case "KeyJ":
                case "KeyF":
                    SW.input.attack = false;
                    break;

                case "ShiftLeft":
                case "ShiftRight":
                    SW.input.dash = false;
                    break;

                case "KeyS":
                case "ArrowDown":
                    SW.input.block = false;
                    break;

            }

        }
    );

}
