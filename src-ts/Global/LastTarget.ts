export type LastTargetCondition = (unit: unit, target: unit) => boolean;

export class LastTarget {
    private static _instance: Record<number, LastTarget> = {};
    private static Sfx: string;

    private target: unit | null = null;
    private condition: LastTargetCondition;
    private sfx?: effect;

    constructor(condition: LastTargetCondition) {
        this.condition = condition;
    }

    static Register(unit: unit, condition: LastTargetCondition) {
        this._instance[GetHandleId(unit)] = new LastTarget(condition);
    }

    static Get(unit: unit) {
        return this._instance[GetHandleId(unit)].target;
    }

    static init(model: string) {
        this.Sfx = model;
        const t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
        TriggerAddAction(t, () => {
            const unit = GetTriggerUnit();
            const unitId = GetHandleId(unit);
            if (unitId in this._instance) {
                const target = GetOrderTargetUnit();
                if (target && this._instance[unitId].condition(unit, target)) {
                    let instance = this._instance[unitId];
                    instance.target = target;
                    if (instance.sfx) {
                        DestroyEffect(instance.sfx);
                    }
                    instance.sfx = AddSpecialEffectTarget(LastTarget.Sfx, target, "chest");
                }
            }
        });
    }
}