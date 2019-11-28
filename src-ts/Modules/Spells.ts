import { FireBlast } from "Spells/Mage Fire/FireBlast";
import { Pyroblast } from "Spells/Mage Fire/Pyroblast";
import { Ignite } from "Spells/Mage Fire/Ignite";
import { HotStreak } from "Spells/Mage Fire/HotStreak";
require("Config");

export function InitializeSpells() {
    print("initializing shit spells");
    FireBlast.init();
    Pyroblast.init();
    Ignite.init(Spells.Ignite);
    HotStreak.init(Auras.HotStreak, Buffs.HeatingUp, Buffs.HotStreak);
}