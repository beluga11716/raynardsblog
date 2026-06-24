import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "good to see u",

	// 公告内容
	content: "我開悟了，我已經超脫競爭的零和遊戲。但我仍保持謙卑，既然你來了 就與我共進一杯茶吧。",

	// 是否允许用户关闭公告
	closable: false,

	link: {
		// 启用链接
		enable: false,
		// 链接文本
		text: "了解更多",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
