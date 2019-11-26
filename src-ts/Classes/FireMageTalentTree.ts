import { TalentTree } from "Global/TalentTree/TalentTree";
import { TalentData } from "Global/TalentTree/Talent";
import { TalentTreeView } from "Global/TalentTree/TalentTreeView";
import { Trigger } from "node_modules/w3ts/src/handles/trigger";
import { Scorch, ScorchConfig } from "Spells/Mage Fire/Scorch";
import { Ignite, IgniteConfig } from "Spells/Mage Fire/Ignite";
import { FireBlast, FireBlastConfig } from "Spells/Mage Fire/FireBlast";
import { PyroblastConfig, Pyroblast } from "Spells/Mage Fire/Pyroblast";
import { HeroStats } from "Global/HeroStats";

require("Config")

function SetSpellConfig() {

}

export class FireMageTalentTree extends TalentTree {
    readonly Id: number = 0;
    readonly Columns: number = 5;
    readonly Rows: number = 5;

    constructor(unit: unit, load?: string) {
        super(unit, load);
        
        this.title = "Fire Mage Talent tree";
        this.pointsAvailable = 999;

        const t = new Trigger()
    

        const fireBlast = this.AddTalent(1, 2, {
            Name: "Fire Blast",
            Description: "Instantly deal moderate fire damage to the last targeted enemy.|n|n|cffffd9b3Cast time: Instant|r|n|cffffd9b3Cooldown 6s|r",
            Icon: Icons.FireBlast,
            Dependency: { down: 1 },
            OnActivate: (unit: unit) => { 
                print(GetObjectName(Spells.FireBlast));
                UnitAddAbility(unit, Spells.FireBlast);
            },
        });

        const scorch = this.AddTalent(1, 0, {
            Name: "Scorch",
            Description: "Scorch the last targeted enemy with fire damage.|n|n|cffffd9b3Cast time: 2 sec.",
            Icon: Icons.Scorch,
            OnActivate: (unit: unit) => UnitAddAbility(unit, Spells.Scorch),
        });

        // Pyroblast
        const pyroblast = this.AddTalent(3, 0, {
            Name: "Pyroblast",
            Description: "Hurls an immense fiery boulder that causes high Fire damage.|n|n|cffffd9b3Cast time: 4 sec.",
            Icon: Icons.Pyroblast,
            OnActivate: (unit: unit) => UnitAddAbility(unit, Spells.Pyroblast),
        }); 

        // Firestarter
        const firestarter = this.AddTalent(0, 1, {
            Name: "Firestarter",
            Description: "Scorch is castable while moving and attacking.",
            Icon: Icons.Firestarter,
            Dependency: { right: 3 },
            OnActivate: (unit: unit) => 
                Scorch.UpdateUnitConfig<ScorchConfig>(unit, (cfg) => cfg.Firestarter = true)
        });

        // Improved Scorch
        this.AddMultiRankTalent(1, 1, 3, (i: number) => {
            const bonus = 8;
            return {
                Name: "Improved Scorch",
                Description: "Your Scorch has "+(i*10)+"% increased chance to critically strike.",
                Icon: Icons.ImprovedScorch,
                Dependency: { down: 1 },
                OnActivate: (unit: unit) => 
                    Scorch.UpdateUnitConfig<ScorchConfig>(unit, (cfg) => cfg.BonusCrit = (i*10))
            }
        });

        // Ignite
        this.AddMultiRankTalent(3, 1, 3, (i: number) => {
            return {
                Name: "Ignite",
                Description: "Your target burns for an additional "+(i*15)+"% of the total direct damage caused by your autoattack, Fire Blast, Scorch, Pyroblast and Flamestrike over 9 sec. If this effect is reapplied, any remaining damage will be added to the new Ignite.",
                Icon: Icons.Ignite,
                OnActivate: (unit: unit) => {
                    UnitAddAbility(unit, Spells.Ignite);
                    HeroStats.From(unit).Mastery(10);
                    Ignite.UpdateUnitConfig<IgniteConfig>(unit, (cfg) => cfg.DamageAmount = (i*0.1));
                },
                Dependency: { down: 1 }
            }
        });

        // Wildfire
        const wildfire = this.AddTalent(2, 1, {
            Name: "Wildfire",
            Description: "Every 2 sec, your Ignites may spread to another nearby enemy.",
            Icon: Icons.Wildfire,
            Dependency: { right: 1 },
            OnActivate: (unit: unit) => 
                Ignite.UpdateUnitConfig<IgniteConfig>(unit, (cfg) => cfg.Wildfire = true)
        });

        // Hot Streak
        const hotStreak = this.AddTalent(3, 2, {
            Name: "Hot Streak",
            Description: "Two critical strikes within 3 sec will make your next Pyroblast within 6.0 sec instant cast.",
            Icon: Icons.HotStreak,
            Dependency: { down: 1 },
            OnActivate: (unit: unit) => UnitAddAbility(unit, Auras.HotStreak)
        });

        // Impact
        this.AddMultiRankTalent(1, 3, 4, (i: number) => {
            const bonus = 8
            return {
                Name: "Impact",
                Description: "Your Fire Blast has "+(i*25)+"% increased chance to critically strike.",
                Icon: Icons.Impact,
                Dependency: { "down": 1 },
                OnActivate: (unit: unit) => 
                    FireBlast.UpdateUnitConfig<FireBlastConfig>(unit, (cfg) => cfg.BonusCrit = i*25)
            }
        });

        // Faster Blaster
        const fasterBlaster = this.AddTalent(2, 3, {
            Name: "Faster Blaster",
            Description: "Fire Blast is castable while moving and castable while casting other spells.",
            Icon: Icons.Incinerate,
            Dependency: { left: 1 },
            OnActivate: (unit: unit) => {
                Scorch.UpdateUnitConfig<ScorchConfig>(unit, (cfg) =>
                    cfg.NonInterrupt.push(FireBlast.Order));
                Pyroblast.UpdateUnitConfig<PyroblastConfig>(unit, (cfg) =>
                    cfg.NonInterrupt.push(FireBlast.Order));
            }
        });

        // Improved Hot Streak
        const improvedHotStreak = this.AddTalent(3, 3, {
            Name: "Improved Hot Streak",
            Description: "Pyroblast cast with Hot Streak! causes double the normal Ignite damage.",
            Icon: Icons.HotStreak,
            Dependency: { down: 1 },
            OnActivate: (unit: unit) =>
                Pyroblast.UpdateUnitConfig<PyroblastConfig>(unit, (cfg) => cfg.BonusMastery = 2),
        });
            
        // Critical Mass
        this.AddMultiRankTalent(0, 3, 3, (i: number) => {
            return {
                Name: "Critical Mass",
                Description: "Your spells have "+(i*5)+"% increased chance to critically strike.",
                Icon: Icons.CriticalMass,
                OnActivate: (unit: unit) => null,//HeroStats:Crit(caster, 5) });
            }
        });
    }
}