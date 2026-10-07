export const LEGENDARY_WEAPONS = {

    thunder: {
        id: "thunder",
        name: "썬더캐논",
        rarity: "LEGENDARY",
        damage: 135,
        type: "lightning",
        range: 900,
        cooldown: 1800,
        chain: 3,
        icon: "⚡"
    },

    hell_sword: {
        id: "hell_sword",
        name: "지옥검",
        rarity: "LEGENDARY",
        damage: 150,
        type: "melee",
        range: 115,
        cooldown: 650,
        burn: {
            damage: 12,
            duration: 5000
        },
        knockback: 18,
        icon: "🔥⚔️"
    },

    blackhole: {
        id: "blackhole",
        name: "블랙홀건",
        rarity: "LEGENDARY",
        damage: 165,
        type: "blackhole",
        speed: 8,
        radius: 150,
        pull: 3,
        duration: 2500,
        cooldown: 3000,
        icon: "🕳️"
    },

    void_scythe: {
        id: "void_scythe",
        name: "보이드사이드",
        rarity: "LEGENDARY",
        damage: 180,
        type: "melee",
        range: 130,
        cooldown: 900,
        lifesteal: .25,
        knockback: 25,
        icon: "☠️"
    }

};
