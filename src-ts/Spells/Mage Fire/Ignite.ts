import { UnitConfigurable } from "Global/UnitConfigurable";
import { HeroStats } from "Global/HeroStats";
import { GROUP } from "Modules/Globals";
import { DamageDisplay } from "Global/DamageDisplay";
import { HotStreak } from "./HotStreak";

export type IgniteConfig = {
    Duration: number,
    DamageAmount: number,
    Wildfire: boolean,
    DamageTickTime: number,
    SpreadTickTime: number,
    SpreadRadius: number,
}

export class Ignite extends UnitConfigurable {
    public static readonly AttackType = ATTACK_TYPE_NORMAL;
    public static readonly DamageType = DAMAGE_TYPE_MAGIC;
    public static readonly Sfx = "Environment/SmallBuildingFire/SmallBuildingFire2.mdl";
    private static readonly DefaultConfig: IgniteConfig = {
        Duration: 9,
        DamageAmount: 1,
        Wildfire: false,
        DamageTickTime: 1.0,
        SpreadTickTime: 2.0,
        SpreadRadius: 300.0
    }

    public static SpellId: number;
    public static _ignites: Record<number, Record<number, Ignite>> = {};
    public static _timer: timer = CreateTimer();

    private caster: unit;
    private target: unit;
    private bank: number;
    private timer = CreateTimer();
    private ticks: number;
    private spreadTicks: number | null;
    private spreadRadius: number | null;
    private ticksToSpread = 0;

    constructor({caster, target, bank, ticks, spreadTicks, spreadRadius} : { caster: unit, target: unit, bank: number, ticks: number, spreadTicks: number | null, spreadRadius: number | null }) {
        super();

        this.caster = caster,
        this.target = target,
        this.bank = bank,
        this.ticks = ticks,
        this.spreadTicks = spreadTicks;
        this.spreadRadius = spreadRadius;
        this.ticksToSpread = 0;
        this.timer = CreateTimer();
    }

    public static AddIfHasAbility(target: unit, caster: unit, damageDealt: number) {
        if (GetUnitAbilityLevel(caster, this.SpellId) < 1) return;
        return this.Add(target, caster, damageDealt);
    }

    public static Add(target: unit, caster: unit, damageDealt: number): Ignite {
        
        const data = this.GetUnitConfig<IgniteConfig>(caster);
        const stats = new HeroStats(caster);
        const damage = damageDealt * data.DamageAmount * (stats.Mastery() * 0.01 + 1);
        
        const casterId = GetHandleId(caster);
        const targetId = GetHandleId(target);
        let instance: Ignite;
        if (!(casterId in this._ignites)) this._ignites[casterId] = {};

        let spreadTicks = null;
        let spreadRadius = null;
        if (data.Wildfire) {
            spreadTicks = data.SpreadTickTime;
            spreadRadius = data.SpreadRadius;
        }

        if (targetId in this._ignites[casterId]) {
            instance = this._ignites[casterId][targetId];

            // If target already has ignite, just add the damage to the bank
            // PauseTimer(instance.timer);
            instance.bank += damage;
            instance.ticks = data.Duration;
            instance.spreadTicks = spreadTicks;
            instance.spreadRadius = spreadRadius;

        } else {
            
            instance = new Ignite({
                caster: caster,
                target: target,
                bank: damage,
                ticks: data.Duration,
                spreadTicks: spreadTicks,
                spreadRadius: spreadRadius
            });
            TimerStart(instance.timer, data.DamageTickTime, true, () => instance.Damage())
        }


        this._ignites[casterId][targetId] = instance;
        return instance;
    }

    private Damage(): void {

        const damageTick = this.bank / this.ticks;
        this.bank -= damageTick;
        this.ticks--;

        if (this.ticks > 0) {
            print("doing ignite damage");
            UnitDamageTarget(this.caster, this.target, 1 + damageTick, false, false, Ignite.AttackType, Ignite.DamageType, WEAPON_TYPE_WHOKNOWS);
            print("adding hotstreak: ", DamageDisplay.EventDamageWasCrit);
            if (DamageDisplay.EventDamageWasCrit) {
                HotStreak.Add(this.caster);
            }
            DestroyEffect(AddSpecialEffectTarget(Ignite.Sfx, this.target, "head"));
            if (this.spreadTicks) {
                this.ticksToSpread++;
                if (this.ticksToSpread % this.spreadTicks == 0) {
                    this.Spread();
                }
            }
        } else {
            PauseTimer(this.timer);
            DestroyTimer(this.timer);
            delete Ignite._ignites[GetHandleId(this.caster)][GetHandleId(this.target)];
        }
    }

    private Spread(): void {
        
        GroupEnumUnitsInRange(GROUP, GetUnitX(this.target), GetUnitY(this.target), this.spreadRadius || 0, null);
        const casterId = GetHandleId(this.caster);
        const data = Ignite.GetUnitConfig<IgniteConfig>(this.caster);

        let u = FirstOfGroup(GROUP);
        let selected: unit | null = null;
        let instance: Ignite;
        while (u && !selected) {
            GroupRemoveUnit(GROUP, u);

            // If unit condition isn't satisfied, continue
            if (IsUnitType(u, UNIT_TYPE_MAGIC_IMMUNE) || GetWidgetLife(u) <= 0.405) continue;
            // Try to get picked up unit's Ignite instance
            instance = Ignite._ignites[casterId][GetHandleId(u)];
            // If picked unit already has ignite, spread to it only if its bank is less than this
            if (instance && instance.bank < this.bank) selected = u;
            // Otherwise only spread to picked unit if it doesn't have an Ignite effect from this caster at all
            else if (!instance) selected = u;

            u = FirstOfGroup(GROUP);
        }

        if (selected) {

            const selectedId = GetHandleId(selected);
            if (selectedId in Ignite._ignites[casterId]) {
                Ignite._ignites[casterId][selectedId].bank = this.bank;
                Ignite._ignites[casterId][selectedId].ticks = this.ticks;
                Ignite._ignites[casterId][selectedId].ticksToSpread = 0;
            } else {
                const newIgnite = new Ignite({
                        caster: this.caster,
                        target: selected,
                        bank: this.bank,
                        ticks: this.ticks,
                        spreadTicks: this.spreadTicks,
                        spreadRadius: this.spreadRadius
                    });
        
                TimerStart(newIgnite.timer, data.DamageTickTime, true, () => newIgnite.Damage())
                Ignite._ignites[casterId][selectedId] = newIgnite;
            }

        }
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.SetDefaultConfig<IgniteConfig>(this.DefaultConfig);
        const t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED)
        TriggerAddAction(t, () => {
            const source = GetEventDamageSource();
            const type = BlzGetEventDamageType();
            if (type == DAMAGE_TYPE_NORMAL) {
                Ignite.Add(BlzGetEventDamageTarget(), source, GetEventDamage())
            }
        });
    }
}