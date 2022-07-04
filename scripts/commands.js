import applyCriticalWeakening from "./critical-weakening.js";

export default class Commands {
	static _chatCommands;

	static init(chatCommands) {
		this._chatCommands = chatCommands;
		this.addInjuryLinkCommand();
		this.triggerCriticalWeakening();
	}

	static addInjuryLinkCommand() {
		this._addCommand({
			commandKey: "/injury",
			invokeOnCommand: (chatlog, messageText, chatdata) => {
				const content = this._buildSimpleMessage("/injury", "https://monarchsfactory.wordpress.com/2021/09/29/major-injuries-update/");
				ChatMessage.create({ content });
			},
			shouldDisplayToChat: false,
			iconClass: "fa-user-injured",
			description: "Link to Major Injury table",
			gmOnly: false
		});
	}

	static triggerCriticalWeakening() {
		this._addCommand({
			commandKey: "/critweak",
			invokeOnCommand: (chatlog, messageText, chatdata) => {
				applyCriticalWeakening();
			},
			shouldDisplayToChat: false,
			description: "Trigger Critical Weakening on targeted tokens",
			iconClass: "fa-knife",
			gmOnly: false
		});
	}

	static _buildSimpleMessage(command, content) {
		return `<span>${content}</span><p class="message-subtext">Invoked by command <b>${command}</b></p>`;
	}

	static _addCommand(data) {
		this._chatCommands.registerCommand(this._chatCommands.createCommandFromData(data));
	}
}
