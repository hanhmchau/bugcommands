"use strict";
import Commands from "./scripts/commands.js";
import effects from "./scripts/effects.js";

Hooks.on("chatCommandsReady", function (chatCommands) {
	Commands.init(chatCommands);
});

Hooks.on("ready", function () {
	window.BugEffects = effects();
});
