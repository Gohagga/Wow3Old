export class GlobalCooldown {
    private static _instance: Record<number, GlobalCooldown> = {};

    private onCooldown = false;
    private timer: timer;

    constructor() {
        this.timer = CreateTimer();
    }

    public static Trigger(caster: unit, spellId: number, castTime: number) {
        const casterId = GetHandleId(caster);
        if (!(casterId in this._instance)) {
            this._instance[casterId] = new GlobalCooldown();
        }
        const instance = this._instance[casterId];
        instance.onCooldown = true;
        TimerStart(instance.timer, castTime, false, () => instance.onCooldown = false);
    }

    public static CheckAndTrigger(caster: unit, spellId: number, castTime: number) {
        const casterId = GetHandleId(caster);
        if (!(casterId in this._instance)) {
            this._instance[casterId] = new GlobalCooldown();
        }
        const instance = this._instance[casterId];
        if (instance.onCooldown) {
            return false;
        } else {
            instance.onCooldown = true;
            TimerStart(instance.timer, castTime, false, () => instance.onCooldown = false);
            return true;
        }
    }

    public static IsOnCooldown(caster: unit) {
        const casterId = GetHandleId(caster);
        if (casterId in this._instance) {
            return this._instance[casterId].onCooldown;
        }
        return false;
    }
}