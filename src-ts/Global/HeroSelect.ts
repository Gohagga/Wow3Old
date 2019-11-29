import { TalentTree } from "./TalentTree/TalentTree";
import { TalentTreeView } from "./TalentTree/TalentTreeView";
import { FireMageTalentTree } from "Classes/FireMageTalentTree";

export class HeroSelect {
    static PlayerHero: unit[] = [];

    static heroSold(): void {

        let u = GetTriggerUnit();
        let hero = GetSoldUnit();
        let owner = GetOwningPlayer(hero);
        let id = GetUnitTypeId(hero);
        let talentTree = null;

        if (id == Units.MageFire) {

            talentTree = new FireMageTalentTree(hero);
        }

        if (talentTree != null)
            TalentTreeView.SetPlayerViewedTree(owner, talentTree);
        
        if (this.PlayerHero[GetPlayerId(owner)])
            RemoveUnit(this.PlayerHero[GetPlayerId(owner)])
        
        UnitAddType(hero, UNIT_TYPE_PEON)
        SelectUnitForPlayerSingle(hero, owner);
    }

    static init() {
        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SELL);
        TriggerAddAction(t, () => this.heroSold())
    }

}