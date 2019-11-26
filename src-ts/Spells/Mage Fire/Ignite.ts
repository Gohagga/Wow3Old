import { UnitConfigurable } from "Global/UnitConfigurable";
import { HeroStats } from "Global/HeroStats";

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
        DamageAmount: 0,
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
    private spreadTicks?: number;
    private spreadRadius?: number;

    constructor({caster, target, bank, ticks} : { caster: unit, target: unit, bank: number, ticks: number }) {
        super();

        this.caster = caster,
        this.target = target,
        this.bank = bank,
        this.ticks = ticks,
        this.timer = CreateTimer();
    }

    public Apply(target: unit): void {
        
        /*
        const casterId = GetHandleId(this.caster);
        const targetId = GetHandleId(target);
        this.target = target;
        let instance: Ignite;
        // If the caster never had any ignite casts at all, create a new target list
        if (!(casterId in Ignite._ignites)) Ignite._ignites[casterId] = {};
        
        // If the caster has an active Ignite on the target
        if (targetId in Ignite._ignites[casterId]) {
            instance = Ignite._ignites[casterId][targetId];

            // Pause the existing timer
            PauseTimer(instance.timer);
            instance.bank += this.bank;
            instance.ticks = this.data.Duration;
        } else {
            instance = Object.assign({}, this);
            instance.timer = CreateTimer();
        }

        if (this.data.Wildfire) {
            if (!instance.spreadTimer) {
                instance.spreadTimer = CreateTimer();
                TimerStart(instance.spreadTimer, this.data.SpreadTickTime, true, () => this.Spread());
            }
        }*/
    }

    public static Add(target: unit, caster: unit, damageDealt: number) {
        
        print("Ignite.Add");
        if (GetUnitAbilityLevel(caster, this.SpellId) < 1) return;
        print("has Ignite spell");
        const data = this.GetUnitConfig<IgniteConfig>(caster);
        const stats = new HeroStats(caster);
        const damage = damageDealt * data.DamageAmount * (stats.Mastery() * 0.01 + 1)
        
        const casterId = GetHandleId(caster);
        const targetId = GetHandleId(caster);
        let instance: Ignite;
        if (!(casterId in this._ignites)) this._ignites[casterId] = {}

        if (targetId in this._ignites[casterId]) {
            instance = this._ignites[casterId][targetId];

            // If target already has ignite, just add the damage to the bank
            PauseTimer(instance.timer);
            instance.bank += damage;
            instance.ticks = data.Duration;
        } else {
            instance = new Ignite({
                caster: caster,
                target: target,
                bank: damage,
                ticks: data.Duration,
            });
        }

        if (data.Wildfire) {
            instance.spreadTicks = data.SpreadTickTime;
            instance.spreadRadius = data.SpreadRadius;
        }

        TimerStart(instance.timer, data.DamageTickTime, true, () => instance.Damage())

        this._ignites[casterId][targetId] = instance;
        return instance;
    }

    private Damage(): void {

        print("Ignite.Damage");
        const damageTick = this.bank / this.ticks;
        this.bank -= damageTick;
        this.ticks--;

        if (this.ticks > 0) {
            UnitDamageTarget(this.caster, this.target, 1 + damageTick, false, false, Ignite.AttackType, Ignite.DamageType, WEAPON_TYPE_WHOKNOWS);
            DestroyEffect(AddSpecialEffectTarget(Ignite.Sfx, this.target, "head"));
            if (this.spreadTicks && this.ticks % this.spreadTicks) {
                this.Spread();
            }
        } else {
            PauseTimer(this.timer);
            DestroyTimer(this.timer);
            delete Ignite._ignites[GetHandleId(this.caster)][GetHandleId(this.target)];
        }
    }

    private Spread(): void {
        
        print("Ignite.Spread");
    }

    static init(spellId: number) {
        this.SpellId = spellId;
        this.SetDefaultConfig(this.DefaultConfig);
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