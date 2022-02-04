"use strict";
import Commands from "./scripts/commands.js";

Hooks.on("chatCommandsReady", function (chatCommands) {
	Commands.init(chatCommands);
});
