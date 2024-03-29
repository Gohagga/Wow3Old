import { UnitConfigurable } from "Global/UnitConfigurable";
import { DamageDisplay } from "Global/DamageDisplay";
require("Config");

export type HotStreakConfig = {
    Duration: number[],
    Attach: string[],
    Sfx: string[]
}

export class HotStreak extends UnitConfigurable {
    private static SpellId: number;
    private static Buff1: number;
    private static Buff2: number;
    private static _hotStreaks: Record<number, HotStreak> = {};

    private static readonly DefaultConfig: HotStreakConfig = {
        Duration: [3, 6],
        Attach: ["chest", "origin"],
        Sfx: [Models.HeatingUp, Models.HotStreak]
    }

    private caster: unit
    private sfx: effect;
    private expireTimer: timer;

    constructor(caster: unit, sfx: string, attach: string) {
        super();

        this.caster = caster;
        this.sfx = AddSpecialEffectTarget(sfx, caster, attach);
        this.expireTimer = CreateTimer();
        const casterId = GetHandleId(caster);
        HotStreak._hotStreaks[casterId] = this;
    }

    public static Add(caster: unit) {

        const lvl = GetUnitAbilityLevel(caster, this.SpellId);
        const data = HotStreak.GetUnitConfig<HotStreakConfig>(caster);
        if (lvl > 0 && lvl < 3) {

            let instance: HotStreak;
            const casterId = GetHandleId(caster);
            if (casterId in this._hotStreaks) {

                instance = this._hotStreaks[casterId];
                DestroyEffect(instance.sfx);
                PauseTimer(instance.expireTimer);
                instance.sfx = AddSpecialEffectTarget(data.Sfx[lvl-1], caster, data.Attach[lvl-1]);
            } else {

                instance = new HotStreak(caster, data.Sfx[lvl-1], data.Attach[lvl-1]);
            }
            UnitRemoveAbility(caster, this.Buff1);
            SetUnitAbilityLevel(caster, this.SpellId, lvl + 1);
            TimerStart(instance.expireTimer, data.Duration[lvl-1], false, () => instance.Remove());
        }
    }

    public static HeatUp(caster: unit) {

        const lvl = GetUnitAbilityLevel(caster, this.SpellId);
        if (lvl == 1) {

            const data = HotStreak.GetUnitConfig<HotStreakConfig>(caster);
            let instance: HotStreak;
            const casterId = GetHandleId(caster);
            if (casterId in this._hotStreaks) {

                instance = this._hotStreaks[casterId];
                DestroyEffect(instance.sfx);
                PauseTimer(instance.expireTimer);
                instance.sfx = AddSpecialEffectTarget(data.Sfx[0], caster, data.Attach[0]);
            } else {

                instance = new HotStreak(caster, data.Sfx[0], data.Attach[0]);
            }
            UnitRemoveAbility(caster, this.Buff1);
            SetUnitAbilityLevel(caster, this.SpellId, 2);
            TimerStart(instance.expireTimer, data.Duration[0], false, () => instance.Remove());
        }
    }

    public static Consume(caster: unit) {

        if (GetUnitAbilityLevel(caster, this.SpellId) == 3) {
            const casterId = GetHandleId(caster);
            if (casterId in this._hotStreaks) {
                this._hotStreaks[casterId].Remove();
                return true;
            }
        }
        return false;
    }

    public Remove() {
        SetUnitAbilityLevel(this.caster, HotStreak.SpellId, 1);
        UnitRemoveAbility(this.caster, HotStreak.Buff1);
        UnitRemoveAbility(this.caster, HotStreak.Buff2);
        DestroyEffect(this.sfx);
    }

    static init(auraId: number, heatingUpBuffId: number, hotStreakBuffId: number) {
        this.SpellId = auraId;
        this.Buff1 = heatingUpBuffId;
        this.Buff2 = hotStreakBuffId;


        this.SetDefaultConfig<HotStreakConfig>(this.DefaultConfig);
        const t = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED)
        TriggerAddAction(t, () => {
            const source = GetEventDamageSource();
            
            if (BlzGetEventDamageType() == DAMAGE_TYPE_NORMAL && DamageDisplay.EventDamageWasCrit) {
                HotStreak.Add(source);
            }
        });
    }
}