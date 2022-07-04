import { getCritRoll } from "./utils.js";

const ultraBonus =
	({ featureName, baseDice, damageType, validActionTypes = [] }) =>
	async (args) => {
		if (validActionTypes.length > 0) {
			if (!validActionTypes.includes(args[0].item.data.actionType)) return {}; // weapon attack
		}
		if (args[0].hitTargets.length < 1) return {};
		const token = canvas.tokens.get(args[0].tokenId);
		const actor = token.actor;
		if (!actor || !token || args[0].hitTargets.length < 1) return {};

		let target = canvas.tokens.get(args[0].hitTargets[0].id ?? args[0].hitTargets[0]._id);
		if (!target) MidiQOL.error(`${featureName} macro failed`);
		const featureFlag = simplifyString(featureName);

		if (game.combat && alreadyDone(actor, featureFlag)) {
			MidiQOL.warn(`Already done a ${featureName} this turn`);
			return {};
		}

		const baseRoll = getEvaluateDiceRoll(baseDice.toString(), actor);
		const critRoll = getCritRoll(args[0].isCritical, baseDice.toString(), baseRoll.total);
		const message = game.messages.get(args[0].itemCardId);

		await modifyBetterRolls(message, baseRoll, critRoll, featureName, damageType);

		if (game.combat) {
			markDone(actor, featureFlag);
		}
		updateMidi(baseRoll, critRoll, damageType, target);
	};

function updateMidi(baseRoll, critRoll, damageType, target) {
	const totalDamage = baseRoll.total + (critRoll?.total || 0);
	const targetSet = new Set([target]);
	setTimeout(async () => {
		await MidiQOL.applyTokenDamage([{ damage: totalDamage, type: damageType }], totalDamage, targetSet);
	}, 100);
}

function getCombatTime() {
	return `${game.combat.id}-${game.combat.round + game.combat.turn / 100}`;
}

async function markDone(actor, featureFlag) {
	const combatTime = getCombatTime();
	await actor.setFlag("midi-qol", featureFlag, combatTime);
}

function alreadyDone(actor, featureFlag) {
	const combatTime = getCombatTime();
	const lastTime = actor.getFlag("midi-qol", featureFlag);
	return combatTime === lastTime;
}

async function modifyBetterRolls(message, baseRoll, critRoll, featureName, damageType) {
	const damageGroupEntry = message.BetterRollsCardBinding.roll.entries.filter((entry) => entry.type === "damage-group");
	const newBREntry = {
		type: "damage",
		damageType: damageType,
		context: featureName,
		baseRoll
	};
	if (critRoll) {
		newBREntry.critRoll = critRoll;
	}
	damageGroupEntry[0].entries.push(newBREntry);
	await message.BetterRollsCardBinding.roll.update();
}

function getEvaluateDiceRoll(diceFormula, actor) {
	const roll = new Roll(diceFormula, actor.getRollData());
	roll.evaluate();
	return roll;
}

function simplifyString(str) {
	return str.replace(/\s+/g, "");
}

export default ultraBonus;
