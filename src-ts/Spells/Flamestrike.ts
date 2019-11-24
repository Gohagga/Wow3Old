import { SpellEvent } from "Global/SpellEvent";

export class Flamestrike {
    static spellId: number = FourCC("AHfs");

    static init() {
        let t = CreateTrigger();
        SpellEvent.RegisterSpellCast(Flamestrike.spellId, () => {
        });

        SpellEvent.RegisterSpellEffect(Flamestrike.spellId, () => {
        });

        SpellEvent.RegisterSpellEnd(Flamestrike.spellId, () => {
        });
    }
}