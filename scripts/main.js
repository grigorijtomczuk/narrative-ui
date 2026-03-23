import { MODULE_ID } from "./constants.js";

export function modifyCanvasTokenBorder() {
	function getDispositionColor(token) {
		const colors = CONFIG.Canvas.dispositionColors;

		if (!game.user.isGM && (token.controlled || token.actor?.isOwner))
			return colors.CONTROLLED;
		if (token.actor?.hasPlayerOwner) return colors.PARTY;

		switch (token.document.disposition) {
			case CONST.TOKEN_DISPOSITIONS.HOSTILE:
				return colors.HOSTILE;
			case CONST.TOKEN_DISPOSITIONS.NEUTRAL:
				return colors.NEUTRAL;
			case CONST.TOKEN_DISPOSITIONS.FRIENDLY:
				return colors.FRIENDLY;
			case CONST.TOKEN_DISPOSITIONS.SECRET:
				return colors.SECRET;
			default:
				return colors.INACTIVE;
		}
	}

	function createIndicator(token, color) {
		const g = new PIXI.Graphics();
		const computedColor = color ?? getDispositionColor(token);
		const lineWidth = 2;

		g.lineStyle(lineWidth, computedColor, 0.5);
		g.drawCircle(0, 0, Math.max(token.w, token.h) / 2 + lineWidth / 2);

		g.x = token.w / 2;
		g.y = token.h / 2;

		token.addChild(g);

		return g;
	}

	function removeIndicator(token, key) {
		const g = token[key];
		if (!g) return;

		token.removeChild(g);
		g.destroy();
		token[key] = null;
	}

	function onRefreshToken(token) {
		token.border.visible = false;
	}

	function onControlToken(token, controlled) {
		if (controlled) {
			if (!token._controlIndicator) {
				token._controlIndicator = createIndicator(token, 0x999999);
			}
		} else {
			removeIndicator(token, "_controlIndicator");
		}
	}

	function onHoverToken(token, hovered) {
		if (hovered) {
			if (!token._hoverIndicator) {
				token._hoverIndicator = createIndicator(token);
			}
		} else {
			removeIndicator(token, "_hoverIndicator");
		}
	}

	Hooks.on("refreshToken", onRefreshToken);
	Hooks.on("controlToken", onControlToken);
	Hooks.on("hoverToken", onHoverToken);
}

export function modifyChatMessagesVisual() {
	function getContrastColor(hex) {
		// normalize (#fff → #ffffff)
		hex = hex.replace("#", "");
		if (hex.length === 3) {
			hex = hex
				.split("")
				.map((c) => c + c)
				.join("");
		}

		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

		return luminance > 160 ? "#222222" : "#efe6d8";
	}

	function onPreCreateChatMessage(message, data, options, userId) {
		const color = message.author?.color ?? "#3b3b3b";
		message.updateSource({
			flags: {
				[MODULE_ID]: {
					headerColor: color,
				},
			},
		});
	}

	function onRenderChatMessage(message, html, messageData) {
		const backgroundColor = message.flags?.[MODULE_ID]?.headerColor;
		const textColor = getContrastColor(backgroundColor);
		html.css("--header-color", backgroundColor);
		html.css("--header-color-transparent", backgroundColor + "80");
		html.css("--header-text-color", textColor);
	}

	Hooks.on("preCreateChatMessage", onPreCreateChatMessage);
	Hooks.on("renderChatMessage", onRenderChatMessage);
	Hooks.once("ready", () => {
		const $chatLog = $(".chat-log");
		$chatLog.removeClass("theme-light");
		$chatLog.addClass("theme-dark");
	});
}

export function disableContextMenuAnimation() {
	libWrapper.register(
		MODULE_ID,
		"foundry.applications.ux.ContextMenu.prototype._animate",
		async function (open) {
			return Promise.resolve();
		},
		"OVERRIDE",
	);
}
