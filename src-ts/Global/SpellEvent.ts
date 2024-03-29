import { LibraryLoader } from "node_modules/war3-library-loader/src/index";

type SpellEventCallback = () => void;

export class SpellEvent{
    static instance: SpellEvent;
    static spellCastCallbacks: SpellEventCallback[] = [];
    static spellEffectCallbacks: SpellEventCallback[] = []
    static spellEndCallbacks: SpellEventCallback[] = []

    static RegisterSpellCast(spellId: number, callback: SpellEventCallback) {
        SpellEvent.spellCastCallbacks[spellId] = callback
    }

    static RegisterSpellEffect(spellId: number, callback: SpellEventCallback) {
        SpellEvent.spellEffectCallbacks[spellId] = callback
    }

    static RegisterSpellEnd(spellId: number, callback: SpellEventCallback) {
            SpellEvent.spellEndCallbacks[spellId] = callback
    }

    static init() {
        
        let tCast = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(tCast, EVENT_PLAYER_UNIT_SPELL_CAST)
        TriggerAddAction(tCast, () => {
            if (SpellEvent.spellCastCallbacks[GetSpellAbilityId()]) {
                SpellEvent.spellCastCallbacks[GetSpellAbilityId()]();
            }
        });

        let tEffect = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(tEffect, EVENT_PLAYER_UNIT_SPELL_EFFECT)
        TriggerAddAction(tEffect, () => {
            if (SpellEvent.spellEffectCallbacks[GetSpellAbilityId()]) {
                SpellEvent.spellEffectCallbacks[GetSpellAbilityId()]()
            }
        });

        let tEnd = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(tEnd, EVENT_PLAYER_UNIT_SPELL_ENDCAST)
        TriggerAddAction(tEnd, () => {
            if (SpellEvent.spellEndCallbacks[GetSpellAbilityId()]) {
                SpellEvent.spellEndCallbacks[GetSpellAbilityId()]()
            }
        });
    }
}