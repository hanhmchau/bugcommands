export default function applyEffectsFromItem(itemNameOrObject, { specificTargets, stackable = false } = {}) {
	const item = typeof itemNameOrObject === "string" ? game.items.getName(itemNameOrObject) : itemNameOrObject;
	if (!item) {
		ui.notifications.error(`Cannot find the item required: ${itemNameOrObject}`);
		return;
	}
	applyEffects(
		item.effects.contents
			.map((eff) => eff.data)
			.map((eff) => ({
				changes: eff.changes,
				label: eff.label,
				duration: eff.duration,
				flags: eff.flags,
				icon: eff.icon,
				tint: eff.tint
			})),
		{ specificTargets, stackable }
	);
}

export function applyEffects(effects, { specificTargets, stackable = false } = {}) {
	const targets = specificTargets ?? game.user.targets;
	targets.forEach((target) => {
		if (!stackable) {
			const alreadyExistingEffects = new Set(target.actor.data.effects.map((effect) => effect.data.label));
			const newEffects = effects.filter((effect) => !alreadyExistingEffects.has(effect.label));
			target.actor.createEmbeddedDocuments("ActiveEffect", newEffects);
		} else {
			target.actor.createEmbeddedDocuments("ActiveEffect", effects);
		}
	});
}
