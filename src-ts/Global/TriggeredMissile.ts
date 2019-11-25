import { Unit } from "node_modules/w3ts/src/handles/unit";
import { MapPlayer } from "node_modules/w3ts/src/handles/player";
import { Widget } from "node_modules/w3ts/src/handles/widget";

export type TriggeredMissileCallback = (data: TriggeredMissile) => void;

export class TriggeredMissile {
    private static _missileData: Record<number, TriggeredMissile> = {};
    private static DummyId: number;

    public caster: unit;
    public level: number;
    public spellId: number;
    private doCallback: TriggeredMissileCallback = () => null;
    private orderId: number;

    constructor(caster: unit, spellId: number, orderId: number, level: number) {
        this.caster = caster;
        this.level = level;
        this.spellId = spellId;
        this.orderId = orderId;
    }

    public CastAtTargetAsUnitAndDo(target: unit, caster: unit, doCallback: TriggeredMissileCallback) {
        const owner = GetOwningPlayer(this.caster);
        const dummy = new Unit(MapPlayer.fromHandle(owner), TriggeredMissile.DummyId, GetUnitX(caster), GetUnitY(caster), 0.0);
        dummy.addAbility(this.spellId);
        dummy.setAbilityLevel(this.spellId, this.level);
        TriggeredMissile._missileData[GetHandleId(dummy.handle)] = this;
        this.doCallback = doCallback;
        dummy.issueTargetOrder(this.orderId, Widget.fromHandle(target));
    }

    public static init(dummyId: number) {
        this.DummyId = dummyId;

        const t = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DAMAGED)
        TriggerAddAction(t, () => {
            const sourceId = GetHandleId(GetEventDamageSource())
            if (sourceId in TriggeredMissile._missileData) {
                const data = TriggeredMissile._missileData[sourceId];
                data.doCallback(data)
                delete TriggeredMissile._missileData[sourceId];
            }
        })
    }
}