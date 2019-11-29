import { UnitConfigurable } from "Global/UnitConfigurable";
import { Order } from "Global/Order";
import { SpellEvent } from "Global/SpellEvent";
import { HeroStats } from "Global/HeroStats";
import { ProgressBar, CastBar } from "Global/ProgressBars";
import { LastTarget } from "Global/LastTarget";
import { DamageDisplay } from "Global/DamageDisplay";
import { HotStreak } from "./HotStreak";
import { Interruptable } from "Global/Interruptable";
import { SimError } from "Global/SimError";
import { Ignite } from "./Ignite";

export type ScorchConfig = {
    DamageAmount: number,
    CastTime: number,
    Range: number,
    Firestarter: boolean,
    NonInterrupt: number[],
    BonusCrit: number
}

export class Scorch extends UnitConfigurable {
    private static SpellId: number;
    private static BuffId: number;
    private static AttackType = ATTACK_TYPE_MAGIC;
    private static DamageType = DAMAGE_TYPE_MAGIC;
    private static Sfx = "";

    private static DefaultConfig = {
        DamageAmount: 1.5,
        CastTime: 2.0,
        Range: 700.0,
        Firestarter: false,
        NonInterrupt: [ Order.MANASHIELDON ],
        BonusCrit: 0,
    }

    static init(spellId: number, buffId: number, sfxModel: string) {
        this.SpellId = spellId;
        this.BuffId = buffId;
        this.Sfx = sfxModel;

        this.SetDefaultConfig<ScorchConfig>(this.DefaultConfig);
        SpellEvent.RegisterSpellEnd(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const target = LastTarget.Get(caster);
            const data = this.GetUnitConfig<ScorchConfig>(caster);
            const stats = new HeroStats(caster);
            let castTime = data.CastTime / stats.Haste();
            let damage = GetHeroInt(caster, true) * data.DamageAmount;
            let manaBack = 0;

            UnitRemoveAbility(caster, Scorch.BuffId);
            if (CastBar.GetUnitCurrentSpellId(caster) == this.SpellId) {
                return;
            }
            
            const unitOrder = GetUnitCurrentOrder(caster);
            if (!data.Firestarter || !(unitOrder == 0 || unitOrder == Order.MOVE || unitOrder == Order.SMART)) {
                IssueImmediateOrder(caster, "stop");
            }

            if (target) {
                if (IsUnitInRange(caster, target, data.Range)) {

                    SetUnitFacing(caster, Atan2(GetUnitY(caster)-GetUnitY(target), GetUnitX(caster)-GetUnitX(target)));
                    const cb = new CastBar(caster);
                    cb.CastSpell(this.SpellId, castTime, () => {
                        cb.Finish();

                        const tim = CreateTimer();
                        TimerStart(tim, 0.3, false, () => {
                            PauseTimer(tim);
                            DestroyTimer(tim);
                            stats.WithBonusCritDamageDo(data.BonusCrit, () => {
                                UnitDamageTarget(caster, target, damage, true, false, this.AttackType, this.DamageType, WEAPON_TYPE_WHOKNOWS);
                                Ignite.AddIfHasAbility(target, caster, damage);
                                if (DamageDisplay.EventDamageWasCrit) {
                                    HotStreak.Add(caster);
                                }
                            });
                            DestroyEffect(AddSpecialEffectTarget(Scorch.Sfx, target, "chest"));
                        });
                        if (GetUnitCurrentOrder(caster) == 0)
                            SetUnitAnimation(caster, "stand");
                    });
                    if (unitOrder == 0)
                        SetUnitAnimation(caster, "spell channel");

                    Interruptable.Register(caster, (orderId) => {
                        
                        if (data.Firestarter && (orderId == Order.MOVE || orderId == Order.SMART)) {
                            return true;
                        }
                        for (let ignoredOrder of data.NonInterrupt) {
                            if (orderId == ignoredOrder) {
                                return true;
                            }
                        }
                        cb.Destroy();
                        return false;
                    });
                } else {
                    SimError.Msg(GetOwningPlayer(caster), "Target out of range.");
                    manaBack = BlzGetAbilityManaCost(this.SpellId, GetUnitAbilityLevel(caster, this.SpellId));
                    SetUnitState(caster, UNIT_STATE_MANA, GetUnitState(caster, UNIT_STATE_MANA) + manaBack);
                }
            } else {
                SimError.Msg(GetOwningPlayer(caster), "There is no target.");
                manaBack = BlzGetAbilityManaCost(this.SpellId, GetUnitAbilityLevel(caster, this.SpellId));
                SetUnitState(caster, UNIT_STATE_MANA, GetUnitState(caster, UNIT_STATE_MANA) + manaBack);
            }
        });
    }
}