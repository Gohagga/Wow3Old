import { hello } from 'nwtgck-ts-hello'
import { Destructable, MapPlayer, Unit } from 'w3ts';
import { isDestructableTree, setIsDestructableTreeConfig } from 'is-destructable-tree';
import { LibraryLoader } from 'war3-library-loader';
import { SpellEvent } from 'Global/SpellEvent';
import { TalentTreeView } from 'Global/TalentTree/TalentTreeView';
import { FireMageTalentTree } from 'Classes/FireMageTalentTree';
import { InitializeSpells } from 'Modules/Spells';
import { HeroSelect } from 'Global/HeroSelect';
import { TriggeredMissile } from 'Global/TriggeredMissile';
import { DamageDisplay } from 'Global/DamageDisplay';

require("Config");

function tsMain() {
  // print(hello());

  SpellEvent.init();
  TalentTreeView.init();
  HeroSelect.init();
  TriggeredMissile.init(Units.Dummy);
  DamageDisplay.init();

  TimerStart(CreateTimer(), 0.1, false, () => {
    InitializeSpells();
  })
}

// Configure libraries
setIsDestructableTreeConfig({ HARVESTER_UNIT_ID: FourCC("opeo") });

// Handle initialization 
function libLoaderLog(libName: string, success: boolean, message: string) {
  print(`Initializing "${libName}": ${success ? 'Success' : 'Failure'}, "${message}"`);
}

LibraryLoader.logFunction = libLoaderLog;
ceres.addHook("main::after", () => LibraryLoader.runInitializers());
ceres.addHook("main::after", () => tsMain());