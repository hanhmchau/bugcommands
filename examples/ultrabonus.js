BugEffects.ultraBonus({
	featureName: "Divine Fury",
	baseDice: "1d6 + floor(@classes.barbarian.levels / 2)",
	damageType: "radiant",
	validActionTypes: ["mwak", "rwak"]
})(args);

BugEffects.ultraBonus({
	featureName: "Necrotic Shroud",
	baseDice: "@details.level",
	damageType: "necrotic",
	validActionTypes: ["mwak", "rwak", "rsak", "msak"]
})(args);
