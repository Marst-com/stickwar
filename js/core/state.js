export const SW = {

    app: {
        ready: false,
        screen: "lobby"
    },

    user: null,

    profile: null,

    room: null,

    game: {

        running: false,

        tick: 0,

        time: 180,

        map: null,

        players: {},

        projectiles: [],

        effects: [],

        particles: [],

        camera: {
            x: 0,
            y: 0,
            zoom: 1
        }

    },

    input: {

        left: false,
        right: false,
        up: false,

        jump: false,
        attack: false,
        dash: false,
        block: false

    },

    network: {

        host: false,

        connected: false,

        peers: {},

        channels: {},

        latency: {}

    },

    friends: {},

    inventory: {

        weapons: {},

        selectedWeapon:
            "wood_sword"

    },

    events: {

        current: null

    }

};
