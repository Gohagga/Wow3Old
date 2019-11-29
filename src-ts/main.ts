import { LibraryLoader } from 'war3-library-loader';
import { InitializeSpells } from 'Modules/Spells';
import { InitializeGlobals } from 'Modules/Globals';
import { SpellEvent } from 'Global/SpellEvent';
import { TalentTreeView } from 'Global/TalentTree/TalentTreeView';
import { HeroSelect } from 'Global/HeroSelect';
import { TriggeredMissile } from 'Global/TriggeredMissile';
import { DamageDisplay } from 'Global/DamageDisplay';
import { Interruptable } from 'Global/Interruptable';
import { LastTarget } from 'Global/LastTarget';
import { SimError } from 'Global/SimError';

require("Config");

function tsMain() {
  // print(hello());

  SpellEvent.init();
  TalentTreeView.init();
  HeroSelect.init();
  TriggeredMissile.init(Units.Dummy);
  DamageDisplay.init();
  Interruptable.init();
  LastTarget.init();
  SimError.init();

  TimerStart(CreateTimer(), 0.1, false, () => {
    InitializeGlobals();
    InitializeSpells();
  })
}

// Handle initialization 
function libLoaderLog(libName: string, success: boolean, message: string) {
  print(`Initializing "${libName}": ${success ? 'Success' : 'Failure'}, "${message}"`);
}

LibraryLoader.logFunction = libLoaderLog;
ceres.addHook("main::after", () => LibraryLoader.runInitializers());
ceres.addHook("main::after", () => tsMain());