import { TalentTree } from "./TalentTree/TalentTree";
import { TalentTreeView } from "./TalentTree/TalentTreeView";

export class HeroSelect {
    static PlayerHero: unit[] = [];

    static heroSold(): void {
        let u = GetTriggerUnit();
        let hero = GetSoldUnit();
        let owner = GetOwningPlayer(hero);
        let id = GetUnitTypeId(hero);
        let talentTree = null;

        if (id == Units.BloodMage) {

            talentTree = new TalentTree(hero);
        }

        if (talentTree != null)
            TalentTreeView.SetPlayerViewedTree(owner, talentTree);
        
        if (this.PlayerHero[GetPlayerId(owner)])
            RemoveUnit(this.PlayerHero[GetPlayerId(owner)])
        
        UnitAddType(hero, UNIT_TYPE_PEON)
    }

    static init() {
        let t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SELL);
        TriggerAddAction(t, () => this.heroSold)

        t = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_HERO_LEVEL);
        TriggerAddAction(t, () => {
            let u = GetTriggerUnit();

            // TODO: Increase number of points for triggering unit.
            // if (TalentTree[u] and TalentTree[u].pointsAvailable) then TalentTree[u].pointsAvailable = TalentTree[u].pointsAvailable + 1 }
        })
    }

}