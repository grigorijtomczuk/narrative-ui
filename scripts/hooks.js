import {
	disableContextMenuAnimation,
	modifyCanvasTokenBorder,
	modifyChatMessagesVisual,
} from "./main.js";

import { MODULE_ID } from "./constants.js";

Hooks.once("setup", () => {
	modifyChatMessagesVisual();
	disableContextMenuAnimation();
});

Hooks.once("ready", () => {
	if (!game.modules.get("lib-wrapper")?.active && game.user.isGM) {
		ui.notifications.error(
			game.i18n.localize(`${MODULE_ID}.libwrapper-error-message`),
		);
		return;
	}

	modifyCanvasTokenBorder();
});
