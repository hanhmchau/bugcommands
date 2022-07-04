/**
 * Returns the base crit formula, before applying settings to it.
 * Only useful really to test if a crit is even possible
 * @param {string} baseFormula
 * @returns {Roll | null} the base crit formula, or null if there is no dice
 */
function getBaseCritRoll(baseFormula) {
	if (!baseFormula) return null;

	// Remove all flavor from the formula so we can use the regex
	// In the future, go through the terms to determine the bonus crit damage instead
	const strippedRoll = new Roll(baseFormula);
	for (const term of strippedRoll.terms) {
		if (term.options) term.options = {};
	}
	if (strippedRoll.dice.length === 0) {
		return null;
	}

	const critRegex = /[+-]+\s*(?:@[a-zA-Z0-9.]+|[0-9]+(?![Dd]))/g;
	const critFormula = strippedRoll.formula.replace(critRegex, "").concat();
	const critRoll = new Roll(critFormula);
	if (critRoll.terms.every((term) => !(term instanceof DiceTerm || term instanceof StringTerm || term instanceof Die))) {
		return null;
	}

	return critRoll;
}

/**
 * Derives the formula for what should be rolled when a crit occurs.
 * Note: Item is not necessary to calculate it.
 * @param {string} baseFormula
 * @param {number} baseTotal
 * @param {number?} param2.critDice extra crit dice
 * @returns {Roll | null} the crit result, or null if there is no dice
 */
export function getCritRoll(isCritical, baseFormula, baseTotal, { extraCritDice = null } = {}) {
	if (!isCritical) return null;
	let critRoll = getBaseCritRoll(baseFormula);
	if (!critRoll) return null;

	critRoll.alter(1, extraCritDice ?? 0);
	critRoll.roll({ async: false });

	const { critBehavior } = game.settings.get("betterrolls5e", "critBehavior");

	// If critBehavior = 2, maximize base dice
	if (critBehavior === "2") {
		critRoll = new Roll(critRoll.formula).evaluate({ maximize: true, async: false });
	}

	// If critBehavior = 3, maximize base and maximize crit dice
	// Need to get the difference because we're not able to change the base roll from here so we add it to the critical roll
	else if (critBehavior === "3") {
		let maxDifference = new Roll(baseFormula).evaluate({ maximize: true, async: false }).total - baseTotal;
		let newFormula = critRoll.formula + "+" + maxDifference.toString();
		critRoll = new Roll(newFormula).evaluate({ maximize: true, async: false });
	}

	// If critBehavior = 4, maximize base dice and roll crit dice
	// Need to get the difference because we're not able to change the base roll from here so we add it to the critical roll
	else if (critBehavior === "4") {
		let maxRoll = new Roll(baseFormula).evaluate({ maximize: true, async: false });
		let maxDifference = maxRoll.total - baseTotal;
		let newFormula = critRoll.formula + "+" + maxDifference.toString();
		critRoll = new Roll(newFormula).evaluate({ async: false });
	}

	return critRoll;
}
