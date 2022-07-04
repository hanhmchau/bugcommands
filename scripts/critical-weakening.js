import applyEffectsFromItem, { applyEffects } from "./apply-effects.js";

const FALLBACK_EFFECT = {
	label: "Critical Weakened",
	icon: "modules/bugcommands/icons/Status_Weakened.png",
	changes: [
		{
			key: "flags.midi-qol.disadvantage.all",
			value: "1",
			mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM
		}
	],
	duration: {
		rounds: 1
	},
	flags: {
		dae: {
			specialDuration: ["turnEnd"]
		}
	}
};

const DEFAULT_ITEM_NAME = "Critical Weakening";

export default function applyCriticalWeakening() {
	const item = game.items.getName(DEFAULT_ITEM_NAME);
	if (item) {
		applyEffectsFromItem(item);
	} else {
		applyEffects([FALLBACK_EFFECT]);
	}
}
