class Units {
    static BloodMage                = FourCC("Hblm");
    static MageFire                 = FourCC("H000");
    static Dummy                    = FourCC("nDUM");
}

class Spells {
    static WildGrowth               = FourCC("A005");  
    static Nourish                  = FourCC("A006");
    static Rejuvenation             = FourCC("A007");  
    static Swiftmend                = FourCC("A008");  
    static ChaosBolt                = FourCC("A009");  
    static Combustion               = FourCC("A00A");  
    static Conflagrate              = FourCC("A00B");  
    static CreateHealthstone        = FourCC("A00C");          
    static CurseOfTheElements       = FourCC("A00D");          
    static EntanglingRoots          = FourCC("A00E");      
    static FireBlast                = FourCC("A00F");  
    static Fireball                 = FourCC("A00G");
    static Flamestrike              = FourCC("A00H");  
    static Immolate                 = FourCC("A00I");
    static Incinerate               = FourCC("A00J");  
    static Ironbark                 = FourCC("Ax0F");
    static Shadowfury               = FourCC("Ax1M");  
    static SoulFire                 = FourCC("Ax1D");
    static SummonFelguard           = FourCC("Ax1R");      
    static SummonImp                = FourCC("Ax1P");  
    static Tranquility              = FourCC("A00K");  
    static Revitalize               = FourCC("A00L");  
    static CrusaderStrike           = FourCC("A00M");      
    static WordOfGlory              = FourCC("A00N");  
    static Judgement                = FourCC("A00O");  
    static AvengersShield           = FourCC("A00P");      
    static DivineProtection         = FourCC("A00Q");      
    static Vindication              = FourCC("A00R");  
    static DevotionAura             = FourCC("A00S");  
    static Scorch                   = FourCC("A00V");
    static ScorchInstant            = FourCC("A00W");      
    static Pyroblast                = FourCC("A00X");  
    static Ignite                   = FourCC("A010");
    static MortalStrike             = FourCC("A015");
    static Slam                     = FourCC("A016");
}

class Auras {
    static WildGrowth               = FourCC("A012");    
    static HolyPower                = FourCC("A00T");
    static HotStreak                = FourCC("A00Z");
    static Ignite                   = FourCC("A011");
}

class Dummies {
    static AvengersShield           = FourCC("A00U");
    static Pyroblast                = FourCC("A00Y");
}

class Buffs {
    static WildGrowth               = FourCC("B000");    
    static HolyPower                = FourCC("B001");    
    static DivineProtection         = FourCC("B003");        
    static HotStreak                = FourCC("B004");    
    static HeatingUp                = FourCC("B006");    
    static ManaShield               = FourCC("BNms");    
    static Ignite                   = FourCC("B005");
    static Immolation               = FourCC("BEim");
}

let path = "ReplaceableTextures\\CommandButtons\\"
class Icons {

    static Regeneration             = path + "BTNRegenerate.blp";
    static Rejuvenation             = path + "BTNRejuvenation.blp";
    static Butterflies              = path + "BTNANA_HealingButterfliesFixed.BLP";
    static GreenBearPaw             = path + "BTNBear-Paw-Blue.blp";
    static Revitalize               = path + "BTNReplenish.blp";
    static MarkOfTheWild            = path + "BTNSpell_Nature_Regeneration.blp";
    static Regrowth                 = path + "BTNSpell_Nature_ResistNature.blp";
    static HealingTouch             = path + "BTNSpell_Nature_HealingTouch.blp";
    static Furor                    = path + "BTNSpell_Nature_UnyeildingStamina.blp";
    static Nourish                  = path + "BTNability_druid_nourish.blp";
    static SwiftRejuvenation        = path + "BTNability_druid_empoweredrejuvination.blp";
    static EmpoweredTouch           = path + "BTNability_druid_empoweredtouch.blp";
    static Swiftmend                = path + "BTNinv_relics_idolofrejuvenation.blp";
    static Efflorescence            = path + "BTNinv_misc_herb_talandrasrose.blp";
    static WildGrowth               = path + "BTNNatureHealingRay.blp";
    static NaturesMajesty           = path + "BTNAdvancedStrengthOfTheMoon.blp";
    static Toughness                = path + "BTNspell_holy_devotion.blp";
    static CrusaderStrike           = path + "BTNspell_holy_crusaderstrike.blp";
    static Judgement                = path + "BTNHolyBash.blp";
    static WordOfGlory              = path + "BTNHeal.blp";
    static Vindication              = path + "BTNspell_holy_vindication.blp";
    static AvengersShield           = path + "BTNspell_holy_avengersshield.blp";
    static EternalGlory             = path + "BTNHealingWave.blp";
    static Divinity                 = path + "BTNspell_holy_blindingheal.blp";
    static JudgementsOfTheWise      = path + "BTNSorceressMaster.blp";
    static TouchedByTheLight        = path + "BTNability_paladin_touchedbylight.blp";
    static DivineProtection         = path + "BTNHumanArmorUpThree.blp";
    static DevotionAura             = path + "BTNDevotion.blp";
    static JudgementArmor           = path + "BTNHoly Paladin.blp";
    static FireBlast                = path + "BTNspell_fire_fireball.blp";
    static Scorch                   = path + "BTNSoulBurn.blp";
    static Pyroblast                = path + "BTNSpell_Fire_Fireball02.blp";
    static Firestarter              = path + "BTNspell_fire_playingwithfire.blp";
    static ImprovedScorch           = path + "BTNSoulBurn.blp";
    static Ignite                   = path + "BTNIncinerate.blp";
    static Wildfire                 = path + "BTNability_mage_worldinflames.blp";
    static HotStreak                = path + "BTNability_mage_hotstreak.blp";
    static Impact                   = path + "BTNWallOfFire.blp";
    static CriticalMass             = path + "BTNability_mage_firestarter.blp";
    static Incinerate               = path + "BTNIncinerateWoW.blp";
}

path = "Models/"
class Models {
    static Rejuvenation             = path + "GreenHealthSpinny20.mdl";
    static Rejuvenation2            = path + "GreenHealthSpinny22.mdl";
    static Swiftmend                = path + "Green Light.mdl";
    static Nourish                  = path + "Healing Surge_01.mdl";
    static Tranquility              = path + "AIreTarget_Green.mdl";
    static Radiance                 = path + "Radiance Holy.mdl";
    static HotStreak                = path + "DoomTarget_01.mdl";
    static HeatingUp                = "Abilities/Spells/Orc/SpiritLink/SpiritLinkTarget.mdl";
    static AirstrikeRocket          = path + "Airstrike Rocket.mdl";
    static FireCrescent             = path + "Fire Crescent Tailed.mdl";
    static TargetCircle             = path + "RedTargetCircle_00.mdl";
}