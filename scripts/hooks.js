import {
	configureModuleAssetStyles,
	disableContextMenuAnimation,
	enableCloseSidebarOnButtonClick,
	enableDialogButtonTextWrapping as enableDnd5eDialogButtonLabelWrapping,
	modifyCanvasTokenBorder,
	modifyChatMessagesVisual,
	replaceDnd5eD6Icon,
} from "./main.js";

import { MODULE_ID } from "./constants.js";

Hooks.once("setup", () => {
	configureModuleAssetStyles();
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
	enableCloseSidebarOnButtonClick();
	enableDnd5eDialogButtonLabelWrapping();
	replaceDnd5eD6Icon();
});
