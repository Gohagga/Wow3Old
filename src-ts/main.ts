import { hello } from 'nwtgck-ts-hello'
import { Destructable, MapPlayer, Unit } from 'w3ts';
import { isDestructableTree, setIsDestructableTreeConfig } from 'is-destructable-tree';
import { LibraryLoader } from 'war3-library-loader';
import { SpellEvent } from 'Global/SpellEvent';
import { TalentTreeView } from 'Global/TalentTree/TalentTreeView';
import { FireMageTalentTree } from 'Classes/FireMageTalentTree';
import { Module } from 'Modules/Spells';

require("Config");

function tsMain() {
  // print(hello());

  SpellEvent.init();
  TalentTreeView.init();
  Module.Spells.init();

  TimerStart(CreateTimer(), 0.1, false, () => {
    const fmtt = new FireMageTalentTree(gg_unit_Hblm_0003);
    TalentTreeView.SetPlayerViewedTree(Player(0), fmtt);
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