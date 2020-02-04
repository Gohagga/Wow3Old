import { FireBlast } from "Spells/Mage Fire/FireBlast";
import { Pyroblast } from "Spells/Mage Fire/Pyroblast";
import { Ignite } from "Spells/Mage Fire/Ignite";
import { HotStreak } from "Spells/Mage Fire/HotStreak";
import { Scorch } from "Spells/Mage Fire/Scorch";
import { MortalStrike } from "Spells/Warrior Arms/MortalStrike";
import { Slam } from "Spells/Warrior Arms/Slam";
require("Config");

export function InitializeSpells() {
    print("initializing shit spells");
    Pyroblast.init();
    Ignite.init(Spells.Ignite);
    HotStreak.init(Auras.HotStreak, Buffs.HeatingUp, Buffs.HotStreak);
    Scorch.init(Spells.ScorchInstant, Buffs.ManaShield, Models.AirstrikeRocket);
    FireBlast.init(Spells.FireBlast, Models.FireCrescent);

    MortalStrike.init(Spells.MortalStrike, Buffs.ManaShield);
    Slam.init(Spells.Slam, Buffs.Immolation);
}