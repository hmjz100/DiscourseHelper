// ==UserScript==
// @name         Discourse 助手
// @namespace    github.com/hmjz100
// @version      1.0.3
// @author       Hmjz100
// @description  重构 “linuxdo 增强插件”，再次以脚本方式为您呈现！
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEl0lEQVRYw72Xe0yVZRzHv8SdUhk2FYGOnLwsQKYjZ5epZQPsQirOUWbFvJXmpWmWNXG6rFjkYGVmMkomTkzlAIdL4H3VzHSWy+a0ieQllRREBQ+Xcz79cY5LD+/hqj3bb2d7n+d9Pp/n977neX6v1PkWKClZUp6kE5JaJOEKh6TTknZIel1SsO5ii5C0QdLF24AdRa2kXEnmnsIzJDV3AewerZLWdAdsknSoB2D3OOTKZKfaY5JqOprUS8JbXl2R+FtSTEfwwZKueprk0YD7WRQ8gI39zZSGD6XCNIz8CDMr+g4kPqAP3rqvI4mLksI9wf0kHTe6Mco/kJwBkZw0x3J+ZAw1Y4ZQlxBB/fPhNE4ZhG2imevPRLI/KpQJ/v6deRyGbZ3RDUm9gvltUAzV0cO5kBBJ/dRQGt6OxfbVFFr2LsN+MgtH1Rc4fk+HkvmwMpH04f07kljhDo/xBD8eGUtVXBS1yWHceGMYTcULoGEb8D1QDpS6osx1rQwuZlP4bgL+ngVuShp4u4DFfZDJ14+DpmiqRkRRN2UgDe+Nxn4uG6gAezE0FRhHs8UlVMn7WSntZeHLW/BQSTb3ARn9Iqh+JJZ/XgynYdloHLV5ztV5AruHw0p1az6Bi55tb7N6QJLmuneG+vhy2BTNuacGc2OmGfuptc50dxZ+K7Ay41g6mjDZk8QLklTm3pHSO4TqYbFcTgrFlvuqM+3Nlq4LOErYfCYd5XyCgiONBLLl2iDu6EgLCeNCXBTXUs3Yz24ASroObyoAu5Ujl9ai0lUoJc1I4KiMUrM8JIzLTz5M40fjnS9Ud1bfVACtxfxV9w3e1tlotcVI4LqhQFpIGPXjTDRtSXX+tboDdwmcvJKDtqegTUdRYLCRRFuBJcGh1I8ZROvepT0TsFvZfe5zlJ+MCs6gAUM6JzDGvzcX4iKx717SMwFKyTiWhrZMRwWXUb82L2K9oYC3vNhlCofc17ov0GyBliLiKl5C21ehTZeQf5A761d52qmm+femceHTQBG0FHZr9flVa1DeWFS6B63ea8RZ51EgSF788XgknP8aHMVdfva11/MJK5qEtsxGu0DJ7xhxEj0KRMmHujnjoGVH1zLgsGK7uY0ndqaivHhUcgRtPI+CerkzalyFrrHA9IBAqPzgzneg2WK8JzRboLUYKOXElW+JKX8Z5Y1HlhJUARr/ihEj49ZhZCjw6SgzNOY7099a5Pxt3gpN+eAo+u8YdpRAazGn63KZf2gxvt/Fo82TUeF+tBOU+rHR/Nck9W1X4EDmDGAfYOVP22ZWnsok9oc1DNmXSdLPi5nzyzzmHJxLyo+zGFE+Fe+t8SgvGW1fjyquIito4kJPh9DS22uBNgP6Bvhx8KfPyDiwjrHrP0SL3kRTZ6Gx09BzC1DWNlRciaxlyFqISipR+WG00+YEpxWhoaM8wfe4V0NtBvn4eOMX0gfJx3gS7yA0MglNWobmZaO3ctDMLJQwC5mi2ytCTkl6sEOBexRVkh4yKkb/D/geSf08VcP3EtwgaXlHHyP3AnxWUmZ7q77bAjWSjrj29kRJvp39DvwXHVKWNlLwEiAAAAAASUVORK5CYII=
// @match        *://linux.do/*
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://unpkg.com/pangu@4.0.7/dist/browser/pangu.js
// @require      https://unpkg.com/marked@14.1.4/marked.min.js
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function DiscourseHelper() {
	'use strict';

	if (document.getElementById('challenge-form')) {
		return;
	}

	let base = {
		initSettings() {
			let defaultSettings = {
				topicNewTab: false,
				bigCloseButton: true,
				replaceEmoji: "fluentui",
				panguText: false,
				optimizeEditor: true,
				japaneseEditor: false,
				previewTopic: true,
				filterByOP: true,
				autoReader: false,
				autoReaderSpeed: 2,
				autoReaderWait: 3,
				floorTopic: true,
				showTopicTime: false,
				showNewTab: true,
				autoHeight: false,
				switchReply: true,
			};

			for (let key in defaultSettings) {
				if (!GM_getValue(key)) {
					GM_setValue(key, defaultSettings[key].toString());
				}
			}
		},
		getFullLink(link) {
			return new URL(link, location.href).href;
		},
		previewTopic(id) {
			let preViewer = `<div id="dialog-holder" class="dialog-container">
				<style>
					#dialog-holder{position:fixed;top:0;left:0;width:100%;height:100%;display:flex !important;justify-content:center;align-items:center}
					#dialog-holder .dialog-content .dialog-body{max-height:600px}
					#dialog-holder .dialog-content .dialog-footer{display:flex;justify-content:flex-end;bottom:0;background-color:var(--secondary);position:sticky}
					#dialog-holder .dialog-content .dialog-footer .btn{margin:0 0 var(--btn-bottom-margin) 1em}
					#dialog-holder .dialog-content .dialog-body > .title{font-size:var(--font-up-3);font-weight:600;padding:0 30px 0;margin-bottom:0}
					#dialog-holder .dialog-content .dialog-body > .date{padding:0 30px 0}
					#dialog-holder .dialog-content .dialog-body .date{color:#666}
					#dialog-holder .dialog-content .dialog-body .content > .item:not(:last-child){border-bottom:1px solid var(--primary-low)}
					#dialog-holder .dialog-content .dialog-body .content > .item{display:flex;align-items:flex-start;margin:15px 30px 0}
					#dialog-holder .dialog-content .dialog-body .content > .item .floor,#dialog-holder .dialog-content .dialog-body .content > .item .avatar img.avatar{width:30px;height:30px;text-align:center;margin-top:15px}
					#dialog-holder .dialog-content .dialog-body .content > .item .post{flex:1;padding:15px;word-break:break-all}
					#dialog-holder .dialog-content .dialog-body .content > .item .post pre code{max-width:620px}
					#dialog-holder .dialog-content .dialog-body .content > .item .post img{max-width:100%;max-height:100%;height:auto}
					#dialog-holder .dialog-content .dialog-body .content > .item .post .name{font-size:16px;color:var(--primary-high-or-secondary-low);display:flex;justify-content:space-between;align-items:center}
					#dialog-holder .dialog-content .dialog-body .content > .item .post .date{color:#b9b9b9;font-size:16px;margin-left:auto}
				</style>
				<div class="dialog-overlay"></div>
				<div class="dialog-content">
					<div class="dialog-body">
						<p style="text-align: center">...</p>
					</div>
					<div class="dialog-footer">
						<button id="showMoreButton" class="btn btn-icon-text btn-primary" type="button">
							<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#discourse-threads"></use></svg>
							<span class="d-button-label">查看更多</span>
						</button>
						<button id="closeButton" class="btn btn-icon-text btn-default" type="button">
							<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>
							<span class="d-button-label">关闭</span>
						</button>
					</div>
				</div>
			</div>`
			let preLoading = `<section id="d-splash">
				<style>
					#d-splash{--dot-color:var(--tertiary);display:grid;place-items:center;height:10vh;background-color:var(--secondary)}
					#d-splash .preloader{--splash-dot-size:max(1vw,25px);--splash-dot-spacing:calc(var(--splash-dot-size) * 1.5);width:calc((var(--splash-dot-size) + var(--splash-dot-spacing)) * 5)}
					#d-splash .preloader .dots{animation-name:d-splash-loader;animation-timing-function:ease-in-out;animation-duration:2s;animation-iteration-count:infinite;animation-delay:calc(var(--n) * 0.15s);position:absolute;top:calc(50% - var(--splash-dot-size) / 0.6);left:calc((50% - var(--splash-dot-size) / 2) + (var(--n) * var(--splash-dot-spacing)));transform-origin:calc((var(--splash-dot-spacing) * var(--n) * -1) + var(--splash-dot-size)/2) center;width:var(--splash-dot-size);height:var(--splash-dot-size);border-radius:50%;background-color:var(--dot-color);filter:saturate(2) opacity(0.85);opacity:0}
					@keyframes d-splash-fade-in{0%{opacity:0}100%{opacity:1}}
					@keyframes d-splash-loader{0%{opacity:0;transform:scale(1)}45%{opacity:1;transform:scale(0.7)}65%{opacity:1;transform:scale(0.7)}100%{opacity:0;transform:scale(1)}}
				</style>
				<div class="preloader" elementtiming="discourse-splash-visible">
					<div class="dots" style="--n:-3;"></div>
					<div class="dots" style="--n:-2;"></div>
					<div class="dots" style="--n:-1;"></div>
					<div class="dots" style="--n:0;"></div>
					<div class="dots" style="--n:1;"></div>
					<div class="dots" style="--n:2;"></div>
					<div class="dots" style="--n:3;"></div>
				</div>
			</section>`
			let viewer = $(preViewer)
			let loading = $(preLoading)
			viewer.find(".dialog-content .dialog-body").html(loading);
			$("body").append(viewer)
			viewer.fadeIn()
			viewer.find(".dialog-overlay, #closeButton").on("click", (event) => {
				viewer.find(".dialog-content .dialog-body").html(loading);
				viewer.remove()
			})
			viewer.find("#showMoreButton").on("click", (event) => {
				window.open(base.getFullLink('/t/topic/' + id))
			})
			fetch(`/t/${id}.json`)
				.then((response) => response.json()).then((data) => {
					if (!viewer.length > 0) return;
					viewer.find(".dialog-content .dialog-body").html(`
						<p class="title">${data.title}</p>
						<p class="date">${formatDate(data.created_at)}</p>
						<div class="content"></div>
					`);
					$.each(data.post_stream.posts, function (index, post) {
						let elempost = $(`<div class="item">
							${post?.avatar_template ? '<div class="avatar"><img class="avatar" src="' + base.getFullLink(post?.avatar_template.replace("{size}", "50")) + '"/></div>' : ""}
							<div class="post">
								<div class="name">
									${post.display_username ? "<span>" + post.display_username + "</span>" : ""}
									${post.username ? '<span' + (post.display_username ? ' style="margin-left: 20px;"' : '') + '>' + post.username + '</span>' : ''}
									<div class="date">${formatDate(post.created_at)}</div>
								</div>
								<p>${post.cooked || (post.action_code ? "<i>动作: " + post.action_code + "</i>" : "")}</p>
							</div>
							<span class="floor">${index + 1}F</span>
						</div>`)
						// 这的函数不能用箭头函数，因为箭头函数没有 this。
						elempost.find("a.lightbox").each(function () {
							let content = $(this).html();
							$(this).replaceWith(content);
						});
						elempost.find("a[href]").each(function () {
							let element = $(this)
							element.attr("parentTopic", id)
						});
						viewer.find(".dialog-content .dialog-body .content").append(elempost);
					});
				})
				.catch(error => {
					console.error(error)
					viewer.find(".dialog-content .dialog-body").html(`<p style="text-align: center;">加载失败，错误：${error.message}</p>`);
				})
		},
		topicNewTab() {
			// 话题列表中的每个项目
			waitForKeyElements('.topic-list-item, tr', (element) => {
				let anchor = element.find('a.title'); // 项目中的链接
				if (!anchor.length > 0 || anchor.attr("target") === "_blank") return;

				let elemclone = element.clone(); // 复制项目，去除原有点击事件

				let aclones = elemclone.find('a'); // 复制后的项目的链接
				aclones.each((index, element) => {
					element = $(element)
					if (!element.attr("href")) return;
					element.attr("target", "_blank"); // 设置新标签页打开
					element.attr("href", base.getFullLink(element.attr('href'))); // 替换为完整链接
					element.on("click", (event) => {
						event.stopPropagation(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
					});
				})
				element.replaceWith(elemclone); // 把原项目替换成复制后的项目
			});

			// 搜索结果链接
			waitForKeyElements('.item > a.search-link', (element) => {
				if (element.attr("target") === "_blank") return;

				let elemclone = element.clone(); // 复制项目，去除原有点击事件

				elemclone.attr("target", "_blank"); // 设置新标签页打开
				elemclone.attr("href", base.getFullLink(elemclone.attr('href'))); // 替换为完整链接
				elemclone.on("click", (event) => {
					event.stopPropagation(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
				});

				element.replaceWith(elemclone);
			});

			// 其它链接
			waitForKeyElements(`
				li.item > a[href*="/t/topic/"],
				li:not([class]) > a[href*="/t/topic/"],
				div > a[href*="/t/topic/"]:not(.arrow, .widget-link, .start-date, .now-date),
				p > a[href*="/t/topic/"],
				.read > a[href*="/t/topic/"],
				div:not(.category-box-heading) > a[href*="/c/"],
				div > a[href*="/tag/"]
			`, (element) => {
				if (element.attr("target") === "_blank") return;

				let elemclone = element.clone(); // 复制项目，去除原有点击事件

				elemclone.attr("target", "_blank"); // 设置新标签页打开
				elemclone.attr("href", base.getFullLink(elemclone.attr('href'))); // 替换为完整链接
				elemclone.on("click", (event) => {
					event.stopPropagation(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
				});

				element.replaceWith(elemclone);
			});
		},
		replaceEmoji(style = "fluentui") {
			let emojiStyles = [
				{ value: "unicode", label: "通用 Unicode" },
				{ value: "noto", label: "谷歌（Noto Emoji）" },
				{ value: "fluentui", label: "微软（FluentUI）" },
				{ value: "twemoji", label: "推特（Twitter Emoji）" },
				{ value: "openmoji", label: "OpenMoji" }
			]
			let hasStyle = emojiStyles.some(emojiStyle => emojiStyle.value === style);
			if (hasStyle) {
				// 更换样式
				waitForKeyElements('img.emoji:not(.emoji-custom)', (element) => {
					let url = new URL(element.attr('src'), location.href)
					let emojiRegex = /images\/emoji\/([^/]+)\//
					let emojiMatch = url.pathname.match(emojiRegex)
					if (emojiMatch?.[1] && emojiMatch?.[1] !== style) {
						url.pathname = url.pathname.replace(emojiRegex, `images/emoji/${style}/`);
						element.attr('src', url.href)
					}
				})
			} else {
				// 替换为系统字符
				waitForKeyElements('img.emoji:not(.emoji-custom)', (element) => {
					let url = new URL(element.attr('src'), location.href)
					let emojiRegex = /images\/emoji\/[^/]+\/([^/.]+)/;
					let emojiMatch = url.pathname.match(emojiRegex);
					if (emojiMatch?.[1]) {
						let emojiName = emojiMatch[1];
						let emojiChar = getEmoji(emojiName)
						if (emojiChar) {
							let elemmoji = $(`<span>${emojiChar}</span>`)
							let newStyles = {};
							Array.from(element[0].attributes).forEach(attr => {
								if (attr.name === "width" || attr.name === "height") {
									newStyles[attr.name] = `${attr.value}px`;
								} else if (attr.name === "style") {
									let existingStyles = attr.value.split(';').reduce((styles, rule) => {
										let [key, value] = rule.split(':').map(part => part.trim());
										if (key && value) styles[key] = value;
										return styles;
									}, {});
									Object.assign(newStyles, existingStyles);
								} else if (attr.name !== "src") {
									elemmoji.attr(attr.name, attr.value);
								}
							});
							if (Object.keys(newStyles).length > 0) {
								elemmoji.css(newStyles);
							}
							element.replaceWith(elemmoji);
						}
					}
				});
			}
		},
		bigCloseButton() {
			waitForKeyElements("#reply-control .save-or-cancel .cancel", (element) => {
				if ($("#bigClose").length > 0) return;
				let realCloseButton = element.parent().find(".btn.btn-text.cancel.btn-transparent");
				realCloseButton.hide();
				let closeButton = $(`<button id="bigClose" style="margin: 0 0.5em;" class="btn btn-icon-text btn-default" type="button" title="关闭">
					<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>
					<span class="d-button-label">关闭</span>
				</button>`)
				closeButton.on('click', () => {
					realCloseButton.click();
				});
				element.before(closeButton)
			})
		},
		panguText() {
			setInterval(() => {
				pangu.spacingElementById('main');
				pangu.spacingElementByClassName("cooked");
				pangu.spacingElementByTagName("h1");
				pangu.spacingElementByTagName('p');
				pangu.spacingElementByTagName('span');
			}, 2000)
		},
		optimizeEditor() {
			waitForKeyElements("#reply-control .save-or-cancel .create", (element) => {
				if ($("#optimize").length > 0) return;
				element.css({ "margin-right": "0.5em" });
				let optimizeButton = $(`<button id="optimize" style="margin: 0 0.5em;" class="btn btn-icon-text btn-default" type="button" title="自动在中英文间添加空格（优化后可能无法撤回）">
					<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#spell-check"></use></svg>
					<span class="d-button-label">排印优化</span>
				</button>`)
				optimizeButton.on('click', () => {
					let editorInput = $(".d-editor-input");
					let originalContent = editorInput.val();
					let content = pangu.spacing(originalContent);
					optimizeButton.prop('disabled', true);
					if (originalContent !== content) {
						editorInput.val("");
						editorInput.focus();
						for (let i = 0; i < content.length > 0; i++) {
							let char = content[i];
							editorInput.val(editorInput.val() + char);

							let inputEvent = new Event("input", { bubbles: true, cancelable: true });
							editorInput[0].dispatchEvent(inputEvent);
							let keyEvent = new KeyboardEvent("keydown", { key: char, char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true });
							editorInput[0].dispatchEvent(keyEvent);
						}
						optimizeButton.find('.d-button-label').text("优化完成");
					} else {
						optimizeButton.find('.d-button-label').text("无需优化");
					}

					setTimeout(() => {
						optimizeButton.prop('disabled', false);
						optimizeButton.find('.d-button-label').text("排印优化");
						optimizeButton.prop('disabled', false);
					}, 1000);
				});
				element.after(optimizeButton)
			})
		},
		japaneseEditor() {
			waitForKeyElements("#reply-control .save-or-cancel .create", (element) => {
				if ($("#optimizeJP").length > 0) return;
				if ($("#optimize").length > 0) { element = $("#optimize") };
				let japaneseButton = $(`<button id="optimizeJP" style="margin: 0 0.5em;" class="btn btn-icon-text btn-default" type="button" title="将内容包裹日文标签，以使系统显示日文字体（优化后可能无法撤回）">
					<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#language"></use></svg>
					<span class="d-button-label">日文优化</span>
				</button>`)
				japaneseButton.click(function () {
					let editorInput = $(".d-editor-textarea-wrapper textarea");
					let currentContent = $(".d-editor-input").val();
					let content = `<div lang="ja">\n\n${currentContent}\n\n</div>`;
					japaneseButton.prop('disabled', true);
					if (currentContent.trim().startsWith("<div lang=\"ja\">") && currentContent.trim().endsWith("</div>")) {
						japaneseButton.find('.d-button-label').text("无需优化");
					} else {
						editorInput.val("");
						editorInput.focus();
						for (let i = 0; i < content.length > 0; i++) {
							let char = content[i];
							editorInput.val(editorInput.val() + char);

							let inputEvent = new Event("input", { bubbles: true, cancelable: true });
							editorInput[0].dispatchEvent(inputEvent);
							let keyEvent = new KeyboardEvent("keydown", { key: char, char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true });
							editorInput[0].dispatchEvent(keyEvent);

							japaneseButton.find('.d-button-label').text("优化完成");
						}
					}

					setTimeout(() => {
						japaneseButton.prop('disabled', false);
						japaneseButton.find('.d-button-label').text("日文优化");
					}, 1000);
				});
				element.after(japaneseButton)
			})
		},
		preViewer() {
			let preButton = `<a title="预览" class="topic-status previewTopic" style="padding-right: 0.1em;">
				<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
					<use href="#eye"></use>
				</svg>
			</a>`
			waitForKeyElements("tr[data-topic-id], h1[data-topic-id]", (element) => {
				let topicId = element.data("topic-id")
				if (element.find(".previewTopic").length > 0 || !topicId) return;
				let status = element.find(".topic-statuses");
				let button = $(preButton);

				let aclones = element.find('a'); // 复制后的项目的链接
				aclones.each((index, element) => {
					element = $(element)
					if (!element.attr("href")) return;
					let url = new URL(element.attr("href"), location.href);
					if (url.host !== location.host) return;
					let topicId = url.pathname.match(/\/t\/topic\/(\d+)/)?.[1];
					if (!topicId) return;
					element.data("preview", "previewed")
				})

				button.on("click", (event) => {
					event.preventDefault(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
					event.stopPropagation(); // 停止链接冒泡，不映射到复制后的项目自己的点击事件
					base.previewTopic(topicId)
				})
				button.attr("preview", topicId)
				status.prepend(button)
			})
			waitForKeyElements(`
				li.item > a[href*="/t/topic/"],
				li:not([class]) > a[href*="/t/topic/"],
				div.topic a[href*="/t/top"],
				div.title a[href*="/t/top"],
				p > a[href*="/t/topic/"]`,
				(element) => {
					if (!element.attr("href") || element.data("preview") || element.is(":hidden") || element.find(".previewTopic").length > 0) return;
					let url = new URL(element.attr("href"), location.href);
					if (url.host !== location.host) return;

					let topicId = element.attr("href").match(/\/t\/topic\/(\d+)/)?.[1];
					let locationTopicId = location.pathname.match(/\/t\/topic\/(\d+)/)?.[1];
					let elemTopicId = element.attr("parentTopic")
					let elemStatus = element.find(".topic-statuses")
					if (!topicId || locationTopicId === topicId || elemTopicId === topicId) return;

					let button = $(preButton);
					button.on("click", (event) => {
						event.preventDefault();
						event.stopPropagation();
						base.previewTopic(topicId);
					});

					button.attr("preview", topicId)
					if (elemStatus.length > 0) elemStatus.prepend(button);
					else element.prepend(button);
				})
		},
		floorTopic() {
			waitForKeyElements(".topic-post article", (element) => {
				if (element.data("floor")) return;
				let floor = element.attr("id")?.match(/^post_(\d+)/)?.[1];
				let infos = element.find(".post-infos")
				if (floor && infos.length > 0) {
					infos.append(`<span class="post-info floor">F${floor}</span>`);
					element.data("floor", floor);
				}
			})
		},
		showTopicTime() {
			waitForKeyElements(".topic-list .age", (element) => {
				let createTime = element.attr("title")?.match(/创建日期：([\s\S]*?)最新：/)?.[1];
				if (createTime) {
					let timestamp = formatTimestamp(createTime)
					if (element.find(".post-activity.create").length > 0) return;
					let now = new Date().getTime();
					let timeDiff = now - timestamp;
					let rtf = new Intl.RelativeTimeFormat("zh-cn", { style: "short" });
					let getContent = (timeDiff) => {
						if (timeDiff < 1e3) {
							return rtf.format(-Math.floor(timeDiff / 1e3), "second");
						} else if (timeDiff < 1e3 * 60) {
							return rtf.format(-Math.floor(timeDiff / 1e3), "second");
						} else if (timeDiff < 1e3 * 60 * 60) {
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60)), "minute");
						} else if (timeDiff < 1e3 * 60 * 60 * 24) {
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60)), "hour");
						} else if (timeDiff < 1e3 * 60 * 60 * 24 * 365) {
							return rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60 * 24)), "day");
						} else {
							element.prepend(`<div class="post-activity"><img style="width:20px;vertical-align:middle;" src="/uploads/default/original/4X/4/0/8/408c29a1d1dfaada3160fb2ae366cf3a7c7c1696.png"></div>`)
							return `${rtf.format(-Math.floor(timeDiff / (1e3 * 60 * 60 * 24 * 365)), "year")}`;
						}
					};
					element.append(`<a class="post-activity create"><span>${pangu.spacing(getContent(timeDiff))}</span></a>`);
				}
			})
		},
		showNewTab() {
			$("body").append(`<style>
				a[target="_blank"]:not([data-clicks], [data-user-card], .badge, .badge-posts, .post-activity, .search-link):after {
					content: "↗️";
					margin-left: 0.2em;
					color: var(--primary-medium);
				}
				a.search-link[target="_blank"] .topic-title:after {
					content: "↗️";
					margin-left: 0.2em;
					color: var(--primary-medium);
				}
			</style>`);
		},
		autoHeight() {
			$("head").append(`<style>
				.topic-body .cooked {
					max-height:600px!important;
					overflow-y:auto!important;
				}
			</style>`);
		},
		switchReply() {
			waitForKeyElements("nav.post-controls .show-replies", (element) => {
				if (element.prop("clicked")) return;
				element.click();
				element.prop("clicked", true);
			})
		},
	}

	base.initSettings();
	if (GM_getValue("topicNewTab") === "true") {
		base.topicNewTab();
	}
	if (GM_getValue("bigCloseButton") === "true") {
		base.bigCloseButton();
	}
	let emojiSetting = GM_getValue("replaceEmoji");
	if (emojiSetting !== "false") {
		base.replaceEmoji(emojiSetting);
	}
	if (GM_getValue("panguText") === "true") {
		base.panguText();
	}
	if (GM_getValue("optimizeEditor") === "true") {
		base.optimizeEditor();
	}
	if (GM_getValue("japaneseEditor") === "true") {
		base.japaneseEditor();
	}
	if (GM_getValue("previewTopic") === "true") {
		base.preViewer();
	}
	if (GM_getValue("floorTopic") === "true") {
		base.floorTopic();
	}
	if (GM_getValue("showTopicTime") === "true") {
		base.showTopicTime();
	}
	if (GM_getValue("showNewTab") === "true") {
		base.showNewTab();
	}
	if (GM_getValue("autoHeight") === "true") {
		base.autoHeight();
	}
	if (GM_getValue("switchReply") === "true") {
		base.switchReply();
	}

	waitForKeyElements('body', (element) => {
		if ($("#discourseHelper").length > 0) return;
		let menu = $(`<div id="discourseHelper"></div>`)
		element.append(menu);
		menu.append(`<style id="discourseHelper-Style">
			html:has(#dialog-holder .dialog-content .dialog-body) {
				overflow: hidden;
			}

			.post-info.floor {
				color: var(--primary-med-or-secondary-med);
				margin-left: 1em;
			}

			div.topic-owner .topic-body .contents>.cooked::after {
				color: var(--tertiary-medium);
				content: "题主";
			}

			tr[data-topic-id]:hover {
				background-color: var(--d-hover);
			}
			tr[data-topic-id] .previewTopic {
				/*display: none;*/
			}
			tr[data-topic-id]:hover .previewTopic {
				display: inline-flex;
			}

			#floating-nav{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;align-items:center;gap:15px;z-index:999}
			.floating-button{width:40px;height:40px;background-color:var(--tertiary);color:#fff;cursor:pointer;transition:background-color 0.2s,box-shadow 0.2s;display:flex;align-items:center;justify-content:center;border-radius:4px}
			.floating-button:hover,.floating-button.hover{box-shadow:0 0 10px 0px #cccccc66;background-color:var(--tertiary-hover)}
			.floating-button svg{width:24px;height:24px;fill:#fff}
			.floating-button:before{transition:all 0.2s;position:absolute;transform:translateY(110%);background-color:rgba(0,0,0,0.8);color:white;padding:5px 10px;border-radius:4px;font-size:12px;white-space:nowrap;pointer-events:none;border-radius:5px;color:#fff;content:attr(data-title);z-index:2;opacity:0}
			.floating-button:hover:before{opacity:1}
		</style>`);

		let buttons = $(`<div id="floating-nav">
			<div id="backToTop" data-title="回到顶部" style="display:none" class="floating-button">
				<svg><use xlink:href="#arrow-up"></use></svg>
			</div>
			<div id="helperSettings" data-title="助手设置" class="floating-button">
				<svg><use xlink:href="#gear"></use></svg>
			</div>
		</div>`)

		buttons.find("#backToTop").on("click", (event) => {
			$('html, body').animate({ scrollTop: 0 }, 500);
		});
		function toggleBackToTop() {
			let scrollTop = $(window).scrollTop();
			let button = buttons.find("#backToTop");
			if (scrollTop > 500) {
				button.fadeIn();
			} else {
				button.fadeOut();
			}
		}
		$(window).on('scroll', toggleBackToTop);
		toggleBackToTop();

		function createFloatingButton(config) {
			let { id, title, icon, onClick, onStart, onCheck } = config;
			if (!id || !title || !icon) return;
			let button = $(`
				<div id="${id}" data-title="${title}" class="floating-button" style="display: none;">
					<svg><use xlink:href="#${icon}"/></svg>
				</div>
			`);
			if (typeof onStart === "function") {
				onStart({ id, title, icon, button });
			}
			if (typeof onClick === "function") {
				button.on("click", (event) => {
					onClick({ event, button });
				});
			}
			if (typeof onCheck === "function") {
				let observer = new MutationObserver(() => {
					if (onCheck()) {
						button.fadeIn();
					} else {
						button.fadeOut();
					}
				});
				observer.observe(document.body, { childList: true, subtree: true });
				if (onCheck()) {
					button.show();
				}
			} else {
				button.attr("style", "")
			}
			buttons.append(button);
		}

		if (GM_getValue("filterByOP") === "true") {
			let styleElement = null;
			let isEnabled = false;
			createFloatingButton({
				id: 'filterByOP',
				title: '只看题主',
				icon: 'far-comments',
				onClick: ({ button }) => {
					isEnabled = !isEnabled;
					button.find("use").attr("xlink:href", isEnabled ? "#far-comment" : "#far-comments");
					if (isEnabled && !styleElement) {
						styleElement = $(`<style>
							.post-stream .topic-post { display: none !important; }
							.post-stream .topic-post.topic-owner { display: block !important; }
						</style>`);
						$("head").append(styleElement);
					} else if (!isEnabled && styleElement) {
						styleElement.remove();
						styleElement = null;
					}
				},
				onCheck: () => $(".post-stream").length > 0 && $(".post-stream .topic-post").length > 0
			});
		}

		if (GM_getValue("autoReader") === "true" && GM_getValue("autoReaderWait") && GM_getValue("autoReaderSpeed") && Number(GM_getValue("autoReaderSpeed")) > 0) {
			let isEnabled = false;
			let timeoutId = null; // 定时器 ID

			function autoScroll(button) {
				if (isEnabled) {
					window.scrollBy(0, Number(GM_getValue("autoReaderSpeed")));
					let scrollTop = $(window).scrollTop();
					let scrollHeight = $(document).height();
					let windowHeight = $(window).height();
					if (scrollTop + windowHeight >= (scrollHeight - 300)) {
						if (!timeoutId) {
							timeoutId = setTimeout(() => {
								isEnabled = false;
								timeoutId = null;
								button.find("use").attr("xlink:href", "#play");
							}, Number(GM_getValue("autoReaderWait")));
						}
					} else {
						if (timeoutId) {
							clearTimeout(timeoutId);
							timeoutId = null;
						}
					}
					requestAnimationFrame(() => autoScroll(button));
				}
			}
			createFloatingButton({
				id: 'autoReader',
				title: '自动滚动',
				icon: 'play',
				onClick: ({ button }) => {
					isEnabled = !isEnabled;
					if (isEnabled) {
						autoScroll(button);
						button.find("use").attr("xlink:href", "#pause");
					} else {
						if (timeoutId) {
							clearTimeout(timeoutId);
							timeoutId = null;
						}
						button.find("use").attr("xlink:href", "#play");
					}
				}
			});
		}

		createFloatingButton({
			id: 'createTopic',
			title: '新建话题',
			icon: 'far-pen-to-square',
			onClick: () => $("#create-topic").click(),
			onCheck: () => $("#create-topic").length > 0
		});

		createFloatingButton({
			id: 'replyTopic',
			title: '回复话题',
			icon: 'reply',
			onClick: () => $(".reply-to-post").click(),
			onCheck: () => {
				return $(".reply-to-post").length > 0
			},
			onStart: () => {
				$(".reply-to-post").hide();
			}
		});

		buttons.find("#helperSettings").on("click", (event) => {
			let timer = null
			let helperSettings = $(`<div id="dialog-holder" class="dialog-container">
				<style>
					#dialog-holder{position:fixed;top:0;left:0;width:100%;height:100%;display:flex !important;justify-content:center;align-items:center}
					#dialog-holder .dialog-content,#dialog-holder .dialog-content > div{min-width:auto}
					#dialog-holder .dialog-content a{margin:0}
					#dialog-holder .dialog-content .dialog-header{justify-content:space-between}
					#dialog-holder .dialog-content .dialog-header > .title{font-size:var(--font-up-3);font-weight:600}
					#dialog-holder .dialog-content .dialog-header > .date{color:#666;font-family:serif}
					#dialog-holder .dialog-content .dialog-body{max-height:600px;padding:15px;margin:0}
					#dialog-holder .dialog-content .dialog-body .controls > *{display:flex;justify-content:space-between;padding:10px 0;align-items:center}
					#dialog-holder .dialog-content .dialog-body .controls select{padding:5px}
					#dialog-holder .dialog-content .dialog-footer{display:flex;justify-content:space-between;bottom:0;background-color:var(--secondary);position:sticky}
					#dialog-holder .dialog-content .dialog-footer .btn{margin:0 0 var(--btn-bottom-margin) 1em}
				</style>
				<div class="dialog-overlay"></div>
				<div class="dialog-content form-vertical">
					<div class="dialog-header">
						<span class="title">设置</span>
						<span class="date">/</span>
					</div>
					<div class="dialog-body control-group">
						<div class="controls">
							<label class="checkbox-label">
								<span>话题 - 在新标签页中打开链接<br/><small>仅适用于“列表项目”元素中的链接</small></span>
								<input type="checkbox" data-setting="topicNewTab">
							</label>
							<label class="checkbox-label">
								<span>话题 - 显示 “预览”<br/><small>按钮通常于话题标题或者链接左侧，图标是一只眼睛<br/>点击后会出现话题前 20 条帖子的弹窗</small></span>
								<input type="checkbox" data-setting="previewTopic">
							</label>
							<label class="checkbox-label">
								<span>话题 - 列表显示 “创建时间”<br/><small>同时还会标注坟贴</small></span>
								<input type="checkbox" data-setting="showTopicTime">
							</label>
							<label class="checkbox-label">
								<span>帖子 - “楼层” 显示<br/><small>会出现在时间右侧</small></span>
								<input type="checkbox" data-setting="floorTopic">
							</label>
							<label class="checkbox-label">
								<span>帖子 - 限高<br/><small>限制帖子文本的高度，超出则独立显示滚动条</small></span>
								<input type="checkbox" data-setting="autoHeight">
							</label>
							<label class="checkbox-label">
								<span>帖子 - 展开回复<br/><small>自动展开帖子回复列表</small></span>
								<input type="checkbox" data-setting="switchReply">
							</label>
							<label class="select-label">
								<span>页面 - 表情替换<br/><small>切换 Emoji 表情的风格</small></span>
								<select data-setting="replaceEmoji">
									<option value="false">关闭</option>
									<option value="system">替换为字符</option>
									<option value="unicode">通用 Unicode</option>
									<option value="noto">谷歌（Noto Emoji）</option>
									<option value="fluentui">微软（FluentUI）</option>
									<option value="twemoji">推特（Twitter Emoji）</option>
									<option value="openmoji">OpenMoji</option>
								</select>
							</label>
							<label class="checkbox-label">
								<span>页面 - 文本排印优化<br/><small>使用 “<a title="又称 Pangu.js" href="https://github.com/vinta/pangu.js/" target="_blank">為什麼你們就是不能加個空格呢？</a>” 自动为文本加入空格。</small></span>
								<input type="checkbox" data-setting="panguText">
							</label>
							<label class="checkbox-label">
								<span>页面 - “新标签页” 指示<br/><small>为可以于新标签页打开的链接增加箭头指示</small></span>
								<input type="checkbox" data-setting="showNewTab">
							</label>
							<label class="checkbox-label">
								<span>编辑 - “关闭” 按钮<br/><small>把关闭的文本变成实体按钮</small></span>
								<input type="checkbox" data-setting="bigCloseButton">
							</label>
							<label class="checkbox-label">
								<span>编辑 - “排印优化” 按钮<br/><small>部分浏览器优化后会无法撤回</small></span>
								<input type="checkbox" data-setting="optimizeEditor">
							</label>
							<label class="checkbox-label">
								<span>编辑 - “日语优化” 按钮<br/><small>部分浏览器优化后会无法撤回</small></span>
								<input type="checkbox" data-setting="japaneseEditor">
							</label>
							<label class="checkbox-label">
								<span>菜单 - 只看题主<br/><small>在浏览帖子时会在右下菜单显示此按钮<br/>如果话题帖子较多，则可能会导致浏览器卡顿</small></span>
								<input type="checkbox" data-setting="filterByOP">
							</label>
							<label class="checkbox-label">
								<span>菜单 - 自动滚动<br/><small>启用后可通过右下菜单中的按钮控制页面自动滚动状态</small></span>
								<input type="checkbox" data-setting="autoReader">
							</label>
							<label class="checkbox-label">
								<span>功能 - 自动滚动 - 速度<br/><small>滚动的速度</small></span>
								<input type="number" data-setting="autoReaderSpeed">
							</label>
							<label class="checkbox-label">
								<span>功能 - 自动滚动 - 等待<br/><small>滚动到最底部后要等待几秒再停止</small></span>
								<input type="number" data-setting="autoReaderWait">
							</label>
						</div>
						<hr>
						<blockquote>
						<div>风雨送春归，飞雪迎春到。已是悬崖百丈冰，犹有花枝俏。</div>
						<div>俏也不争春，只把春来报。待到山花烂漫时，她在丛中笑。</div>
						</blockquote>
					</div>
					<div class="dialog-footer">
						<span style="color: var(--primary-high);">刷新后生效</span>
						<div>
							<button id="symbolDebug" class="btn btn-icon-text btn-default" type="button">
								<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#bug"></use></svg>
								<span class="d-button-label">SymbolDebug</span>
							</button>
							<button id="closeButton" class="btn btn-icon-text btn-primary" type="button">
								<svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>
								<span class="d-button-label">关闭</span>
							</button>
						</div>
					</div>
				</div>
			</div>`)
			helperSettings.find("#closeButton").on("click", (event) => {
				if (timer) clearInterval(timer)
				helperSettings.remove()
			})
			helperSettings.find("#symbolDebug").on("click", (event) => {
				let symbols = Array.from(document.querySelectorAll('symbol'));
				if (symbols.length > 0 === 0) {
					alert('未找到任何 <symbol> 元素');
					return;
				}

				let newDoc = document.implementation.createHTMLDocument('Symbol 预览器');
				newDoc.head.innerHTML = document.head.innerHTML;
				newDoc.title = "Symbol 预览器"
				let newBody = newDoc.body;

				newBody.style.margin = '20px';
				newBody.style.padding = '20px';
				newBody.style.backgroundColor = '#2d303e';
				newBody.style.fontFamily = 'Arial, sans-serif';

				let container = newDoc.createElement('div');
				container.style.display = 'grid';
				container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
				container.style.gap = '40px';
				container.style.alignItems = 'center';
				container.style.justifyItems = 'center';
				newBody.appendChild(container);

				symbols.forEach((symbol, index) => {
					let id = symbol.id || `symbol-auto-${index}`;
					symbol.setAttribute('id', id);

					let svg = newDoc.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svg.setAttribute('id', id);
					svg.setAttribute('width', '80');
					svg.setAttribute('height', '80');
					svg.style.fill = '#2d303e';
					svg.style.backgroundColor = '#bd93f9';
					svg.style.padding = '10px';
					svg.style.boxSizing = 'border-box';

					if (symbol.hasAttribute('viewBox')) {
						svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
					}

					let content = symbol.cloneNode(true);
					while (content.firstChild) {
						svg.appendChild(content.firstChild);
					}

					let wrapper = newDoc.createElement('div');
					wrapper.style.textAlign = 'center';
					wrapper.appendChild(svg);

					let label = newDoc.createElement('div');
					label.textContent = id;
					label.style.marginTop = '5px';
					label.style.fontSize = '12px';
					label.style.color = '#fff';
					wrapper.appendChild(label);

					container.appendChild(wrapper);
				});

				let previewWindow = window.open('', '_blank');
				previewWindow.document.write(newDoc.documentElement.outerHTML);
				previewWindow.document.close();
			})

			helperSettings.find(".controls input[type='checkbox']").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				$(this).prop("checked", settingValue === true || settingValue === "true");
			});
			helperSettings.find(".controls select").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				$(this).val(settingValue);
			});
			helperSettings.find(".controls input[type='number']").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				if (settingValue !== undefined && settingValue !== null) {
					$(this).val(Number(settingValue));
				}
			});
			helperSettings.find(".controls input[type='text']").each(function () {
				let settingKey = $(this).data("setting");
				let settingValue = GM_getValue(settingKey);
				if (settingValue !== undefined && settingValue !== null) {
					$(this).val(settingValue);
				}
			});

			helperSettings.find(".controls input[type='checkbox']").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).is(":checked");
				console.log(newValue)
				GM_setValue(settingKey, newValue.toString());
			});
			helperSettings.find(".controls select").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).val();
				GM_setValue(settingKey, newValue.toString());
			});
			helperSettings.find(".controls input[type='number']").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).val();
				if (!isNaN(newValue)) {
					GM_setValue(settingKey, newValue.toString());
				}
			});
			helperSettings.find(".controls input[type='text']").on("change", function () {
				let settingKey = $(this).data("setting");
				let newValue = $(this).val();
				GM_setValue(settingKey, newValue.toString());
			});

			timer = setInterval(() => {
				helperSettings.find(".dialog-content .dialog-header > .date").text(formatDate(Date.now()))
			}, 500)
			$("body").append(helperSettings)
		})

		menu.append(buttons);
	}, true);

	function formatDate(isoString) {
		let date = new Date(isoString);
		let fYear = date.getFullYear();
		let fMouth = String(date.getMonth() + 1).padStart(2, "0");
		let fDay = String(date.getDate()).padStart(2, "0");

		let hours = date.getHours();
		let isPM = hours >= 12;
		hours = hours % 12 || 12;

		let fHours = String(hours).padStart(2, "0");
		let fMinutes = String(date.getMinutes()).padStart(2, "0");
		let fSeconds = String(date.getSeconds()).padStart(2, "0");
		let period = isPM ? "下午" : "上午";
		return `${fYear}/${fMouth}/${fDay} ${period} ${fHours}:${fMinutes}:${fSeconds}`;
	}

	function formatTimestamp(dateString) {
		if (typeof dateString !== 'string') {
			return null;
		}
		let cDateString = dateString.replace(/\s+/g, '').trim();
		let dateMatch = cDateString.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})$/);
		if (!dateMatch) {
			return null;
		}
		try {
			let [_, year, month, day, hours, minutes] = dateMatch.map(Number);
			let date = new Date(year, month - 1, day, hours, minutes);
			if (isNaN(date.getTime())) {
				return null;
			}
			return date.getTime();
		} catch (error) {
			return null;
		}
	}

	function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
		var targetNodes, btargetsFound;

		if (typeof iframeSelector == "undefined")
			targetNodes = $(selectorTxt);
		else
			targetNodes = $(iframeSelector).contents().find(selectorTxt);

		if (targetNodes && targetNodes.length > 0) {
			btargetsFound = true;
			targetNodes.each(function () {
				var jThis = $(this);
				var alreadyFound = jThis.data('alreadyFound') || false;

				if (!alreadyFound) {
					var cancelFound = actionFunction(jThis);
					if (cancelFound)
						btargetsFound = false;
					else {
						jThis.data('alreadyFound');
					}
				}
			});
		} else {
			btargetsFound = false;
		}

		var controlObj = waitForKeyElements.controlObj || {};
		var controlKey = selectorTxt.replace(/[^\w]/g, "_") + actionFunction.toString().replace(/[^\w]/g, "_");
		var timeControl = controlObj[controlKey];

		if (btargetsFound && bWaitOnce && timeControl) {
			clearInterval(timeControl);
			delete controlObj[controlKey]
		} else {
			if (!timeControl) {
				timeControl = setInterval(() => {
					waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
				}, 300);
				controlObj[controlKey] = timeControl;
			}
		}
		waitForKeyElements.controlObj = controlObj;
	}

	function getEmoji(emojiName) {
		let emojiReplacements = { "😀": "grinning_face", "😃": "grinning_face_with_big_eyes", "😄": "grinning_face_with_smiling_eyes", "😁": "grin", "😆": "laughing", "😅": "sweat_smile", "🤣": "rofl", "😂": "joy", "🙂": "slightly_smiling_face", "🙃": "upside_down_face", "🫠": "melting_face", "😉": "wink", "😊": "blush", "😇": "innocent", "🥰": "smiling_face_with_three_hearts", "😍": "heart_eyes", "🤩": "star_struck", "😘": "face_blowing_a_kiss", "😗": "kissing_face", "☺": "smiling_face", "😚": "kissing_face_with_closed_eyes"， "😙": "kissing_face_with_smiling_eyes", "🥲": "smiling_face_with_tear", "😋": "face_savoring_food", "😛": "face_with_tongue", "😜": "winking_face_with_tongue", "🤪": "zany_face", "😝": "squinting_face_with_tongue", "🤑": "money_mouth_face", "🤗": "hugs", "🤭": "face_with_hand_over_mouth", "🫢": "face_with_open_eyes_and_hand_over_mouth", "🫣": "face_with_peeking_eye", "🤫": "shushing_face", "🤔": "thinking", "🫡": "saluting_face", "🤐": "zipper_mouth_face", "🤨": "face_with_raised_eyebrow", "😐": "neutral_face", "😑": "expressionless_face", "😶": "face_without_mouth", "🫥": "dotted_line_face", "😶‍🌫️": "face_in_clouds", "😏": "smirking_face", "😒": "unamused_face", "🙄": "roll_eyes", "😬": "grimacing", "😮‍💨": "face_exhaling", "🤥": "lying_face", "🫨": "shaking_face", "🙂‍↔️": "head_shaking_horizontally", "🙂‍↕️": "head_shaking_vertically", "😌": "relieved_face", "😔": "pensive_face", "😪": "sleepy_face", "🤤": "drooling_face", "😴": "sleeping_face", "🫩": "face_with_bags_under_eyes", "😷": "face_with_medical_mask"， "🤒": "face_with_thermometer", "🤕": "face_with_head_bandage", "🤢": "nauseated_face", "🤮": "face_vomiting", "🤧": "sneezing_face", "🥵": "hot_face", "🥶": "cold_face", "🥴": "woozy_face", "😵": "face_with_crossed_out_eyes", "😵‍💫": "face_with_spiral_eyes", "🤯": "exploding_head", "🤠": "cowboy_hat_face", "🥳": "partying_face", "🥸": "disguised_face", "😎": "smiling_face_with_sunglasses", "🤓": "nerd_face", "🧐": "face_with_monocle", "😕": "confused", "🫤": "face_with_diagonal_mouth"， "😟": "worried", "🙁": "slightly_frowning_face", "☹": "frowning", "😮": "open_mouth", "😯": "hushed_face", "😲": "astonished_face", "😳": "flushed_face", "🥺": "pleading_face", "🥹": "face_holding_back_tears", "😦": "frowning_face_with_open_mouth", "😧": "anguished_face", "😨": "fearful", "😰": "anxious_face_with_sweat", "😥": "sad_but_relieved_face", "😢": "cry", "😭": "sob", "😱": "scream", "😖": "confounded_face", "😣": "persevering_face", "😞": "disappointed_face", "😓": "downcast_face_with_sweat", "😩": "weary_face", "😫": "tired_face", "🥱": "yawning_face", "😤": "face_with_steam_from_nose", "😡": "enraged_face", "😠": "angry", "🤬": "face_with_symbols_on_mouth", "😈": "smiling_face_with_horns", "👿": "angry_face_with_horns", "💀": "skull", "☠": "skull_and_crossbones", "💩": "poop", "🤡": "clown_face", "👹": "ogre", "👺": "goblin", "👻": "ghost", "👽": "alien", "👾": "alien_monster", "🤖": "robot", "😺": "grinning_cat", "😸": "grinning_cat_with_smiling_eyes", "😹": "joy_cat", "😻": "smiling_cat_with_heart_eyes", "😼": "cat_with_wry_smile", "😽": "kissing_cat", "🙀": "weary_cat", "😿": "crying_cat", "😾": "pouting_cat", "🙈": "see_no_evil_monkey", "🙉": "hear_no_evil_monkey", "🙊": "speak_no_evil_monkey", "💌": "love_letter", "💘": "heart_with_arrow", "💝": "heart_with_ribbon", "💖": "sparkling_heart", "💗": "growing_heart", "💓": "beating_heart", "💞": "revolving_hearts", "💕": "two_hearts", "💟": "heart_decoration", "❣": "heart_exclamation", "💔": "broken_heart", "❤️‍🔥": "heart_on_fire", "❤️‍🩹": "mending_heart", "❤": "heart", "🩷": "pink_heart", "🧡": "orange_heart", "💛": "yellow_heart", "💚": "green_heart", "💙": "blue_heart", "🩵": "light_blue_heart", "💜": "purple_heart", "🤎": "brown_heart", "🖤": "black_heart", "🩶": "grey_heart", "🤍": "white_heart", "💋": "kiss_mark", "💯": "100", "💢": "anger_symbol", "💥": "collision", "💫": "dizzy", "💦": "sweat_droplets", "💨": "dashing_away", "🕳": "hole", "💬": "speech_balloon", "👁️‍🗨️": "eye_in_speech_bubble", "🗨": "left_speech_bubble", "🗯": "right_anger_bubble", "💭": "thought_balloon", "💤": "zzz", "👋": "waving_hand", "👋🏻": "waving_hand:t2", "👋🏼": "waving_hand:t3", "👋🏽": "waving_hand:t4", "👋🏾": "waving_hand:t5", "👋🏿": "waving_hand:t6", "🤚": "raised_back_of_hand", "🤚🏻": "raised_back_of_hand:t2", "🤚🏼": "raised_back_of_hand:t3", "🤚🏽": "raised_back_of_hand:t4", "🤚🏾": "raised_back_of_hand:t5", "🤚🏿": "raised_back_of_hand:t6", "🖐": "hand_with_fingers_splayed", "🖐🏻": "hand_with_fingers_splayed:t2", "🖐🏼": "hand_with_fingers_splayed:t3", "🖐🏽": "hand_with_fingers_splayed:t4", "🖐🏾": "hand_with_fingers_splayed:t5", "🖐🏿": "hand_with_fingers_splayed:t6", "✋": "raised_hand", "✋🏻": "raised_hand:t2", "✋🏼": "raised_hand:t3", "✋🏽": "raised_hand:t4", "✋🏾": "raised_hand:t5", "✋🏿": "raised_hand:t6", "🖖": "vulcan_salute", "🖖🏻": "vulcan_salute:t2", "🖖🏼": "vulcan_salute:t3", "🖖🏽": "vulcan_salute:t4", "🖖🏾": "vulcan_salute:t5", "🖖🏿": "vulcan_salute:t6", "🫱": "rightwards_hand", "🫱🏻": "rightwards_hand:t2", "🫱🏼": "rightwards_hand:t3", "🫱🏽": "rightwards_hand:t4", "🫱🏾": "rightwards_hand:t5", "🫱🏿": "rightwards_hand:t6", "🫲": "leftwards_hand", "🫲🏻": "leftwards_hand:t2", "🫲🏼": "leftwards_hand:t3", "🫲🏽": "leftwards_hand:t4", "🫲🏾": "leftwards_hand:t5", "🫲🏿": "leftwards_hand:t6", "🫳": "palm_down_hand", "🫳🏻": "palm_down_hand:t2", "🫳🏼": "palm_down_hand:t3", "🫳🏽": "palm_down_hand:t4", "🫳🏾": "palm_down_hand:t5", "🫳🏿": "palm_down_hand:t6", "🫴": "palm_up_hand", "🫴🏻": "palm_up_hand:t2", "🫴🏼": "palm_up_hand:t3", "🫴🏽": "palm_up_hand:t4", "🫴🏾": "palm_up_hand:t5", "🫴🏿": "palm_up_hand:t6", "🫷": "leftwards_pushing_hand", "🫷🏻": "leftwards_pushing_hand:t2", "🫷🏼": "leftwards_pushing_hand:t3", "🫷🏽": "leftwards_pushing_hand:t4", "🫷🏾": "leftwards_pushing_hand:t5", "🫷🏿": "leftwards_pushing_hand:t6", "🫸": "rightwards_pushing_hand", "🫸🏻": "rightwards_pushing_hand:t2", "🫸🏼": "rightwards_pushing_hand:t3", "🫸🏽": "rightwards_pushing_hand:t4", "🫸🏾": "rightwards_pushing_hand:t5", "🫸🏿": "rightwards_pushing_hand:t6", "👌": "ok_hand", "👌🏻": "ok_hand:t2", "👌🏼": "ok_hand:t3", "👌🏽": "ok_hand:t4", "👌🏾": "ok_hand:t5", "👌🏿": "ok_hand:t6", "🤌": "pinched_fingers", "🤌🏻": "pinched_fingers:t2", "🤌🏼": "pinched_fingers:t3", "🤌🏽": "pinched_fingers:t4", "🤌🏾": "pinched_fingers:t5", "🤌🏿": "pinched_fingers:t6", "🤏": "pinching_hand", "🤏🏻": "pinching_hand:t2", "🤏🏼": "pinching_hand:t3", "🤏🏽": "pinching_hand:t4", "🤏🏾": "pinching_hand:t5", "🤏🏿": "pinching_hand:t6", "✌": "victory_hand", "✌🏻": "victory_hand:t2", "✌🏼": "victory_hand:t3", "✌🏽": "victory_hand:t4", "✌🏾": "victory_hand:t5", "✌🏿": "victory_hand:t6", "🤞": "crossed_fingers", "🤞🏻": "crossed_fingers:t2", "🤞🏼": "crossed_fingers:t3", "🤞🏽": "crossed_fingers:t4", "🤞🏾": "crossed_fingers:t5", "🤞🏿": "crossed_fingers:t6", "🫰": "hand_with_index_finger_and_thumb_crossed", "🫰🏻": "hand_with_index_finger_and_thumb_crossed:t2", "🫰🏼": "hand_with_index_finger_and_thumb_crossed:t3", "🫰🏽": "hand_with_index_finger_and_thumb_crossed:t4", "🫰🏾": "hand_with_index_finger_and_thumb_crossed:t5", "🫰🏿": "hand_with_index_finger_and_thumb_crossed:t6", "🤟": "love_you_gesture", "🤟🏻": "love_you_gesture:t2", "🤟🏼": "love_you_gesture:t3", "🤟🏽": "love_you_gesture:t4", "🤟🏾": "love_you_gesture:t5", "🤟🏿": "love_you_gesture:t6", "🤘": "sign_of_the_horns", "🤘🏻": "sign_of_the_horns:t2", "🤘🏼": "sign_of_the_horns:t3", "🤘🏽": "sign_of_the_horns:t4", "🤘🏾": "sign_of_the_horns:t5", "🤘🏿": "sign_of_the_horns:t6", "🤙": "call_me_hand", "🤙🏻": "call_me_hand:t2", "🤙🏼": "call_me_hand:t3", "🤙🏽": "call_me_hand:t4", "🤙🏾": "call_me_hand:t5", "🤙🏿": "call_me_hand:t6", "👈": "backhand_index_pointing_left", "👈🏻": "backhand_index_pointing_left:t2", "👈🏼": "backhand_index_pointing_left:t3", "👈🏽": "backhand_index_pointing_left:t4", "👈🏾": "backhand_index_pointing_left:t5", "👈🏿": "backhand_index_pointing_left:t6", "👉": "backhand_index_pointing_right", "👉🏻": "backhand_index_pointing_right:t2", "👉🏼": "backhand_index_pointing_right:t3", "👉🏽": "backhand_index_pointing_right:t4", "👉🏾": "backhand_index_pointing_right:t5", "👉🏿": "backhand_index_pointing_right:t6", "👆": "backhand_index_pointing_up", "👆🏻": "backhand_index_pointing_up:t2", "👆🏼": "backhand_index_pointing_up:t3", "👆🏽": "backhand_index_pointing_up:t4", "👆🏾": "backhand_index_pointing_up:t5", "👆🏿": "backhand_index_pointing_up:t6", "🖕": "fu", "🖕🏻": "fu:t2", "🖕🏼": "fu:t3", "🖕🏽": "fu:t4", "🖕🏾": "fu:t5", "🖕🏿": "fu:t6", "👇": "backhand_index_pointing_down", "👇🏻": "backhand_index_pointing_down:t2", "👇🏼": "backhand_index_pointing_down:t3", "👇🏽": "backhand_index_pointing_down:t4", "👇🏾": "backhand_index_pointing_down:t5", "👇🏿": "backhand_index_pointing_down:t6", "☝": "index_pointing_up", "☝🏻": "index_pointing_up:t2", "☝🏼": "index_pointing_up:t3", "☝🏽": "index_pointing_up:t4", "☝🏾": "index_pointing_up:t5", "☝🏿": "index_pointing_up:t6", "🫵": "index_pointing_at_the_viewer", "🫵🏻": "index_pointing_at_the_viewer:t2", "🫵🏼": "index_pointing_at_the_viewer:t3", "🫵🏽": "index_pointing_at_the_viewer:t4", "🫵🏾": "index_pointing_at_the_viewer:t5", "🫵🏿": "index_pointing_at_the_viewer:t6", "👍": "+1", "👍🏻": "+1:t2", "👍🏼": "+1:t3", "👍🏽": "+1:t4", "👍🏾": "+1:t5", "👍🏿": "+1:t6", "👎": "-1", "👎🏻": "-1:t2", "👎🏼": "-1:t3", "👎🏽": "-1:t4", "👎🏾": "-1:t5", "👎🏿": "-1:t6", "✊": "raised_fist", "✊🏻": "raised_fist:t2", "✊🏼": "raised_fist:t3", "✊🏽": "raised_fist:t4", "✊🏾": "raised_fist:t5", "✊🏿": "raised_fist:t6", "👊": "oncoming_fist", "👊🏻": "oncoming_fist:t2", "👊🏼": "oncoming_fist:t3", "👊🏽": "oncoming_fist:t4", "👊🏾": "oncoming_fist:t5", "👊🏿": "oncoming_fist:t6", "🤛": "left_facing_fist", "🤛🏻": "left_facing_fist:t2", "🤛🏼": "left_facing_fist:t3", "🤛🏽": "left_facing_fist:t4", "🤛🏾": "left_facing_fist:t5", "🤛🏿": "left_facing_fist:t6", "🤜": "right_facing_fist", "🤜🏻": "right_facing_fist:t2", "🤜🏼": "right_facing_fist:t3", "🤜🏽": "right_facing_fist:t4", "🤜🏾": "right_facing_fist:t5", "🤜🏿": "right_facing_fist:t6", "👏": "clap", "👏🏻": "clap:t2", "👏🏼": "clap:t3", "👏🏽": "clap:t4", "👏🏾": "clap:t5", "👏🏿": "clap:t6", "🙌": "raising_hands", "🙌🏻": "raising_hands:t2", "🙌🏼": "raising_hands:t3", "🙌🏽": "raising_hands:t4", "🙌🏾": "raising_hands:t5", "🙌🏿": "raising_hands:t6", "🫶": "heart_hands", "🫶🏻": "heart_hands:t2", "🫶🏼": "heart_hands:t3", "🫶🏽": "heart_hands:t4", "🫶🏾": "heart_hands:t5", "🫶🏿": "heart_hands:t6", "👐": "open_hands", "👐🏻": "open_hands:t2", "👐🏼": "open_hands:t3", "👐🏽": "open_hands:t4", "👐🏾": "open_hands:t5", "👐🏿": "open_hands:t6", "🤲": "palms_up_together", "🤲🏻": "palms_up_together:t2", "🤲🏼": "palms_up_together:t3", "🤲🏽": "palms_up_together:t4", "🤲🏾": "palms_up_together:t5", "🤲🏿": "palms_up_together:t6", "🤝": "handshake", "🤝🏻": "handshake:t2", "🤝🏼": "handshake:t3", "🤝🏽": "handshake:t4", "🤝🏾": "handshake:t5", "🤝🏿": "handshake:t6", "🙏": "folded_hands", "🙏🏻": "folded_hands:t2", "🙏🏼": "folded_hands:t3", "🙏🏽": "folded_hands:t4", "🙏🏾": "folded_hands:t5", "🙏🏿": "folded_hands:t6", "✍": "writing_hand", "✍🏻": "writing_hand:t2", "✍🏼": "writing_hand:t3", "✍🏽": "writing_hand:t4", "✍🏾": "writing_hand:t5", "✍🏿": "writing_hand:t6", "💅": "nail_polish", "💅🏻": "nail_polish:t2", "💅🏼": "nail_polish:t3", "💅🏽": "nail_polish:t4", "💅🏾": "nail_polish:t5", "💅🏿": "nail_polish:t6", "🤳": "selfie", "🤳🏻": "selfie:t2", "🤳🏼": "selfie:t3", "🤳🏽": "selfie:t4", "🤳🏾": "selfie:t5", "🤳🏿": "selfie:t6", "💪": "flexed_biceps", "💪🏻": "flexed_biceps:t2", "💪🏼": "flexed_biceps:t3", "💪🏽": "flexed_biceps:t4", "💪🏾": "flexed_biceps:t5", "💪🏿": "flexed_biceps:t6", "🦾": "mechanical_arm", "🦿": "mechanical_leg", "🦵": "leg", "🦵🏻": "leg:t2", "🦵🏼": "leg:t3", "🦵🏽": "leg:t4", "🦵🏾": "leg:t5", "🦵🏿": "leg:t6", "🦶": "foot", "🦶🏻": "foot:t2", "🦶🏼": "foot:t3", "🦶🏽": "foot:t4", "🦶🏾": "foot:t5", "🦶🏿": "foot:t6", "👂": "ear", "👂🏻": "ear:t2", "👂🏼": "ear:t3", "👂🏽": "ear:t4", "👂🏾": "ear:t5", "👂🏿": "ear:t6", "🦻": "ear_with_hearing_aid", "🦻🏻": "ear_with_hearing_aid:t2", "🦻🏼": "ear_with_hearing_aid:t3", "🦻🏽": "ear_with_hearing_aid:t4", "🦻🏾": "ear_with_hearing_aid:t5", "🦻🏿": "ear_with_hearing_aid:t6", "👃": "nose", "👃🏻": "nose:t2", "👃🏼": "nose:t3", "👃🏽": "nose:t4", "👃🏾": "nose:t5", "👃🏿": "nose:t6", "🧠": "brain", "🫀": "anatomical_heart", "🫁": "lungs", "🦷": "tooth", "🦴": "bone", "👀": "eyes", "👁": "eye", "👅": "tongue", "👄": "mouth", "🫦": "biting_lip", "👶": "baby", "👶🏻": "baby:t2", "👶🏼": "baby:t3", "👶🏽": "baby:t4", "👶🏾": "baby:t5", "👶🏿": "baby:t6", "🧒": "child", "🧒🏻": "child:t2", "🧒🏼": "child:t3", "🧒🏽": "child:t4", "🧒🏾": "child:t5", "🧒🏿": "child:t6", "👦": "boy", "👦🏻": "boy:t2", "👦🏼": "boy:t3", "👦🏽": "boy:t4", "👦🏾": "boy:t5", "👦🏿": "boy:t6", "👧": "girl", "👧🏻": "girl:t2", "👧🏼": "girl:t3", "👧🏽": "girl:t4", "👧🏾": "girl:t5", "👧🏿": "girl:t6", "🧑": "person", "🧑🏻": "person:t2", "🧑🏼": "person:t3", "🧑🏽": "person:t4", "🧑🏾": "person:t5", "🧑🏿": "person:t6", "👱": "person_blond_hair", "👱🏻": "person_blond_hair:t2", "👱🏼": "person_blond_hair:t3", "👱🏽": "person_blond_hair:t4", "👱🏾": "person_blond_hair:t5", "👱🏿": "person_blond_hair:t6", "👨": "man", "👨🏻": "man:t2", "👨🏼": "man:t3", "👨🏽": "man:t4", "👨🏾": "man:t5", "👨🏿": "man:t6", "🧔": "person_beard", "🧔🏻": "person_beard:t2", "🧔🏼": "person_beard:t3", "🧔🏽": "person_beard:t4", "🧔🏾": "person_beard:t5", "🧔🏿": "person_beard:t6", "🧔‍♂️": "man_beard", "🧔🏻‍♂️": "man_beard:t2", "🧔🏼‍♂️": "man_beard:t3", "🧔🏽‍♂️": "man_beard:t4", "🧔🏾‍♂️": "man_beard:t5", "🧔🏿‍♂️": "man_beard:t6", "🧔‍♀️": "woman_beard", "🧔🏻‍♀️": "woman_beard:t2", "🧔🏼‍♀️": "woman_beard:t3", "🧔🏽‍♀️": "woman_beard:t4", "🧔🏾‍♀️": "woman_beard:t5", "🧔🏿‍♀️": "woman_beard:t6", "👨‍🦰": "man_red_hair", "👨🏻‍🦰": "man_red_hair:t2", "👨🏼‍🦰": "man_red_hair:t3", "👨🏽‍🦰": "man_red_hair:t4", "👨🏾‍🦰": "man_red_hair:t5", "👨🏿‍🦰": "man_red_hair:t6", "👨‍🦱": "man_curly_hair", "👨🏻‍🦱": "man_curly_hair:t2", "👨🏼‍🦱": "man_curly_hair:t3", "👨🏽‍🦱": "man_curly_hair:t4", "👨🏾‍🦱": "man_curly_hair:t5", "👨🏿‍🦱": "man_curly_hair:t6", "👨‍🦳": "man_white_hair", "👨🏻‍🦳": "man_white_hair:t2", "👨🏼‍🦳": "man_white_hair:t3", "👨🏽‍🦳": "man_white_hair:t4", "👨🏾‍🦳": "man_white_hair:t5", "👨🏿‍🦳": "man_white_hair:t6", "👨‍🦲": "man_bald", "👨🏻‍🦲": "man_bald:t2", "👨🏼‍🦲": "man_bald:t3", "👨🏽‍🦲": "man_bald:t4", "👨🏾‍🦲": "man_bald:t5", "👨🏿‍🦲": "man_bald:t6", "👩": "woman", "👩🏻": "woman:t2", "👩🏼": "woman:t3", "👩🏽": "woman:t4", "👩🏾": "woman:t5", "👩🏿": "woman:t6", "👩‍🦰": "woman_red_hair", "👩🏻‍🦰": "woman_red_hair:t2", "👩🏼‍🦰": "woman_red_hair:t3", "👩🏽‍🦰": "woman_red_hair:t4", "👩🏾‍🦰": "woman_red_hair:t5", "👩🏿‍🦰": "woman_red_hair:t6", "🧑‍🦰": "person_red_hair", "🧑🏻‍🦰": "person_red_hair:t2", "🧑🏼‍🦰": "person_red_hair:t3", "🧑🏽‍🦰": "person_red_hair:t4", "🧑🏾‍🦰": "person_red_hair:t5", "🧑🏿‍🦰": "person_red_hair:t6", "👩‍🦱": "woman_curly_hair", "👩🏻‍🦱": "woman_curly_hair:t2", "👩🏼‍🦱": "woman_curly_hair:t3", "👩🏽‍🦱": "woman_curly_hair:t4", "👩🏾‍🦱": "woman_curly_hair:t5", "👩🏿‍🦱": "woman_curly_hair:t6", "🧑‍🦱": "person_curly_hair", "🧑🏻‍🦱": "person_curly_hair:t2", "🧑🏼‍🦱": "person_curly_hair:t3", "🧑🏽‍🦱": "person_curly_hair:t4", "🧑🏾‍🦱": "person_curly_hair:t5", "🧑🏿‍🦱": "person_curly_hair:t6", "👩‍🦳": "woman_white_hair", "👩🏻‍🦳": "woman_white_hair:t2", "👩🏼‍🦳": "woman_white_hair:t3", "👩🏽‍🦳": "woman_white_hair:t4", "👩🏾‍🦳": "woman_white_hair:t5", "👩🏿‍🦳": "woman_white_hair:t6", "🧑‍🦳": "person_white_hair", "🧑🏻‍🦳": "person_white_hair:t2", "🧑🏼‍🦳": "person_white_hair:t3", "🧑🏽‍🦳": "person_white_hair:t4", "🧑🏾‍🦳": "person_white_hair:t5", "🧑🏿‍🦳": "person_white_hair:t6", "👩‍🦲": "woman_bald", "👩🏻‍🦲": "woman_bald:t2", "👩🏼‍🦲": "woman_bald:t3", "👩🏽‍🦲": "woman_bald:t4", "👩🏾‍🦲": "woman_bald:t5", "👩🏿‍🦲": "woman_bald:t6", "🧑‍🦲": "person_bald", "🧑🏻‍🦲": "person_bald:t2", "🧑🏼‍🦲": "person_bald:t3", "🧑🏽‍🦲": "person_bald:t4", "🧑🏾‍🦲": "person_bald:t5", "🧑🏿‍🦲": "person_bald:t6", "👱‍♀️": "blonde_woman", "👱🏻‍♀️": "blonde_woman:t2", "👱🏼‍♀️": "blonde_woman:t3", "👱🏽‍♀️": "blonde_woman:t4", "👱🏾‍♀️": "blonde_woman:t5", "👱🏿‍♀️": "blonde_woman:t6", "👱‍♂️": "blonde_man", "👱🏻‍♂️": "blonde_man:t2", "👱🏼‍♂️": "blonde_man:t3", "👱🏽‍♂️": "blonde_man:t4", "👱🏾‍♂️": "blonde_man:t5", "👱🏿‍♂️": "blonde_man:t6", "🧓": "older_person", "🧓🏻": "older_person:t2", "🧓🏼": "older_person:t3", "🧓🏽": "older_person:t4", "🧓🏾": "older_person:t5", "🧓🏿": "older_person:t6", "👴": "old_man", "👴🏻": "old_man:t2", "👴🏼": "old_man:t3", "👴🏽": "old_man:t4", "👴🏾": "old_man:t5", "👴🏿": "old_man:t6", "👵": "old_woman", "👵🏻": "old_woman:t2", "👵🏼": "old_woman:t3", "👵🏽": "old_woman:t4", "👵🏾": "old_woman:t5", "👵🏿": "old_woman:t6", "🙍": "person_frowning", "🙍🏻": "person_frowning:t2", "🙍🏼": "person_frowning:t3", "🙍🏽": "person_frowning:t4", "🙍🏾": "person_frowning:t5", "🙍🏿": "person_frowning:t6", "🙍‍♂️": "man_frowning", "🙍🏻‍♂️": "man_frowning:t2", "🙍🏼‍♂️": "man_frowning:t3", "🙍🏽‍♂️": "man_frowning:t4", "🙍🏾‍♂️": "man_frowning:t5", "🙍🏿‍♂️": "man_frowning:t6", "🙍‍♀️": "woman_frowning", "🙍🏻‍♀️": "woman_frowning:t2", "🙍🏼‍♀️": "woman_frowning:t3", "🙍🏽‍♀️": "woman_frowning:t4", "🙍🏾‍♀️": "woman_frowning:t5", "🙍🏿‍♀️": "woman_frowning:t6", "🙎": "person_pouting", "🙎🏻": "person_pouting:t2", "🙎🏼": "person_pouting:t3", "🙎🏽": "person_pouting:t4", "🙎🏾": "person_pouting:t5", "🙎🏿": "person_pouting:t6", "🙎‍♂️": "man_pouting", "🙎🏻‍♂️": "man_pouting:t2", "🙎🏼‍♂️": "man_pouting:t3", "🙎🏽‍♂️": "man_pouting:t4", "🙎🏾‍♂️": "man_pouting:t5", "🙎🏿‍♂️": "man_pouting:t6", "🙎‍♀️": "woman_pouting", "🙎🏻‍♀️": "woman_pouting:t2", "🙎🏼‍♀️": "woman_pouting:t3", "🙎🏽‍♀️": "woman_pouting:t4", "🙎🏾‍♀️": "woman_pouting:t5", "🙎🏿‍♀️": "woman_pouting:t6", "🙅": "person_gesturing_no", "🙅🏻": "person_gesturing_no:t2", "🙅🏼": "person_gesturing_no:t3", "🙅🏽": "person_gesturing_no:t4", "🙅🏾": "person_gesturing_no:t5", "🙅🏿": "person_gesturing_no:t6", "🙅‍♂️": "man_gesturing_no", "🙅🏻‍♂️": "man_gesturing_no:t2", "🙅🏼‍♂️": "man_gesturing_no:t3", "🙅🏽‍♂️": "man_gesturing_no:t4", "🙅🏾‍♂️": "man_gesturing_no:t5", "🙅🏿‍♂️": "man_gesturing_no:t6", "🙅‍♀️": "woman_gesturing_no", "🙅🏻‍♀️": "woman_gesturing_no:t2", "🙅🏼‍♀️": "woman_gesturing_no:t3", "🙅🏽‍♀️": "woman_gesturing_no:t4", "🙅🏾‍♀️": "woman_gesturing_no:t5", "🙅🏿‍♀️": "woman_gesturing_no:t6", "🙆": "person_gesturing_ok", "🙆🏻": "person_gesturing_ok:t2", "🙆🏼": "person_gesturing_ok:t3", "🙆🏽": "person_gesturing_ok:t4", "🙆🏾": "person_gesturing_ok:t5", "🙆🏿": "person_gesturing_ok:t6", "🙆‍♂️": "man_gesturing_ok", "🙆🏻‍♂️": "man_gesturing_ok:t2", "🙆🏼‍♂️": "man_gesturing_ok:t3", "🙆🏽‍♂️": "man_gesturing_ok:t4", "🙆🏾‍♂️": "man_gesturing_ok:t5", "🙆🏿‍♂️": "man_gesturing_ok:t6", "🙆‍♀️": "woman_gesturing_ok", "🙆🏻‍♀️": "woman_gesturing_ok:t2", "🙆🏼‍♀️": "woman_gesturing_ok:t3", "🙆🏽‍♀️": "woman_gesturing_ok:t4", "🙆🏾‍♀️": "woman_gesturing_ok:t5", "🙆🏿‍♀️": "woman_gesturing_ok:t6", "💁": "person_tipping_hand", "💁🏻": "person_tipping_hand:t2", "💁🏼": "person_tipping_hand:t3", "💁🏽": "person_tipping_hand:t4", "💁🏾": "person_tipping_hand:t5", "💁🏿": "person_tipping_hand:t6", "💁‍♂️": "man_tipping_hand", "💁🏻‍♂️": "man_tipping_hand:t2", "💁🏼‍♂️": "man_tipping_hand:t3", "💁🏽‍♂️": "man_tipping_hand:t4", "💁🏾‍♂️": "man_tipping_hand:t5", "💁🏿‍♂️": "man_tipping_hand:t6", "💁‍♀️": "woman_tipping_hand", "💁🏻‍♀️": "woman_tipping_hand:t2", "💁🏼‍♀️": "woman_tipping_hand:t3", "💁🏽‍♀️": "woman_tipping_hand:t4", "💁🏾‍♀️": "woman_tipping_hand:t5", "💁🏿‍♀️": "woman_tipping_hand:t6", "🙋": "person_raising_hand", "🙋🏻": "person_raising_hand:t2", "🙋🏼": "person_raising_hand:t3", "🙋🏽": "person_raising_hand:t4", "🙋🏾": "person_raising_hand:t5", "🙋🏿": "person_raising_hand:t6", "🙋‍♂️": "man_raising_hand", "🙋🏻‍♂️": "man_raising_hand:t2", "🙋🏼‍♂️": "man_raising_hand:t3", "🙋🏽‍♂️": "man_raising_hand:t4", "🙋🏾‍♂️": "man_raising_hand:t5", "🙋🏿‍♂️": "man_raising_hand:t6", "🙋‍♀️": "woman_raising_hand", "🙋🏻‍♀️": "woman_raising_hand:t2", "🙋🏼‍♀️": "woman_raising_hand:t3", "🙋🏽‍♀️": "woman_raising_hand:t4", "🙋🏾‍♀️": "woman_raising_hand:t5", "🙋🏿‍♀️": "woman_raising_hand:t6", "🧏": "deaf_person", "🧏🏻": "deaf_person:t2", "🧏🏼": "deaf_person:t3", "🧏🏽": "deaf_person:t4", "🧏🏾": "deaf_person:t5", "🧏🏿": "deaf_person:t6", "🧏‍♂️": "deaf_man", "🧏🏻‍♂️": "deaf_man:t2", "🧏🏼‍♂️": "deaf_man:t3", "🧏🏽‍♂️": "deaf_man:t4", "🧏🏾‍♂️": "deaf_man:t5", "🧏🏿‍♂️": "deaf_man:t6", "🧏‍♀️": "deaf_woman", "🧏🏻‍♀️": "deaf_woman:t2", "🧏🏼‍♀️": "deaf_woman:t3", "🧏🏽‍♀️": "deaf_woman:t4", "🧏🏾‍♀️": "deaf_woman:t5", "🧏🏿‍♀️": "deaf_woman:t6", "🙇": "person_bowing", "🙇🏻": "person_bowing:t2", "🙇🏼": "person_bowing:t3", "🙇🏽": "person_bowing:t4", "🙇🏾": "person_bowing:t5", "🙇🏿": "person_bowing:t6", "🙇‍♂️": "man_bowing", "🙇🏻‍♂️": "man_bowing:t2", "🙇🏼‍♂️": "man_bowing:t3", "🙇🏽‍♂️": "man_bowing:t4", "🙇🏾‍♂️": "man_bowing:t5", "🙇🏿‍♂️": "man_bowing:t6", "🙇‍♀️": "woman_bowing", "🙇🏻‍♀️": "woman_bowing:t2", "🙇🏼‍♀️": "woman_bowing:t3", "🙇🏽‍♀️": "woman_bowing:t4", "🙇🏾‍♀️": "woman_bowing:t5", "🙇🏿‍♀️": "woman_bowing:t6", "🤦": "person_facepalming", "🤦🏻": "person_facepalming:t2", "🤦🏼": "person_facepalming:t3", "🤦🏽": "person_facepalming:t4", "🤦🏾": "person_facepalming:t5", "🤦🏿": "person_facepalming:t6", "🤦‍♂️": "man_facepalming", "🤦🏻‍♂️": "man_facepalming:t2", "🤦🏼‍♂️": "man_facepalming:t3", "🤦🏽‍♂️": "man_facepalming:t4", "🤦🏾‍♂️": "man_facepalming:t5", "🤦🏿‍♂️": "man_facepalming:t6", "🤦‍♀️": "woman_facepalming", "🤦🏻‍♀️": "woman_facepalming:t2", "🤦🏼‍♀️": "woman_facepalming:t3", "🤦🏽‍♀️": "woman_facepalming:t4", "🤦🏾‍♀️": "woman_facepalming:t5", "🤦🏿‍♀️": "woman_facepalming:t6", "🤷": "person_shrugging", "🤷🏻": "person_shrugging:t2", "🤷🏼": "person_shrugging:t3", "🤷🏽": "person_shrugging:t4", "🤷🏾": "person_shrugging:t5", "🤷🏿": "person_shrugging:t6", "🤷‍♂️": "man_shrugging", "🤷🏻‍♂️": "man_shrugging:t2", "🤷🏼‍♂️": "man_shrugging:t3", "🤷🏽‍♂️": "man_shrugging:t4", "🤷🏾‍♂️": "man_shrugging:t5", "🤷🏿‍♂️": "man_shrugging:t6", "🤷‍♀️": "woman_shrugging", "🤷🏻‍♀️": "woman_shrugging:t2", "🤷🏼‍♀️": "woman_shrugging:t3", "🤷🏽‍♀️": "woman_shrugging:t4", "🤷🏾‍♀️": "woman_shrugging:t5", "🤷🏿‍♀️": "woman_shrugging:t6", "🧑‍⚕️": "health_worker", "🧑🏻‍⚕️": "health_worker:t2", "🧑🏼‍⚕️": "health_worker:t3", "🧑🏽‍⚕️": "health_worker:t4", "🧑🏾‍⚕️": "health_worker:t5", "🧑🏿‍⚕️": "health_worker:t6", "👨‍⚕️": "man_health_worker", "👨🏻‍⚕️": "man_health_worker:t2", "👨🏼‍⚕️": "man_health_worker:t3", "👨🏽‍⚕️": "man_health_worker:t4", "👨🏾‍⚕️": "man_health_worker:t5", "👨🏿‍⚕️": "man_health_worker:t6", "👩‍⚕️": "woman_health_worker", "👩🏻‍⚕️": "woman_health_worker:t2", "👩🏼‍⚕️": "woman_health_worker:t3", "👩🏽‍⚕️": "woman_health_worker:t4", "👩🏾‍⚕️": "woman_health_worker:t5", "👩🏿‍⚕️": "woman_health_worker:t6", "🧑‍🎓": "student", "🧑🏻‍🎓": "student:t2", "🧑🏼‍🎓": "student:t3", "🧑🏽‍🎓": "student:t4", "🧑🏾‍🎓": "student:t5", "🧑🏿‍🎓": "student:t6", "👨‍🎓": "man_student", "👨🏻‍🎓": "man_student:t2", "👨🏼‍🎓": "man_student:t3", "👨🏽‍🎓": "man_student:t4", "👨🏾‍🎓": "man_student:t5", "👨🏿‍🎓": "man_student:t6", "👩‍🎓": "woman_student", "👩🏻‍🎓": "woman_student:t2", "👩🏼‍🎓": "woman_student:t3", "👩🏽‍🎓": "woman_student:t4", "👩🏾‍🎓": "woman_student:t5", "👩🏿‍🎓": "woman_student:t6", "🧑‍🏫": "teacher", "🧑🏻‍🏫": "teacher:t2", "🧑🏼‍🏫": "teacher:t3", "🧑🏽‍🏫": "teacher:t4", "🧑🏾‍🏫": "teacher:t5", "🧑🏿‍🏫": "teacher:t6", "👨‍🏫": "man_teacher", "👨🏻‍🏫": "man_teacher:t2", "👨🏼‍🏫": "man_teacher:t3", "👨🏽‍🏫": "man_teacher:t4", "👨🏾‍🏫": "man_teacher:t5", "👨🏿‍🏫": "man_teacher:t6", "👩‍🏫": "woman_teacher", "👩🏻‍🏫": "woman_teacher:t2", "👩🏼‍🏫": "woman_teacher:t3", "👩🏽‍🏫": "woman_teacher:t4", "👩🏾‍🏫": "woman_teacher:t5", "👩🏿‍🏫": "woman_teacher:t6", "🧑‍⚖️": "judge", "🧑🏻‍⚖️": "judge:t2", "🧑🏼‍⚖️": "judge:t3", "🧑🏽‍⚖️": "judge:t4", "🧑🏾‍⚖️": "judge:t5", "🧑🏿‍⚖️": "judge:t6", "👨‍⚖️": "man_judge", "👨🏻‍⚖️": "man_judge:t2", "👨🏼‍⚖️": "man_judge:t3", "👨🏽‍⚖️": "man_judge:t4", "👨🏾‍⚖️": "man_judge:t5", "👨🏿‍⚖️": "man_judge:t6", "👩‍⚖️": "woman_judge", "👩🏻‍⚖️": "woman_judge:t2", "👩🏼‍⚖️": "woman_judge:t3", "👩🏽‍⚖️": "woman_judge:t4", "👩🏾‍⚖️": "woman_judge:t5", "👩🏿‍⚖️": "woman_judge:t6", "🧑‍🌾": "farmer", "🧑🏻‍🌾": "farmer:t2", "🧑🏼‍🌾": "farmer:t3", "🧑🏽‍🌾": "farmer:t4", "🧑🏾‍🌾": "farmer:t5", "🧑🏿‍🌾": "farmer:t6", "👨‍🌾": "man_farmer", "👨🏻‍🌾": "man_farmer:t2", "👨🏼‍🌾": "man_farmer:t3", "👨🏽‍🌾": "man_farmer:t4", "👨🏾‍🌾": "man_farmer:t5", "👨🏿‍🌾": "man_farmer:t6", "👩‍🌾": "woman_farmer", "👩🏻‍🌾": "woman_farmer:t2", "👩🏼‍🌾": "woman_farmer:t3", "👩🏽‍🌾": "woman_farmer:t4", "👩🏾‍🌾": "woman_farmer:t5", "👩🏿‍🌾": "woman_farmer:t6", "🧑‍🍳": "cook", "🧑🏻‍🍳": "cook:t2", "🧑🏼‍🍳": "cook:t3", "🧑🏽‍🍳": "cook:t4", "🧑🏾‍🍳": "cook:t5", "🧑🏿‍🍳": "cook:t6", "👨‍🍳": "man_cook", "👨🏻‍🍳": "man_cook:t2", "👨🏼‍🍳": "man_cook:t3", "👨🏽‍🍳": "man_cook:t4", "👨🏾‍🍳": "man_cook:t5", "👨🏿‍🍳": "man_cook:t6", "👩‍🍳": "woman_cook", "👩🏻‍🍳": "woman_cook:t2", "👩🏼‍🍳": "woman_cook:t3", "👩🏽‍🍳": "woman_cook:t4", "👩🏾‍🍳": "woman_cook:t5", "👩🏿‍🍳": "woman_cook:t6", "🧑‍🔧": "mechanic", "🧑🏻‍🔧": "mechanic:t2", "🧑🏼‍🔧": "mechanic:t3", "🧑🏽‍🔧": "mechanic:t4", "🧑🏾‍🔧": "mechanic:t5", "🧑🏿‍🔧": "mechanic:t6", "👨‍🔧": "man_mechanic", "👨🏻‍🔧": "man_mechanic:t2", "👨🏼‍🔧": "man_mechanic:t3", "👨🏽‍🔧": "man_mechanic:t4", "👨🏾‍🔧": "man_mechanic:t5", "👨🏿‍🔧": "man_mechanic:t6", "👩‍🔧": "woman_mechanic", "👩🏻‍🔧": "woman_mechanic:t2", "👩🏼‍🔧": "woman_mechanic:t3", "👩🏽‍🔧": "woman_mechanic:t4", "👩🏾‍🔧": "woman_mechanic:t5", "👩🏿‍🔧": "woman_mechanic:t6", "🧑‍🏭": "factory_worker", "🧑🏻‍🏭": "factory_worker:t2", "🧑🏼‍🏭": "factory_worker:t3", "🧑🏽‍🏭": "factory_worker:t4", "🧑🏾‍🏭": "factory_worker:t5", "🧑🏿‍🏭": "factory_worker:t6", "👨‍🏭": "man_factory_worker", "👨🏻‍🏭": "man_factory_worker:t2", "👨🏼‍🏭": "man_factory_worker:t3", "👨🏽‍🏭": "man_factory_worker:t4", "👨🏾‍🏭": "man_factory_worker:t5", "👨🏿‍🏭": "man_factory_worker:t6", "👩‍🏭": "woman_factory_worker", "👩🏻‍🏭": "woman_factory_worker:t2", "👩🏼‍🏭": "woman_factory_worker:t3", "👩🏽‍🏭": "woman_factory_worker:t4", "👩🏾‍🏭": "woman_factory_worker:t5", "👩🏿‍🏭": "woman_factory_worker:t6", "🧑‍💼": "office_worker", "🧑🏻‍💼": "office_worker:t2", "🧑🏼‍💼": "office_worker:t3", "🧑🏽‍💼": "office_worker:t4", "🧑🏾‍💼": "office_worker:t5", "🧑🏿‍💼": "office_worker:t6", "👨‍💼": "man_office_worker", "👨🏻‍💼": "man_office_worker:t2", "👨🏼‍💼": "man_office_worker:t3", "👨🏽‍💼": "man_office_worker:t4", "👨🏾‍💼": "man_office_worker:t5", "👨🏿‍💼": "man_office_worker:t6", "👩‍💼": "woman_office_worker", "👩🏻‍💼": "woman_office_worker:t2", "👩🏼‍💼": "woman_office_worker:t3", "👩🏽‍💼": "woman_office_worker:t4", "👩🏾‍💼": "woman_office_worker:t5", "👩🏿‍💼": "woman_office_worker:t6", "🧑‍🔬": "scientist", "🧑🏻‍🔬": "scientist:t2", "🧑🏼‍🔬": "scientist:t3", "🧑🏽‍🔬": "scientist:t4", "🧑🏾‍🔬": "scientist:t5", "🧑🏿‍🔬": "scientist:t6", "👨‍🔬": "man_scientist", "👨🏻‍🔬": "man_scientist:t2", "👨🏼‍🔬": "man_scientist:t3", "👨🏽‍🔬": "man_scientist:t4", "👨🏾‍🔬": "man_scientist:t5", "👨🏿‍🔬": "man_scientist:t6", "👩‍🔬": "woman_scientist", "👩🏻‍🔬": "woman_scientist:t2", "👩🏼‍🔬": "woman_scientist:t3", "👩🏽‍🔬": "woman_scientist:t4", "👩🏾‍🔬": "woman_scientist:t5", "👩🏿‍🔬": "woman_scientist:t6", "🧑‍💻": "technologist", "🧑🏻‍💻": "technologist:t2", "🧑🏼‍💻": "technologist:t3", "🧑🏽‍💻": "technologist:t4", "🧑🏾‍💻": "technologist:t5", "🧑🏿‍💻": "technologist:t6", "👨‍💻": "man_technologist", "👨🏻‍💻": "man_technologist:t2", "👨🏼‍💻": "man_technologist:t3", "👨🏽‍💻": "man_technologist:t4", "👨🏾‍💻": "man_technologist:t5", "👨🏿‍💻": "man_technologist:t6", "👩‍💻": "woman_technologist", "👩🏻‍💻": "woman_technologist:t2", "👩🏼‍💻": "woman_technologist:t3", "👩🏽‍💻": "woman_technologist:t4", "👩🏾‍💻": "woman_technologist:t5", "👩🏿‍💻": "woman_technologist:t6", "🧑‍🎤": "singer", "🧑🏻‍🎤": "singer:t2", "🧑🏼‍🎤": "singer:t3", "🧑🏽‍🎤": "singer:t4", "🧑🏾‍🎤": "singer:t5", "🧑🏿‍🎤": "singer:t6", "👨‍🎤": "man_singer", "👨🏻‍🎤": "man_singer:t2", "👨🏼‍🎤": "man_singer:t3", "👨🏽‍🎤": "man_singer:t4", "👨🏾‍🎤": "man_singer:t5", "👨🏿‍🎤": "man_singer:t6", "👩‍🎤": "woman_singer", "👩🏻‍🎤": "woman_singer:t2", "👩🏼‍🎤": "woman_singer:t3", "👩🏽‍🎤": "woman_singer:t4", "👩🏾‍🎤": "woman_singer:t5", "👩🏿‍🎤": "woman_singer:t6", "🧑‍🎨": "artist", "🧑🏻‍🎨": "artist:t2", "🧑🏼‍🎨": "artist:t3", "🧑🏽‍🎨": "artist:t4", "🧑🏾‍🎨": "artist:t5", "🧑🏿‍🎨": "artist:t6", "👨‍🎨": "man_artist", "👨🏻‍🎨": "man_artist:t2", "👨🏼‍🎨": "man_artist:t3", "👨🏽‍🎨": "man_artist:t4", "👨🏾‍🎨": "man_artist:t5", "👨🏿‍🎨": "man_artist:t6", "👩‍🎨": "woman_artist", "👩🏻‍🎨": "woman_artist:t2", "👩🏼‍🎨": "woman_artist:t3", "👩🏽‍🎨": "woman_artist:t4", "👩🏾‍🎨": "woman_artist:t5", "👩🏿‍🎨": "woman_artist:t6", "🧑‍✈️": "pilot", "🧑🏻‍✈️": "pilot:t2", "🧑🏼‍✈️": "pilot:t3", "🧑🏽‍✈️": "pilot:t4", "🧑🏾‍✈️": "pilot:t5", "🧑🏿‍✈️": "pilot:t6", "👨‍✈️": "man_pilot", "👨🏻‍✈️": "man_pilot:t2", "👨🏼‍✈️": "man_pilot:t3", "👨🏽‍✈️": "man_pilot:t4", "👨🏾‍✈️": "man_pilot:t5", "👨🏿‍✈️": "man_pilot:t6", "👩‍✈️": "woman_pilot", "👩🏻‍✈️": "woman_pilot:t2", "👩🏼‍✈️": "woman_pilot:t3", "👩🏽‍✈️": "woman_pilot:t4", "👩🏾‍✈️": "woman_pilot:t5", "👩🏿‍✈️": "woman_pilot:t6", "🧑‍🚀": "astronaut", "🧑🏻‍🚀": "astronaut:t2", "🧑🏼‍🚀": "astronaut:t3", "🧑🏽‍🚀": "astronaut:t4", "🧑🏾‍🚀": "astronaut:t5", "🧑🏿‍🚀": "astronaut:t6", "👨‍🚀": "man_astronaut", "👨🏻‍🚀": "man_astronaut:t2", "👨🏼‍🚀": "man_astronaut:t3", "👨🏽‍🚀": "man_astronaut:t4", "👨🏾‍🚀": "man_astronaut:t5", "👨🏿‍🚀": "man_astronaut:t6", "👩‍🚀": "woman_astronaut", "👩🏻‍🚀": "woman_astronaut:t2", "👩🏼‍🚀": "woman_astronaut:t3", "👩🏽‍🚀": "woman_astronaut:t4", "👩🏾‍🚀": "woman_astronaut:t5", "👩🏿‍🚀": "woman_astronaut:t6", "🧑‍🚒": "firefighter", "🧑🏻‍🚒": "firefighter:t2", "🧑🏼‍🚒": "firefighter:t3", "🧑🏽‍🚒": "firefighter:t4", "🧑🏾‍🚒": "firefighter:t5", "🧑🏿‍🚒": "firefighter:t6", "👨‍🚒": "man_firefighter", "👨🏻‍🚒": "man_firefighter:t2", "👨🏼‍🚒": "man_firefighter:t3", "👨🏽‍🚒": "man_firefighter:t4", "👨🏾‍🚒": "man_firefighter:t5", "👨🏿‍🚒": "man_firefighter:t6", "👩‍🚒": "woman_firefighter", "👩🏻‍🚒": "woman_firefighter:t2", "👩🏼‍🚒": "woman_firefighter:t3", "👩🏽‍🚒": "woman_firefighter:t4", "👩🏾‍🚒": "woman_firefighter:t5", "👩🏿‍🚒": "woman_firefighter:t6", "👮": "police_officer", "👮🏻": "police_officer:t2", "👮🏼": "police_officer:t3", "👮🏽": "police_officer:t4", "👮🏾": "police_officer:t5", "👮🏿": "police_officer:t6", "👮‍♂️": "man_police_officer", "👮🏻‍♂️": "man_police_officer:t2", "👮🏼‍♂️": "man_police_officer:t3", "👮🏽‍♂️": "man_police_officer:t4", "👮🏾‍♂️": "man_police_officer:t5", "👮🏿‍♂️": "man_police_officer:t6", "👮‍♀️": "woman_police_officer", "👮🏻‍♀️": "woman_police_officer:t2", "👮🏼‍♀️": "woman_police_officer:t3", "👮🏽‍♀️": "woman_police_officer:t4", "👮🏾‍♀️": "woman_police_officer:t5", "👮🏿‍♀️": "woman_police_officer:t6", "🕵": "detective", "🕵🏻": "detective:t2", "🕵🏼": "detective:t3", "🕵🏽": "detective:t4", "🕵🏾": "detective:t5", "🕵🏿": "detective:t6", "🕵️‍♂️": "man_detective", "🕵🏻️‍♂️": "man_detective:t2", "🕵🏼️‍♂️": "man_detective:t3", "🕵🏽️‍♂️": "man_detective:t4", "🕵🏾️‍♂️": "man_detective:t5", "🕵🏿️‍♂️": "man_detective:t6", "🕵️‍♀️": "woman_detective", "🕵🏻️‍♀️": "woman_detective:t2", "🕵🏼️‍♀️": "woman_detective:t3", "🕵🏽️‍♀️": "woman_detective:t4", "🕵🏾️‍♀️": "woman_detective:t5", "🕵🏿️‍♀️": "woman_detective:t6", "💂": "guard", "💂🏻": "guard:t2", "💂🏼": "guard:t3", "💂🏽": "guard:t4", "💂🏾": "guard:t5", "💂🏿": "guard:t6", "💂‍♂️": "man_guard", "💂🏻‍♂️": "man_guard:t2", "💂🏼‍♂️": "man_guard:t3", "💂🏽‍♂️": "man_guard:t4", "💂🏾‍♂️": "man_guard:t5", "💂🏿‍♂️": "man_guard:t6", "💂‍♀️": "woman_guard", "💂🏻‍♀️": "woman_guard:t2", "💂🏼‍♀️": "woman_guard:t3", "💂🏽‍♀️": "woman_guard:t4", "💂🏾‍♀️": "woman_guard:t5", "💂🏿‍♀️": "woman_guard:t6", "🥷": "ninja", "🥷🏻": "ninja:t2", "🥷🏼": "ninja:t3", "🥷🏽": "ninja:t4", "🥷🏾": "ninja:t5", "🥷🏿": "ninja:t6", "👷": "letruction_worker", "👷🏻": "letruction_worker:t2", "👷🏼": "letruction_worker:t3", "👷🏽": "letruction_worker:t4", "👷🏾": "letruction_worker:t5", "👷🏿": "letruction_worker:t6", "👷‍♂️": "letruction_worker_man", "👷🏻‍♂️": "letruction_worker_man:t2", "👷🏼‍♂️": "letruction_worker_man:t3", "👷🏽‍♂️": "letruction_worker_man:t4", "👷🏾‍♂️": "letruction_worker_man:t5", "👷🏿‍♂️": "letruction_worker_man:t6", "👷‍♀️": "letruction_worker_woman", "👷🏻‍♀️": "letruction_worker_woman:t2", "👷🏼‍♀️": "letruction_worker_woman:t3", "👷🏽‍♀️": "letruction_worker_woman:t4", "👷🏾‍♀️": "letruction_worker_woman:t5", "👷🏿‍♀️": "letruction_worker_woman:t6", "🫅": "person_with_crown", "🫅🏻": "person_with_crown:t2", "🫅🏼": "person_with_crown:t3", "🫅🏽": "person_with_crown:t4", "🫅🏾": "person_with_crown:t5", "🫅🏿": "person_with_crown:t6", "🤴": "prince", "🤴🏻": "prince:t2", "🤴🏼": "prince:t3", "🤴🏽": "prince:t4", "🤴🏾": "prince:t5", "🤴🏿": "prince:t6", "👸": "princess", "👸🏻": "princess:t2", "👸🏼": "princess:t3", "👸🏽": "princess:t4", "👸🏾": "princess:t5", "👸🏿": "princess:t6", "👳": "person_wearing_turban", "👳🏻": "person_wearing_turban:t2", "👳🏼": "person_wearing_turban:t3", "👳🏽": "person_wearing_turban:t4", "👳🏾": "person_wearing_turban:t5", "👳🏿": "person_wearing_turban:t6", "👳‍♂️": "man_wearing_turban", "👳🏻‍♂️": "man_wearing_turban:t2", "👳🏼‍♂️": "man_wearing_turban:t3", "👳🏽‍♂️": "man_wearing_turban:t4", "👳🏾‍♂️": "man_wearing_turban:t5", "👳🏿‍♂️": "man_wearing_turban:t6", "👳‍♀️": "woman_wearing_turban", "👳🏻‍♀️": "woman_wearing_turban:t2", "👳🏼‍♀️": "woman_wearing_turban:t3", "👳🏽‍♀️": "woman_wearing_turban:t4", "👳🏾‍♀️": "woman_wearing_turban:t5", "👳🏿‍♀️": "woman_wearing_turban:t6", "👲": "person_with_skullcap", "👲🏻": "person_with_skullcap:t2", "👲🏼": "person_with_skullcap:t3", "👲🏽": "person_with_skullcap:t4", "👲🏾": "person_with_skullcap:t5", "👲🏿": "person_with_skullcap:t6", "🧕": "woman_with_headscarf", "🧕🏻": "woman_with_headscarf:t2", "🧕🏼": "woman_with_headscarf:t3", "🧕🏽": "woman_with_headscarf:t4", "🧕🏾": "woman_with_headscarf:t5", "🧕🏿": "woman_with_headscarf:t6", "🤵": "person_in_tuxedo", "🤵🏻": "person_in_tuxedo:t2", "🤵🏼": "person_in_tuxedo:t3", "🤵🏽": "person_in_tuxedo:t4", "🤵🏾": "person_in_tuxedo:t5", "🤵🏿": "person_in_tuxedo:t6", "🤵‍♂️": "man_in_tuxedo", "🤵🏻‍♂️": "man_in_tuxedo:t2", "🤵🏼‍♂️": "man_in_tuxedo:t3", "🤵🏽‍♂️": "man_in_tuxedo:t4", "🤵🏾‍♂️": "man_in_tuxedo:t5", "🤵🏿‍♂️": "man_in_tuxedo:t6", "🤵‍♀️": "woman_in_tuxedo", "🤵🏻‍♀️": "woman_in_tuxedo:t2", "🤵🏼‍♀️": "woman_in_tuxedo:t3", "🤵🏽‍♀️": "woman_in_tuxedo:t4", "🤵🏾‍♀️": "woman_in_tuxedo:t5", "🤵🏿‍♀️": "woman_in_tuxedo:t6", "👰": "person_with_veil", "👰🏻": "person_with_veil:t2", "👰🏼": "person_with_veil:t3", "👰🏽": "person_with_veil:t4", "👰🏾": "person_with_veil:t5", "👰🏿": "person_with_veil:t6", "👰‍♂️": "man_with_veil", "👰🏻‍♂️": "man_with_veil:t2", "👰🏼‍♂️": "man_with_veil:t3", "👰🏽‍♂️": "man_with_veil:t4", "👰🏾‍♂️": "man_with_veil:t5", "👰🏿‍♂️": "man_with_veil:t6", "👰‍♀️": "woman_with_veil", "👰🏻‍♀️": "woman_with_veil:t2", "👰🏼‍♀️": "woman_with_veil:t3", "👰🏽‍♀️": "woman_with_veil:t4", "👰🏾‍♀️": "woman_with_veil:t5", "👰🏿‍♀️": "woman_with_veil:t6", "🤰": "pregnant_woman", "🤰🏻": "pregnant_woman:t2", "🤰🏼": "pregnant_woman:t3", "🤰🏽": "pregnant_woman:t4", "🤰🏾": "pregnant_woman:t5", "🤰🏿": "pregnant_woman:t6", "🫃": "pregnant_man", "🫃🏻": "pregnant_man:t2", "🫃🏼": "pregnant_man:t3", "🫃🏽": "pregnant_man:t4", "🫃🏾": "pregnant_man:t5", "🫃🏿": "pregnant_man:t6", "🫄": "pregnant_person", "🫄🏻": "pregnant_person:t2", "🫄🏼": "pregnant_person:t3", "🫄🏽": "pregnant_person:t4", "🫄🏾": "pregnant_person:t5", "🫄🏿": "pregnant_person:t6", "🤱": "breast_feeding", "🤱🏻": "breast_feeding:t2", "🤱🏼": "breast_feeding:t3", "🤱🏽": "breast_feeding:t4", "🤱🏾": "breast_feeding:t5", "🤱🏿": "breast_feeding:t6", "👩‍🍼": "woman_feeding_baby", "👩🏻‍🍼": "woman_feeding_baby:t2", "👩🏼‍🍼": "woman_feeding_baby:t3", "👩🏽‍🍼": "woman_feeding_baby:t4", "👩🏾‍🍼": "woman_feeding_baby:t5", "👩🏿‍🍼": "woman_feeding_baby:t6", "👨‍🍼": "man_feeding_baby", "👨🏻‍🍼": "man_feeding_baby:t2", "👨🏼‍🍼": "man_feeding_baby:t3", "👨🏽‍🍼": "man_feeding_baby:t4", "👨🏾‍🍼": "man_feeding_baby:t5", "👨🏿‍🍼": "man_feeding_baby:t6", "🧑‍🍼": "person_feeding_baby", "🧑🏻‍🍼": "person_feeding_baby:t2", "🧑🏼‍🍼": "person_feeding_baby:t3", "🧑🏽‍🍼": "person_feeding_baby:t4", "🧑🏾‍🍼": "person_feeding_baby:t5", "🧑🏿‍🍼": "person_feeding_baby:t6", "👼": "baby_angel", "👼🏻": "baby_angel:t2", "👼🏼": "baby_angel:t3", "👼🏽": "baby_angel:t4", "👼🏾": "baby_angel:t5", "👼🏿": "baby_angel:t6", "🎅": "santa_claus", "🎅🏻": "santa_claus:t2", "🎅🏼": "santa_claus:t3", "🎅🏽": "santa_claus:t4", "🎅🏾": "santa_claus:t5", "🎅🏿": "santa_claus:t6", "🤶": "mrs_claus", "🤶🏻": "mrs_claus:t2", "🤶🏼": "mrs_claus:t3", "🤶🏽": "mrs_claus:t4", "🤶🏾": "mrs_claus:t5", "🤶🏿": "mrs_claus:t6", "🧑‍🎄": "mx_claus", "🧑🏻‍🎄": "mx_claus:t2", "🧑🏼‍🎄": "mx_claus:t3", "🧑🏽‍🎄": "mx_claus:t4", "🧑🏾‍🎄": "mx_claus:t5", "🧑🏿‍🎄": "mx_claus:t6", "🦸": "superhero", "🦸🏻": "superhero:t2", "🦸🏼": "superhero:t3", "🦸🏽": "superhero:t4", "🦸🏾": "superhero:t5", "🦸🏿": "superhero:t6", "🦸‍♂️": "man_superhero", "🦸🏻‍♂️": "man_superhero:t2", "🦸🏼‍♂️": "man_superhero:t3", "🦸🏽‍♂️": "man_superhero:t4", "🦸🏾‍♂️": "man_superhero:t5", "🦸🏿‍♂️": "man_superhero:t6", "🦸‍♀️": "woman_superhero", "🦸🏻‍♀️": "woman_superhero:t2", "🦸🏼‍♀️": "woman_superhero:t3", "🦸🏽‍♀️": "woman_superhero:t4", "🦸🏾‍♀️": "woman_superhero:t5", "🦸🏿‍♀️": "woman_superhero:t6", "🦹": "supervillain", "🦹🏻": "supervillain:t2", "🦹🏼": "supervillain:t3", "🦹🏽": "supervillain:t4", "🦹🏾": "supervillain:t5", "🦹🏿": "supervillain:t6", "🦹‍♂️": "man_supervillain", "🦹🏻‍♂️": "man_supervillain:t2", "🦹🏼‍♂️": "man_supervillain:t3", "🦹🏽‍♂️": "man_supervillain:t4", "🦹🏾‍♂️": "man_supervillain:t5", "🦹🏿‍♂️": "man_supervillain:t6", "🦹‍♀️": "woman_supervillain", "🦹🏻‍♀️": "woman_supervillain:t2", "🦹🏼‍♀️": "woman_supervillain:t3", "🦹🏽‍♀️": "woman_supervillain:t4", "🦹🏾‍♀️": "woman_supervillain:t5", "🦹🏿‍♀️": "woman_supervillain:t6", "🧙": "mage", "🧙🏻": "mage:t2", "🧙🏼": "mage:t3", "🧙🏽": "mage:t4", "🧙🏾": "mage:t5", "🧙🏿": "mage:t6", "🧙‍♂️": "man_mage", "🧙🏻‍♂️": "man_mage:t2", "🧙🏼‍♂️": "man_mage:t3", "🧙🏽‍♂️": "man_mage:t4", "🧙🏾‍♂️": "man_mage:t5", "🧙🏿‍♂️": "man_mage:t6", "🧙‍♀️": "woman_mage", "🧙🏻‍♀️": "woman_mage:t2", "🧙🏼‍♀️": "woman_mage:t3", "🧙🏽‍♀️": "woman_mage:t4", "🧙🏾‍♀️": "woman_mage:t5", "🧙🏿‍♀️": "woman_mage:t6", "🧚": "fairy", "🧚🏻": "fairy:t2", "🧚🏼": "fairy:t3", "🧚🏽": "fairy:t4", "🧚🏾": "fairy:t5", "🧚🏿": "fairy:t6", "🧚‍♂️": "man_fairy", "🧚🏻‍♂️": "man_fairy:t2", "🧚🏼‍♂️": "man_fairy:t3", "🧚🏽‍♂️": "man_fairy:t4", "🧚🏾‍♂️": "man_fairy:t5", "🧚🏿‍♂️": "man_fairy:t6", "🧚‍♀️": "woman_fairy", "🧚🏻‍♀️": "woman_fairy:t2", "🧚🏼‍♀️": "woman_fairy:t3", "🧚🏽‍♀️": "woman_fairy:t4", "🧚🏾‍♀️": "woman_fairy:t5", "🧚🏿‍♀️": "woman_fairy:t6", "🧛": "vampire", "🧛🏻": "vampire:t2", "🧛🏼": "vampire:t3", "🧛🏽": "vampire:t4", "🧛🏾": "vampire:t5", "🧛🏿": "vampire:t6", "🧛‍♂️": "man_vampire", "🧛🏻‍♂️": "man_vampire:t2", "🧛🏼‍♂️": "man_vampire:t3", "🧛🏽‍♂️": "man_vampire:t4", "🧛🏾‍♂️": "man_vampire:t5", "🧛🏿‍♂️": "man_vampire:t6", "🧛‍♀️": "woman_vampire", "🧛🏻‍♀️": "woman_vampire:t2", "🧛🏼‍♀️": "woman_vampire:t3", "🧛🏽‍♀️": "woman_vampire:t4", "🧛🏾‍♀️": "woman_vampire:t5", "🧛🏿‍♀️": "woman_vampire:t6", "🧜": "merperson", "🧜🏻": "merperson:t2", "🧜🏼": "merperson:t3", "🧜🏽": "merperson:t4", "🧜🏾": "merperson:t5", "🧜🏿": "merperson:t6", "🧜‍♂️": "merman", "🧜🏻‍♂️": "merman:t2", "🧜🏼‍♂️": "merman:t3", "🧜🏽‍♂️": "merman:t4", "🧜🏾‍♂️": "merman:t5", "🧜🏿‍♂️": "merman:t6", "🧜‍♀️": "mermaid", "🧜🏻‍♀️": "mermaid:t2", "🧜🏼‍♀️": "mermaid:t3", "🧜🏽‍♀️": "mermaid:t4", "🧜🏾‍♀️": "mermaid:t5", "🧜🏿‍♀️": "mermaid:t6", "🧝": "elf", "🧝🏻": "elf:t2", "🧝🏼": "elf:t3", "🧝🏽": "elf:t4", "🧝🏾": "elf:t5", "🧝🏿": "elf:t6", "🧝‍♂️": "man_elf", "🧝🏻‍♂️": "man_elf:t2", "🧝🏼‍♂️": "man_elf:t3", "🧝🏽‍♂️": "man_elf:t4", "🧝🏾‍♂️": "man_elf:t5", "🧝🏿‍♂️": "man_elf:t6", "🧝‍♀️": "woman_elf", "🧝🏻‍♀️": "woman_elf:t2", "🧝🏼‍♀️": "woman_elf:t3", "🧝🏽‍♀️": "woman_elf:t4", "🧝🏾‍♀️": "woman_elf:t5", "🧝🏿‍♀️": "woman_elf:t6", "🧞": "genie", "🧞‍♂️": "man_genie", "🧞‍♀️": "woman_genie", "🧟": "zombie", "🧟‍♂️": "man_zombie", "🧟‍♀️": "woman_zombie", "🧌": "troll", "💆": "person_getting_massage", "💆🏻": "person_getting_massage:t2", "💆🏼": "person_getting_massage:t3", "💆🏽": "person_getting_massage:t4", "💆🏾": "person_getting_massage:t5", "💆🏿": "person_getting_massage:t6", "💆‍♂️": "man_getting_massage", "💆🏻‍♂️": "man_getting_massage:t2", "💆🏼‍♂️": "man_getting_massage:t3", "💆🏽‍♂️": "man_getting_massage:t4", "💆🏾‍♂️": "man_getting_massage:t5", "💆🏿‍♂️": "man_getting_massage:t6", "💆‍♀️": "woman_getting_massage", "💆🏻‍♀️": "woman_getting_massage:t2", "💆🏼‍♀️": "woman_getting_massage:t3", "💆🏽‍♀️": "woman_getting_massage:t4", "💆🏾‍♀️": "woman_getting_massage:t5", "💆🏿‍♀️": "woman_getting_massage:t6", "💇": "person_getting_haircut", "💇🏻": "person_getting_haircut:t2", "💇🏼": "person_getting_haircut:t3", "💇🏽": "person_getting_haircut:t4", "💇🏾": "person_getting_haircut:t5", "💇🏿": "person_getting_haircut:t6", "💇‍♂️": "man_getting_haircut", "💇🏻‍♂️": "man_getting_haircut:t2", "💇🏼‍♂️": "man_getting_haircut:t3", "💇🏽‍♂️": "man_getting_haircut:t4", "💇🏾‍♂️": "man_getting_haircut:t5", "💇🏿‍♂️": "man_getting_haircut:t6", "💇‍♀️": "woman_getting_haircut", "💇🏻‍♀️": "woman_getting_haircut:t2", "💇🏼‍♀️": "woman_getting_haircut:t3", "💇🏽‍♀️": "woman_getting_haircut:t4", "💇🏾‍♀️": "woman_getting_haircut:t5", "💇🏿‍♀️": "woman_getting_haircut:t6", "🚶": "person_walking", "🚶🏻": "person_walking:t2", "🚶🏼": "person_walking:t3", "🚶🏽": "person_walking:t4", "🚶🏾": "person_walking:t5", "🚶🏿": "person_walking:t6", "🚶‍♂️": "man_walking", "🚶🏻‍♂️": "man_walking:t2", "🚶🏼‍♂️": "man_walking:t3", "🚶🏽‍♂️": "man_walking:t4", "🚶🏾‍♂️": "man_walking:t5", "🚶🏿‍♂️": "man_walking:t6", "🚶‍♀️": "woman_walking", "🚶🏻‍♀️": "woman_walking:t2", "🚶🏼‍♀️": "woman_walking:t3", "🚶🏽‍♀️": "woman_walking:t4", "🚶🏾‍♀️": "woman_walking:t5", "🚶🏿‍♀️": "woman_walking:t6", "🧍": "person_standing", "🧍🏻": "person_standing:t2", "🧍🏼": "person_standing:t3", "🧍🏽": "person_standing:t4", "🧍🏾": "person_standing:t5", "🧍🏿": "person_standing:t6", "🧍‍♂️": "man_standing", "🧍🏻‍♂️": "man_standing:t2", "🧍🏼‍♂️": "man_standing:t3", "🧍🏽‍♂️": "man_standing:t4", "🧍🏾‍♂️": "man_standing:t5", "🧍🏿‍♂️": "man_standing:t6", "🧍‍♀️": "woman_standing", "🧍🏻‍♀️": "woman_standing:t2", "🧍🏼‍♀️": "woman_standing:t3", "🧍🏽‍♀️": "woman_standing:t4", "🧍🏾‍♀️": "woman_standing:t5", "🧍🏿‍♀️": "woman_standing:t6", "🧎": "person_kneeling", "🧎🏻": "person_kneeling:t2", "🧎🏼": "person_kneeling:t3", "🧎🏽": "person_kneeling:t4", "🧎🏾": "person_kneeling:t5", "🧎🏿": "person_kneeling:t6", "🧎‍♂️": "man_kneeling", "🧎🏻‍♂️": "man_kneeling:t2", "🧎🏼‍♂️": "man_kneeling:t3", "🧎🏽‍♂️": "man_kneeling:t4", "🧎🏾‍♂️": "man_kneeling:t5", "🧎🏿‍♂️": "man_kneeling:t6", "🧎‍♀️": "woman_kneeling", "🧎🏻‍♀️": "woman_kneeling:t2", "🧎🏼‍♀️": "woman_kneeling:t3", "🧎🏽‍♀️": "woman_kneeling:t4", "🧎🏾‍♀️": "woman_kneeling:t5", "🧎🏿‍♀️": "woman_kneeling:t6", "🧑‍🦯": "person_with_white_cane", "🧑🏻‍🦯": "person_with_white_cane:t2", "🧑🏼‍🦯": "person_with_white_cane:t3", "🧑🏽‍🦯": "person_with_white_cane:t4", "🧑🏾‍🦯": "person_with_white_cane:t5", "🧑🏿‍🦯": "person_with_white_cane:t6", "👨‍🦯": "man_with_white_cane", "👨🏻‍🦯": "man_with_white_cane:t2", "👨🏼‍🦯": "man_with_white_cane:t3", "👨🏽‍🦯": "man_with_white_cane:t4", "👨🏾‍🦯": "man_with_white_cane:t5", "👨🏿‍🦯": "man_with_white_cane:t6", "👩‍🦯": "woman_with_white_cane", "👩🏻‍🦯": "woman_with_white_cane:t2", "👩🏼‍🦯": "woman_with_white_cane:t3", "👩🏽‍🦯": "woman_with_white_cane:t4", "👩🏾‍🦯": "woman_with_white_cane:t5", "👩🏿‍🦯": "woman_with_white_cane:t6", "🧑‍🦼": "person_in_motorized_wheelchair", "🧑🏻‍🦼": "person_in_motorized_wheelchair:t2", "🧑🏼‍🦼": "person_in_motorized_wheelchair:t3", "🧑🏽‍🦼": "person_in_motorized_wheelchair:t4", "🧑🏾‍🦼": "person_in_motorized_wheelchair:t5", "🧑🏿‍🦼": "person_in_motorized_wheelchair:t6", "👨‍🦼": "man_in_motorized_wheelchair", "👨🏻‍🦼": "man_in_motorized_wheelchair:t2", "👨🏼‍🦼": "man_in_motorized_wheelchair:t3", "👨🏽‍🦼": "man_in_motorized_wheelchair:t4", "👨🏾‍🦼": "man_in_motorized_wheelchair:t5", "👨🏿‍🦼": "man_in_motorized_wheelchair:t6", "👩‍🦼": "woman_in_motorized_wheelchair", "👩🏻‍🦼": "woman_in_motorized_wheelchair:t2", "👩🏼‍🦼": "woman_in_motorized_wheelchair:t3", "👩🏽‍🦼": "woman_in_motorized_wheelchair:t4", "👩🏾‍🦼": "woman_in_motorized_wheelchair:t5", "👩🏿‍🦼": "woman_in_motorized_wheelchair:t6", "🧑‍🦽": "person_in_manual_wheelchair", "🧑🏻‍🦽": "person_in_manual_wheelchair:t2", "🧑🏼‍🦽": "person_in_manual_wheelchair:t3", "🧑🏽‍🦽": "person_in_manual_wheelchair:t4", "🧑🏾‍🦽": "person_in_manual_wheelchair:t5", "🧑🏿‍🦽": "person_in_manual_wheelchair:t6", "👨‍🦽": "man_in_manual_wheelchair", "👨🏻‍🦽": "man_in_manual_wheelchair:t2", "👨🏼‍🦽": "man_in_manual_wheelchair:t3", "👨🏽‍🦽": "man_in_manual_wheelchair:t4", "👨🏾‍🦽": "man_in_manual_wheelchair:t5", "👨🏿‍🦽": "man_in_manual_wheelchair:t6", "👩‍🦽": "woman_in_manual_wheelchair", "👩🏻‍🦽": "woman_in_manual_wheelchair:t2", "👩🏼‍🦽": "woman_in_manual_wheelchair:t3", "👩🏽‍🦽": "woman_in_manual_wheelchair:t4", "👩🏾‍🦽": "woman_in_manual_wheelchair:t5", "👩🏿‍🦽": "woman_in_manual_wheelchair:t6", "🏃": "person_running", "🏃🏻": "person_running:t2", "🏃🏼": "person_running:t3", "🏃🏽": "person_running:t4", "🏃🏾": "person_running:t5", "🏃🏿": "person_running:t6", "🏃‍♂️": "man_running", "🏃🏻‍♂️": "man_running:t2", "🏃🏼‍♂️": "man_running:t3", "🏃🏽‍♂️": "man_running:t4", "🏃🏾‍♂️": "man_running:t5", "🏃🏿‍♂️": "man_running:t6", "🏃‍♀️": "woman_running", "🏃🏻‍♀️": "woman_running:t2", "🏃🏼‍♀️": "woman_running:t3", "🏃🏽‍♀️": "woman_running:t4", "🏃🏾‍♀️": "woman_running:t5", "🏃🏿‍♀️": "woman_running:t6", "💃": "woman_dancing", "💃🏻": "woman_dancing:t2", "💃🏼": "woman_dancing:t3", "💃🏽": "woman_dancing:t4", "💃🏾": "woman_dancing:t5", "💃🏿": "woman_dancing:t6", "🕺": "man_dancing", "🕺🏻": "man_dancing:t2", "🕺🏼": "man_dancing:t3", "🕺🏽": "man_dancing:t4", "🕺🏾": "man_dancing:t5", "🕺🏿": "man_dancing:t6", "🕴": "person_in_suit_levitating", "🕴🏻": "person_in_suit_levitating:t2", "🕴🏼": "person_in_suit_levitating:t3", "🕴🏽": "person_in_suit_levitating:t4", "🕴🏾": "person_in_suit_levitating:t5", "🕴🏿": "person_in_suit_levitating:t6", "👯": "people_with_bunny_ears", "👯‍♂️": "men_with_bunny_ears", "👯‍♀️": "women_with_bunny_ears", "🧖": "person_in_steamy_room", "🧖🏻": "person_in_steamy_room:t2", "🧖🏼": "person_in_steamy_room:t3", "🧖🏽": "person_in_steamy_room:t4", "🧖🏾": "person_in_steamy_room:t5", "🧖🏿": "person_in_steamy_room:t6", "🧖‍♂️": "man_in_steamy_room", "🧖🏻‍♂️": "man_in_steamy_room:t2", "🧖🏼‍♂️": "man_in_steamy_room:t3", "🧖🏽‍♂️": "man_in_steamy_room:t4", "🧖🏾‍♂️": "man_in_steamy_room:t5", "🧖🏿‍♂️": "man_in_steamy_room:t6", "🧖‍♀️": "woman_in_steamy_room", "🧖🏻‍♀️": "woman_in_steamy_room:t2", "🧖🏼‍♀️": "woman_in_steamy_room:t3", "🧖🏽‍♀️": "woman_in_steamy_room:t4", "🧖🏾‍♀️": "woman_in_steamy_room:t5", "🧖🏿‍♀️": "woman_in_steamy_room:t6", "🧗": "person_climbing", "🧗🏻": "person_climbing:t2", "🧗🏼": "person_climbing:t3", "🧗🏽": "person_climbing:t4", "🧗🏾": "person_climbing:t5", "🧗🏿": "person_climbing:t6", "🧗‍♂️": "man_climbing", "🧗🏻‍♂️": "man_climbing:t2", "🧗🏼‍♂️": "man_climbing:t3", "🧗🏽‍♂️": "man_climbing:t4", "🧗🏾‍♂️": "man_climbing:t5", "🧗🏿‍♂️": "man_climbing:t6", "🧗‍♀️": "woman_climbing", "🧗🏻‍♀️": "woman_climbing:t2", "🧗🏼‍♀️": "woman_climbing:t3", "🧗🏽‍♀️": "woman_climbing:t4", "🧗🏾‍♀️": "woman_climbing:t5", "🧗🏿‍♀️": "woman_climbing:t6", "🤺": "person_fencing", "🏇": "horse_racing", "🏇🏻": "horse_racing:t2", "🏇🏼": "horse_racing:t3", "🏇🏽": "horse_racing:t4", "🏇🏾": "horse_racing:t5", "🏇🏿": "horse_racing:t6", "⛷": "skier", "🏂": "snowboarder", "🏂🏻": "snowboarder:t2", "🏂🏼": "snowboarder:t3", "🏂🏽": "snowboarder:t4", "🏂🏾": "snowboarder:t5", "🏂🏿": "snowboarder:t6", "🏌": "person_golfing", "🏌🏻": "person_golfing:t2", "🏌🏼": "person_golfing:t3", "🏌🏽": "person_golfing:t4", "🏌🏾": "person_golfing:t5", "🏌🏿": "person_golfing:t6", "🏌️‍♂️": "man_golfing", "🏌🏻️‍♂️": "man_golfing:t2", "🏌🏼️‍♂️": "man_golfing:t3", "🏌🏽️‍♂️": "man_golfing:t4", "🏌🏾️‍♂️": "man_golfing:t5", "🏌🏿️‍♂️": "man_golfing:t6", "🏌️‍♀️": "woman_golfing", "🏌🏻️‍♀️": "woman_golfing:t2", "🏌🏼️‍♀️": "woman_golfing:t3", "🏌🏽️‍♀️": "woman_golfing:t4", "🏌🏾️‍♀️": "woman_golfing:t5", "🏌🏿️‍♀️": "woman_golfing:t6", "🏄": "person_surfing", "🏄🏻": "person_surfing:t2", "🏄🏼": "person_surfing:t3", "🏄🏽": "person_surfing:t4", "🏄🏾": "person_surfing:t5", "🏄🏿": "person_surfing:t6", "🏄‍♂️": "man_surfing", "🏄🏻‍♂️": "man_surfing:t2", "🏄🏼‍♂️": "man_surfing:t3", "🏄🏽‍♂️": "man_surfing:t4", "🏄🏾‍♂️": "man_surfing:t5", "🏄🏿‍♂️": "man_surfing:t6", "🏄‍♀️": "woman_surfing", "🏄🏻‍♀️": "woman_surfing:t2", "🏄🏼‍♀️": "woman_surfing:t3", "🏄🏽‍♀️": "woman_surfing:t4", "🏄🏾‍♀️": "woman_surfing:t5", "🏄🏿‍♀️": "woman_surfing:t6", "🚣": "person_rowing_boat", "🚣🏻": "person_rowing_boat:t2", "🚣🏼": "person_rowing_boat:t3", "🚣🏽": "person_rowing_boat:t4", "🚣🏾": "person_rowing_boat:t5", "🚣🏿": "person_rowing_boat:t6", "🚣‍♂️": "man_rowing_boat", "🚣🏻‍♂️": "man_rowing_boat:t2", "🚣🏼‍♂️": "man_rowing_boat:t3", "🚣🏽‍♂️": "man_rowing_boat:t4", "🚣🏾‍♂️": "man_rowing_boat:t5", "🚣🏿‍♂️": "man_rowing_boat:t6", "🚣‍♀️": "woman_rowing_boat", "🚣🏻‍♀️": "woman_rowing_boat:t2", "🚣🏼‍♀️": "woman_rowing_boat:t3", "🚣🏽‍♀️": "woman_rowing_boat:t4", "🚣🏾‍♀️": "woman_rowing_boat:t5", "🚣🏿‍♀️": "woman_rowing_boat:t6", "🏊": "person_swimming", "🏊🏻": "person_swimming:t2", "🏊🏼": "person_swimming:t3", "🏊🏽": "person_swimming:t4", "🏊🏾": "person_swimming:t5", "🏊🏿": "person_swimming:t6", "🏊‍♂️": "man_swimming", "🏊🏻‍♂️": "man_swimming:t2", "🏊🏼‍♂️": "man_swimming:t3", "🏊🏽‍♂️": "man_swimming:t4", "🏊🏾‍♂️": "man_swimming:t5", "🏊🏿‍♂️": "man_swimming:t6", "🏊‍♀️": "woman_swimming", "🏊🏻‍♀️": "woman_swimming:t2", "🏊🏼‍♀️": "woman_swimming:t3", "🏊🏽‍♀️": "woman_swimming:t4", "🏊🏾‍♀️": "woman_swimming:t5", "🏊🏿‍♀️": "woman_swimming:t6", "⛹": "person_bouncing_ball", "⛹🏻": "person_bouncing_ball:t2", "⛹🏼": "person_bouncing_ball:t3", "⛹🏽": "person_bouncing_ball:t4", "⛹🏾": "person_bouncing_ball:t5", "⛹🏿": "person_bouncing_ball:t6", "⛹️‍♂️": "man_bouncing_ball", "⛹🏻️‍♂️": "man_bouncing_ball:t2", "⛹🏼️‍♂️": "man_bouncing_ball:t3", "⛹🏽️‍♂️": "man_bouncing_ball:t4", "⛹🏾️‍♂️": "man_bouncing_ball:t5", "⛹🏿️‍♂️": "man_bouncing_ball:t6", "⛹️‍♀️": "woman_bouncing_ball", "⛹🏻️‍♀️": "woman_bouncing_ball:t2", "⛹🏼️‍♀️": "woman_bouncing_ball:t3", "⛹🏽️‍♀️": "woman_bouncing_ball:t4", "⛹🏾️‍♀️": "woman_bouncing_ball:t5", "⛹🏿️‍♀️": "woman_bouncing_ball:t6", "🏋": "person_lifting_weights", "🏋🏻": "person_lifting_weights:t2", "🏋🏼": "person_lifting_weights:t3", "🏋🏽": "person_lifting_weights:t4", "🏋🏾": "person_lifting_weights:t5", "🏋🏿": "person_lifting_weights:t6", "🏋️‍♂️": "man_lifting_weights", "🏋🏻️‍♂️": "man_lifting_weights:t2", "🏋🏼️‍♂️": "man_lifting_weights:t3", "🏋🏽️‍♂️": "man_lifting_weights:t4", "🏋🏾️‍♂️": "man_lifting_weights:t5", "🏋🏿️‍♂️": "man_lifting_weights:t6", "🏋️‍♀️": "woman_lifting_weights", "🏋🏻️‍♀️": "woman_lifting_weights:t2", "🏋🏼️‍♀️": "woman_lifting_weights:t3", "🏋🏽️‍♀️": "woman_lifting_weights:t4", "🏋🏾️‍♀️": "woman_lifting_weights:t5", "🏋🏿️‍♀️": "woman_lifting_weights:t6", "🚴": "person_biking", "🚴🏻": "person_biking:t2", "🚴🏼": "person_biking:t3", "🚴🏽": "person_biking:t4", "🚴🏾": "person_biking:t5", "🚴🏿": "person_biking:t6", "🚴‍♂️": "man_biking", "🚴🏻‍♂️": "man_biking:t2", "🚴🏼‍♂️": "man_biking:t3", "🚴🏽‍♂️": "man_biking:t4", "🚴🏾‍♂️": "man_biking:t5", "🚴🏿‍♂️": "man_biking:t6", "🚴‍♀️": "woman_biking", "🚴🏻‍♀️": "woman_biking:t2", "🚴🏼‍♀️": "woman_biking:t3", "🚴🏽‍♀️": "woman_biking:t4", "🚴🏾‍♀️": "woman_biking:t5", "🚴🏿‍♀️": "woman_biking:t6", "🚵": "person_mountain_biking", "🚵🏻": "person_mountain_biking:t2", "🚵🏼": "person_mountain_biking:t3", "🚵🏽": "person_mountain_biking:t4", "🚵🏾": "person_mountain_biking:t5", "🚵🏿": "person_mountain_biking:t6", "🚵‍♂️": "man_mountain_biking", "🚵🏻‍♂️": "man_mountain_biking:t2", "🚵🏼‍♂️": "man_mountain_biking:t3", "🚵🏽‍♂️": "man_mountain_biking:t4", "🚵🏾‍♂️": "man_mountain_biking:t5", "🚵🏿‍♂️": "man_mountain_biking:t6", "🚵‍♀️": "woman_mountain_biking", "🚵🏻‍♀️": "woman_mountain_biking:t2", "🚵🏼‍♀️": "woman_mountain_biking:t3", "🚵🏽‍♀️": "woman_mountain_biking:t4", "🚵🏾‍♀️": "woman_mountain_biking:t5", "🚵🏿‍♀️": "woman_mountain_biking:t6", "🤸": "person_cartwheeling", "🤸🏻": "person_cartwheeling:t2", "🤸🏼": "person_cartwheeling:t3", "🤸🏽": "person_cartwheeling:t4", "🤸🏾": "person_cartwheeling:t5", "🤸🏿": "person_cartwheeling:t6", "🤸‍♂️": "man_cartwheeling", "🤸🏻‍♂️": "man_cartwheeling:t2", "🤸🏼‍♂️": "man_cartwheeling:t3", "🤸🏽‍♂️": "man_cartwheeling:t4", "🤸🏾‍♂️": "man_cartwheeling:t5", "🤸🏿‍♂️": "man_cartwheeling:t6", "🤸‍♀️": "woman_cartwheeling", "🤸🏻‍♀️": "woman_cartwheeling:t2", "🤸🏼‍♀️": "woman_cartwheeling:t3", "🤸🏽‍♀️": "woman_cartwheeling:t4", "🤸🏾‍♀️": "woman_cartwheeling:t5", "🤸🏿‍♀️": "woman_cartwheeling:t6", "🤼": "people_wrestling", "🤼‍♂️": "men_wrestling", "🤼‍♀️": "women_wrestling", "🤽": "person_playing_water_polo", "🤽🏻": "person_playing_water_polo:t2", "🤽🏼": "person_playing_water_polo:t3", "🤽🏽": "person_playing_water_polo:t4", "🤽🏾": "person_playing_water_polo:t5", "🤽🏿": "person_playing_water_polo:t6", "🤽‍♂️": "man_playing_water_polo", "🤽🏻‍♂️": "man_playing_water_polo:t2", "🤽🏼‍♂️": "man_playing_water_polo:t3", "🤽🏽‍♂️": "man_playing_water_polo:t4", "🤽🏾‍♂️": "man_playing_water_polo:t5", "🤽🏿‍♂️": "man_playing_water_polo:t6", "🤽‍♀️": "woman_playing_water_polo", "🤽🏻‍♀️": "woman_playing_water_polo:t2", "🤽🏼‍♀️": "woman_playing_water_polo:t3", "🤽🏽‍♀️": "woman_playing_water_polo:t4", "🤽🏾‍♀️": "woman_playing_water_polo:t5", "🤽🏿‍♀️": "woman_playing_water_polo:t6", "🤾": "person_playing_handball", "🤾🏻": "person_playing_handball:t2", "🤾🏼": "person_playing_handball:t3", "🤾🏽": "person_playing_handball:t4", "🤾🏾": "person_playing_handball:t5", "🤾🏿": "person_playing_handball:t6", "🤾‍♂️": "man_playing_handball", "🤾🏻‍♂️": "man_playing_handball:t2", "🤾🏼‍♂️": "man_playing_handball:t3", "🤾🏽‍♂️": "man_playing_handball:t4", "🤾🏾‍♂️": "man_playing_handball:t5", "🤾🏿‍♂️": "man_playing_handball:t6", "🤾‍♀️": "woman_playing_handball", "🤾🏻‍♀️": "woman_playing_handball:t2", "🤾🏼‍♀️": "woman_playing_handball:t3", "🤾🏽‍♀️": "woman_playing_handball:t4", "🤾🏾‍♀️": "woman_playing_handball:t5", "🤾🏿‍♀️": "woman_playing_handball:t6", "🤹": "person_juggling", "🤹🏻": "person_juggling:t2", "🤹🏼": "person_juggling:t3", "🤹🏽": "person_juggling:t4", "🤹🏾": "person_juggling:t5", "🤹🏿": "person_juggling:t6", "🤹‍♂️": "man_juggling", "🤹🏻‍♂️": "man_juggling:t2", "🤹🏼‍♂️": "man_juggling:t3", "🤹🏽‍♂️": "man_juggling:t4", "🤹🏾‍♂️": "man_juggling:t5", "🤹🏿‍♂️": "man_juggling:t6", "🤹‍♀️": "woman_juggling", "🤹🏻‍♀️": "woman_juggling:t2", "🤹🏼‍♀️": "woman_juggling:t3", "🤹🏽‍♀️": "woman_juggling:t4", "🤹🏾‍♀️": "woman_juggling:t5", "🤹🏿‍♀️": "woman_juggling:t6", "🧘": "person_in_lotus_position", "🧘🏻": "person_in_lotus_position:t2", "🧘🏼": "person_in_lotus_position:t3", "🧘🏽": "person_in_lotus_position:t4", "🧘🏾": "person_in_lotus_position:t5", "🧘🏿": "person_in_lotus_position:t6", "🧘‍♂️": "man_in_lotus_position", "🧘🏻‍♂️": "man_in_lotus_position:t2", "🧘🏼‍♂️": "man_in_lotus_position:t3", "🧘🏽‍♂️": "man_in_lotus_position:t4", "🧘🏾‍♂️": "man_in_lotus_position:t5", "🧘🏿‍♂️": "man_in_lotus_position:t6", "🧘‍♀️": "woman_in_lotus_position", "🧘🏻‍♀️": "woman_in_lotus_position:t2", "🧘🏼‍♀️": "woman_in_lotus_position:t3", "🧘🏽‍♀️": "woman_in_lotus_position:t4", "🧘🏾‍♀️": "woman_in_lotus_position:t5", "🧘🏿‍♀️": "woman_in_lotus_position:t6", "🛀": "person_taking_bath", "🛀🏻": "person_taking_bath:t2", "🛀🏼": "person_taking_bath:t3", "🛀🏽": "person_taking_bath:t4", "🛀🏾": "person_taking_bath:t5", "🛀🏿": "person_taking_bath:t6", "🛌": "person_in_bed", "🛌🏻": "person_in_bed:t2", "🛌🏼": "person_in_bed:t3", "🛌🏽": "person_in_bed:t4", "🛌🏾": "person_in_bed:t5", "🛌🏿": "person_in_bed:t6", "🧑‍🤝‍🧑": "people_holding_hands", "👭": "women_holding_hands", "👭🏻": "women_holding_hands:t2", "👭🏼": "women_holding_hands:t3", "👭🏽": "women_holding_hands:t4", "👭🏾": "women_holding_hands:t5", "👭🏿": "women_holding_hands:t6", "👫": "woman_and_man_holding_hands", "👫🏻": "woman_and_man_holding_hands:t2", "👫🏼": "woman_and_man_holding_hands:t3", "👫🏽": "woman_and_man_holding_hands:t4", "👫🏾": "woman_and_man_holding_hands:t5", "👫🏿": "woman_and_man_holding_hands:t6", "👬": "men_holding_hands", "👬🏻": "men_holding_hands:t2", "👬🏼": "men_holding_hands:t3", "👬🏽": "men_holding_hands:t4", "👬🏾": "men_holding_hands:t5", "👬🏿": "men_holding_hands:t6", "💏": "kiss", "💏🏻": "kiss:t2", "💏🏼": "kiss:t3", "💏🏽": "kiss:t4", "💏🏾": "kiss:t5", "💏🏿": "kiss:t6", "👩‍❤️‍💋‍👨": "kiss_woman_man", "👩🏻‍❤️‍💋‍👨": "kiss_woman_man:t2", "👩🏼‍❤️‍💋‍👨": "kiss_woman_man:t3", "👩🏽‍❤️‍💋‍👨": "kiss_woman_man:t4", "👩🏾‍❤️‍💋‍👨": "kiss_woman_man:t5", "👩🏿‍❤️‍💋‍👨": "kiss_woman_man:t6", "👨‍❤️‍💋‍👨": "kiss_man_man", "👨🏻‍❤️‍💋‍👨": "kiss_man_man:t2", "👨🏼‍❤️‍💋‍👨": "kiss_man_man:t3", "👨🏽‍❤️‍💋‍👨": "kiss_man_man:t4", "👨🏾‍❤️‍💋‍👨": "kiss_man_man:t5", "👨🏿‍❤️‍💋‍👨": "kiss_man_man:t6", "👩‍❤️‍💋‍👩": "kiss_woman_woman", "👩🏻‍❤️‍💋‍👩": "kiss_woman_woman:t2", "👩🏼‍❤️‍💋‍👩": "kiss_woman_woman:t3", "👩🏽‍❤️‍💋‍👩": "kiss_woman_woman:t4", "👩🏾‍❤️‍💋‍👩": "kiss_woman_woman:t5", "👩🏿‍❤️‍💋‍👩": "kiss_woman_woman:t6", "💑": "couple_with_heart", "💑🏻": "couple_with_heart:t2", "💑🏼": "couple_with_heart:t3", "💑🏽": "couple_with_heart:t4", "💑🏾": "couple_with_heart:t5", "💑🏿": "couple_with_heart:t6", "👩‍❤️‍👨": "couple_with_heart_woman_man", "👩🏻‍❤️‍👨": "couple_with_heart_woman_man:t2", "👩🏼‍❤️‍👨": "couple_with_heart_woman_man:t3", "👩🏽‍❤️‍👨": "couple_with_heart_woman_man:t4", "👩🏾‍❤️‍👨": "couple_with_heart_woman_man:t5", "👩🏿‍❤️‍👨": "couple_with_heart_woman_man:t6", "👨‍❤️‍👨": "couple_with_heart_man_man", "👨🏻‍❤️‍👨": "couple_with_heart_man_man:t2", "👨🏼‍❤️‍👨": "couple_with_heart_man_man:t3", "👨🏽‍❤️‍👨": "couple_with_heart_man_man:t4", "👨🏾‍❤️‍👨": "couple_with_heart_man_man:t5", "👨🏿‍❤️‍👨": "couple_with_heart_man_man:t6", "👩‍❤️‍👩": "couple_with_heart_woman_woman", "👩🏻‍❤️‍👩": "couple_with_heart_woman_woman:t2", "👩🏼‍❤️‍👩": "couple_with_heart_woman_woman:t3", "👩🏽‍❤️‍👩": "couple_with_heart_woman_woman:t4", "👩🏾‍❤️‍👩": "couple_with_heart_woman_woman:t5", "👩🏿‍❤️‍👩": "couple_with_heart_woman_woman:t6", "👨‍👩‍👦": "family_man_woman_boy", "👨‍👩‍👧": "family_man_woman_girl", "👨‍👩‍👧‍👦": "family_man_woman_girl_boy", "👨‍👩‍👦‍👦": "family_man_woman_boy_boy", "👨‍👩‍👧‍👧": "family_man_woman_girl_girl", "👨‍👨‍👦": "family_man_man_boy", "👨‍👨‍👧": "family_man_man_girl", "👨‍👨‍👧‍👦": "family_man_man_girl_boy", "👨‍👨‍👦‍👦": "family_man_man_boy_boy", "👨‍👨‍👧‍👧": "family_man_man_girl_girl", "👩‍👩‍👦": "family_woman_woman_boy", "👩‍👩‍👧": "family_woman_woman_girl", "👩‍👩‍👧‍👦": "family_woman_woman_girl_boy", "👩‍👩‍👦‍👦": "family_woman_woman_boy_boy", "👩‍👩‍👧‍👧": "family_woman_woman_girl_girl", "👨‍👦": "family_man_boy", "👨‍👦‍👦": "family_man_boy_boy", "👨‍👧": "family_man_girl", "👨‍👧‍👦": "family_man_girl_boy", "👨‍👧‍👧": "family_man_girl_girl", "👩‍👦": "family_woman_boy", "👩‍👦‍👦": "family_woman_boy_boy", "👩‍👧": "family_woman_girl", "👩‍👧‍👦": "family_woman_girl_boy", "👩‍👧‍👧": "family_woman_girl_girl", "🗣": "speaking_head", "👤": "bust_in_silhouette", "👥": "busts_in_silhouette", "🫂": "people_hugging", "👪": "family", "🧑‍🧑‍🧒": "family_adult_adult_child", "🧑‍🧑‍🧒‍🧒": "family_adult_adult_child_child", "🧑‍🧒": "family_adult_child", "🧑‍🧒‍🧒": "family_adult_child_child", "👣": "footprints", "🫆": "fingerprint", "🦰": "red_hair", "🦱": "curly_hair", "🦳": "white_hair", "🦲": "bald", "🐵": "monkey_face", "🐒": "monkey", "🦍": "gorilla", "🦧": "orangutan", "🐶": "dog_face", "🐕": "dog", "🦮": "guide_dog", "🐕‍🦺": "service_dog", "🐩": "poodle", "🐺": "wolf", "🦊": "fox", "🦝": "raccoon", "🐱": "cat_face", "🐈": "cat", "🐈‍⬛": "black_cat", "🦁": "lion", "🐯": "tiger_face", "🐅": "tiger", "🐆": "leopard", "🐴": "horse_face", "🫎": "moose", "🫏": "donkey", "🐎": "horse", "🦄": "unicorn", "🦓": "zebra", "🦌": "deer", "🦬": "bison", "🐮": "cow_face", "🐂": "ox", "🐃": "water_buffalo", "🐄": "cow", "🐷": "pig_face", "🐖": "pig", "🐗": "boar", "🐽": "pig_nose", "🐏": "ram", "🐑": "ewe", "🐐": "goat", "🐪": "camel", "🐫": "two_hump_camel", "🦙": "llama", "🦒": "giraffe", "🐘": "elephant", "🦣": "mammoth", "🦏": "rhinoceros", "🦛": "hippopotamus", "🐭": "mouse_face", "🐁": "mouse", "🐀": "rat", "🐹": "hamster", "🐰": "rabbit_face", "🐇": "rabbit", "🐿": "chipmunk", "🦫": "beaver", "🦔": "hedgehog", "🦇": "bat", "🐻": "bear", "🐻‍❄️": "polar_bear", "🐨": "koala", "🐼": "panda", "🦥": "sloth", "🦦": "otter", "🦨": "skunk", "🦘": "kangaroo", "🦡": "badger", "🐾": "paw_prints", "🦃": "turkey", "🐔": "chicken", "🐓": "rooster", "🐣": "hatching_chick", "🐤": "baby_chick", "🐥": "front_facing_baby_chick", "🐦": "bird", "🐧": "penguin", "🕊": "dove", "🦅": "eagle", "🦆": "duck", "🦢": "swan", "🦉": "owl", "🦤": "dodo", "🪶": "feather", "🦩": "flamingo", "🦚": "peacock", "🦜": "parrot", "🪽": "wing", "🐦‍⬛": "black_bird", "🪿": "goose", "🐦‍🔥": "phoenix", "🐸": "frog", "🐊": "crocodile", "🐢": "turtle", "🦎": "lizard", "🐍": "snake", "🐲": "dragon_face", "🐉": "dragon", "🦕": "sauropod", "🦖": "t_rex", "🐳": "spouting_whale", "🐋": "whale", "🐬": "dolphin", "🦭": "seal", "🐟": "fish", "🐠": "tropical_fish", "🐡": "blowfish", "🦈": "shark", "🐙": "octopus", "🐚": "spiral_shell", "🪸": "coral", "🪼": "jellyfish", "🦀": "crab", "🦞": "lobster", "🦐": "shrimp", "🦑": "squid", "🦪": "oyster", "🐌": "snail", "🦋": "butterfly", "🐛": "bug", "🐜": "ant", "🐝": "honeybee", "🪲": "beetle", "🐞": "lady_beetle", "🦗": "cricket", "🪳": "cockroach", "🕷": "spider", "🕸": "spider_web", "🦂": "scorpion", "🦟": "mosquito", "🪰": "fly", "🪱": "worm", "🦠": "microbe", "💐": "bouquet", "🌸": "cherry_blossom", "💮": "white_flower", "🪷": "lotus", "🏵": "rosette", "🌹": "rose", "🥀": "wilted_flower", "🌺": "hibiscus", "🌻": "sunflower", "🌼": "blossom", "🌷": "tulip", "🪻": "hyacinth", "🌱": "seedling", "🪴": "potted_plant", "🌲": "evergreen_tree", "🌳": "deciduous_tree", "🌴": "palm_tree", "🌵": "cactus", "🌾": "sheaf_of_rice", "🌿": "herb", "☘": "shamrock", "🍀": "four_leaf_clover", "🍁": "maple_leaf", "🍂": "fallen_leaf", "🍃": "leaf_fluttering_in_wind", "🪹": "empty_nest", "🪺": "nest_with_eggs", "🍄": "mushroom", "🪾": "leafless_tree", "🍇": "grapes", "🍈": "melon", "🍉": "watermelon", "🍊": "tangerine", "🍋": "lemon", "🍋‍🟩": "lime", "🍌": "banana", "🍍": "pineapple", "🥭": "mango", "🍎": "red_apple", "🍏": "green_apple", "🍐": "pear", "🍑": "peach", "🍒": "cherries", "🍓": "strawberry", "🫐": "blueberries", "🥝": "kiwi_fruit", "🍅": "tomato", "🫒": "olive", "🥥": "coconut", "🥑": "avocado", "🍆": "eggplant", "🥔": "potato", "🥕": "carrot", "🌽": "ear_of_corn", "🌶": "hot_pepper", "🫑": "bell_pepper", "🥒": "cucumber", "🥬": "leafy_green", "🥦": "broccoli", "🧄": "garlic", "🧅": "onion", "🥜": "peanuts", "🫘": "beans", "🌰": "chestnut", "🫚": "ginger_root", "🫛": "pea_pod", "🍄‍🟫": "brown_mushroom", "🫜": "root_vegetable", "🍞": "bread", "🥐": "croissant", "🥖": "baguette_bread", "🫓": "flatbread", "🥨": "pretzel", "🥯": "bagel", "🥞": "pancakes", "🧇": "waffle", "🧀": "cheese_wedge", "🍖": "meat_on_bone", "🍗": "poultry_leg", "🥩": "cut_of_meat", "🥓": "bacon", "🍔": "hamburger", "🍟": "french_fries", "🍕": "pizza", "🌭": "hot_dog", "🥪": "sandwich", "🌮": "taco", "🌯": "burrito", "🫔": "tamale", "🥙": "stuffed_flatbread", "🧆": "falafel", "🥚": "egg", "🍳": "cooking", "🥘": "shallow_pan_of_food", "🍲": "pot_of_food", "🫕": "fondue", "🥣": "bowl_with_spoon", "🥗": "green_salad", "🍿": "popcorn", "🧈": "butter", "🧂": "salt", "🥫": "canned_food", "🍱": "bento_box", "🍘": "rice_cracker", "🍙": "rice_ball", "🍚": "cooked_rice", "🍛": "curry_rice", "🍜": "steaming_bowl", "🍝": "spaghetti", "🍠": "roasted_sweet_potato", "🍢": "oden", "🍣": "sushi", "🍤": "fried_shrimp", "🍥": "fish_cake_with_swirl", "🥮": "moon_cake", "🍡": "dango", "🥟": "dumpling", "🥠": "fortune_cookie", "🥡": "takeout_box", "🍦": "soft_ice_cream", "🍧": "shaved_ice", "🍨": "ice_cream", "🍩": "doughnut", "🍪": "cookie", "🎂": "birthday_cake", "🍰": "shortcake", "🧁": "cupcake", "🥧": "pie", "🍫": "chocolate_bar", "🍬": "candy", "🍭": "lollipop", "🍮": "custard", "🍯": "honey_pot", "🍼": "baby_bottle", "🥛": "glass_of_milk", "☕": "hot_beverage", "🫖": "teapot", "🍵": "teacup_without_handle", "🍶": "sake", "🍾": "bottle_with_popping_cork", "🍷": "wine_glass", "🍸": "cocktail_glass", "🍹": "tropical_drink", "🍺": "beer_mug", "🍻": "clinking_beer_mugs", "🥂": "clinking_glasses", "🥃": "tumbler_glass", "🫗": "pouring_liquid", "🥤": "cup_with_straw", "🧋": "bubble_tea", "🧃": "beverage_box", "🧉": "mate", "🧊": "ice", "🥢": "chopsticks", "🍽": "fork_and_knife_with_plate", "🍴": "fork_and_knife", "🥄": "spoon", "🔪": "kitchen_knife", "🫙": "jar", "🏺": "amphora", "🌍": "globe_showing_europe_africa", "🌎": "globe_showing_americas", "🌏": "globe_showing_asia_australia", "🌐": "globe_with_meridians", "🗺": "world_map", "🗾": "map_of_japan", "🧭": "compass", "🏔": "snow_capped_mountain", "⛰": "mountain", "🌋": "volcano", "🗻": "mount_fuji", "🏕": "camping", "🏖": "beach_with_umbrella", "🏜": "desert", "🏝": "desert_island", "🏞": "national_park", "🏟": "stadium", "🏛": "classical_building", "🏗": "building_letruction", "🧱": "brick", "🪨": "rock", "🪵": "wood", "🛖": "hut", "🏘": "houses", "🏚": "derelict_house", "🏠": "house", "🏡": "house_with_garden", "🏢": "office_building", "🏣": "japanese_post_office", "🏤": "post_office", "🏥": "hospital", "🏦": "bank", "🏨": "hotel", "🏩": "love_hotel", "🏪": "convenience_store", "🏫": "school", "🏬": "department_store", "🏭": "factory", "🏯": "japanese_castle", "🏰": "castle", "💒": "wedding", "🗼": "tokyo_tower", "🗽": "statue_of_liberty", "⛪": "church", "🕌": "mosque", "🛕": "hindu_temple", "🕍": "synagogue", "⛩": "shinto_shrine", "🕋": "kaaba", "⛲": "fountain", "⛺": "tent", "🌁": "foggy", "🌃": "night_with_stars", "🏙": "cityscape", "🌄": "sunrise_over_mountains", "🌅": "sunrise", "🌆": "cityscape_at_dusk", "🌇": "sunset", "🌉": "bridge_at_night", "♨": "hot_springs", "🎠": "carousel_horse", "🛝": "playground_slide", "🎡": "ferris_wheel", "🎢": "roller_coaster", "💈": "barber_pole", "🎪": "circus_tent", "🚂": "locomotive", "🚃": "railway_car", "🚄": "high_speed_train", "🚅": "bullet_train", "🚆": "train", "🚇": "metro", "🚈": "light_rail", "🚉": "station", "🚊": "tram", "🚝": "monorail", "🚞": "mountain_railway", "🚋": "tram_car", "🚌": "bus", "🚍": "oncoming_bus", "🚎": "trolleybus", "🚐": "minibus", "🚑": "ambulance", "🚒": "fire_engine", "🚓": "police_car", "🚔": "oncoming_police_car", "🚕": "taxi", "🚖": "oncoming_taxi", "🚗": "automobile", "🚘": "oncoming_automobile", "🚙": "sport_utility_vehicle", "🛻": "pickup_truck", "🚚": "delivery_truck", "🚛": "articulated_lorry", "🚜": "tractor", "🏎": "racing_car", "🏍": "motorcycle", "🛵": "motor_scooter", "🦽": "manual_wheelchair", "🦼": "motorized_wheelchair", "🛺": "auto_rickshaw", "🚲": "bicycle", "🛴": "kick_scooter", "🛹": "skateboard", "🛼": "roller_skate", "🚏": "bus_stop", "🛣": "motorway", "🛤": "railway_track", "🛢": "oil_drum", "⛽": "fuel_pump", "🛞": "wheel", "🚨": "police_car_light", "🚥": "horizontal_traffic_light", "🚦": "vertical_traffic_light", "🛑": "stop_sign", "🚧": "letruction", "⚓": "anchor", "🛟": "ring_buoy", "⛵": "sailboat", "🛶": "canoe", "🚤": "speedboat", "🛳": "passenger_ship", "⛴": "ferry", "🛥": "motor_boat", "🚢": "ship", "✈": "airplane", "🛩": "small_airplane", "🛫": "airplane_departure", "🛬": "airplane_arrival", "🪂": "parachute", "💺": "seat", "🚁": "helicopter", "🚟": "suspension_railway", "🚠": "mountain_cableway", "🚡": "aerial_tramway", "🛰": "satellite", "🚀": "rocket", "🛸": "flying_saucer", "🛎": "bellhop_bell", "🧳": "luggage", "⌛": "hourglass_done", "⏳": "hourglass_not_done", "⌚": "watch", "⏰": "alarm_clock", "⏱": "stopwatch", "⏲": "timer_clock", "🕰": "mantelpiece_clock", "🕛": "twelve_o_clock", "🕧": "twelve_thirty", "🕐": "one_o_clock", "🕜": "one_thirty", "🕑": "two_o_clock", "🕝": "two_thirty", "🕒": "three_o_clock", "🕞": "three_thirty", "🕓": "four_o_clock", "🕟": "four_thirty", "🕔": "five_o_clock", "🕠": "five_thirty", "🕕": "six_o_clock", "🕡": "six_thirty", "🕖": "seven_o_clock", "🕢": "seven_thirty", "🕗": "eight_o_clock", "🕣": "eight_thirty", "🕘": "nine_o_clock", "🕤": "nine_thirty", "🕙": "ten_o_clock", "🕥": "ten_thirty", "🕚": "eleven_o_clock", "🕦": "eleven_thirty", "🌑": "new_moon", "🌒": "waxing_crescent_moon", "🌓": "first_quarter_moon", "🌔": "waxing_gibbous_moon", "🌕": "full_moon", "🌖": "waning_gibbous_moon", "🌗": "last_quarter_moon", "🌘": "waning_crescent_moon", "🌙": "crescent_moon", "🌚": "new_moon_face", "🌛": "first_quarter_moon_face", "🌜": "last_quarter_moon_face", "🌡": "thermometer", "☀": "sun", "🌝": "full_moon_face", "🌞": "sun_with_face", "🪐": "ringed_planet", "⭐": "star", "🌟": "glowing_star", "🌠": "shooting_star", "🌌": "milky_way", "☁": "cloud", "⛅": "sun_behind_cloud", "⛈": "cloud_with_lightning_and_rain", "🌤": "sun_behind_small_cloud", "🌥": "sun_behind_large_cloud", "🌦": "sun_behind_rain_cloud", "🌧": "cloud_with_rain", "🌨": "cloud_with_snow", "🌩": "cloud_with_lightning", "🌪": "tornado", "🌫": "fog", "🌬": "wind_face", "🌀": "cyclone", "🌈": "rainbow", "🌂": "closed_umbrella", "☂": "umbrella", "☔": "umbrella_with_rain_drops", "⛱": "umbrella_on_ground", "⚡": "high_voltage", "❄": "snowflake", "☃": "snowman", "⛄": "snowman_without_snow", "☄": "comet", "🔥": "fire", "💧": "droplet", "🌊": "ocean", "🎃": "jack_o_lantern", "🎄": "christmas_tree", "🎆": "fireworks", "🎇": "sparkler", "🧨": "firecracker", "✨": "sparkles", "🎈": "balloon", "🎉": "party_popper", "🎊": "confetti_ball", "🎋": "tanabata_tree", "🎍": "pine_decoration", "🎎": "japanese_dolls", "🎏": "carp_streamer", "🎐": "wind_chime", "🎑": "moon_viewing_ceremony", "🧧": "red_envelope", "🎀": "ribbon", "🎁": "wrapped_gift", "🎗": "reminder_ribbon", "🎟": "admission_tickets", "🎫": "ticket", "🎖": "military_medal", "🏆": "trophy", "🏅": "sports_medal", "🥇": "1st_place_medal", "🥈": "2nd_place_medal", "🥉": "3rd_place_medal", "⚽": "soccer_ball", "⚾": "baseball", "🥎": "softball", "🏀": "basketball", "🏐": "volleyball", "🏈": "american_football", "🏉": "rugby_football", "🎾": "tennis", "🥏": "flying_disc", "🎳": "bowling", "🏏": "cricket_game", "🏑": "field_hockey", "🏒": "ice_hockey", "🥍": "lacrosse", "🏓": "ping_pong", "🏸": "badminton", "🥊": "boxing_glove", "🥋": "martial_arts_uniform", "🥅": "goal_net", "⛳": "in_hole", "⛸": "ice_skate", "🎣": "fishing_pole", "🤿": "diving_mask", "🎽": "running_shirt", "🎿": "skis", "🛷": "sled", "🥌": "curling_stone", "🎯": "bullseye", "🪀": "yoyo", "🪁": "kite", "🔫": "water_pistol", "🎱": "pool_8_ball", "🔮": "crystal_ball", "🪄": "magic_wand", "🎮": "video_game", "🕹": "joystick", "🎰": "slot_machine", "🎲": "game_die", "🧩": "puzzle_piece", "🧸": "teddy_bear", "🪅": "piñata", "🪩": "mirror_ball", "🪆": "nesting_dolls", "♠": "spade_suit", "♥": "heart", "♦": "diamond_suit", "♣": "club_suit", "♟": "chess_pawn", "🃏": "joker", "🀄": "mahjong_red_dragon", "🎴": "flower_playing_cards", "🎭": "performing_arts", "🖼": "framed_picture", "🎨": "artist_palette", "🧵": "thread", "🪡": "sewing_needle", "🧶": "yarn", "🪢": "knot", "👓": "glasses", "🕶": "sunglasses", "🥽": "goggles", "🥼": "lab_coat", "🦺": "safety_vest", "👔": "necktie", "👕": "t_shirt", "👖": "jeans", "🧣": "scarf", "🧤": "gloves", "🧥": "coat", "🧦": "socks", "👗": "dress", "👘": "kimono", "🥻": "sari", "🩱": "one_piece_swimsuit", "🩲": "briefs", "🩳": "shorts", "👙": "bikini", "👚": "woman_s_clothes", "🪭": "folding_hand_fan", "👛": "purse", "👜": "handbag", "👝": "clutch_bag", "🛍": "shopping_bags", "🎒": "backpack", "🩴": "thong_sandal", "👞": "man_s_shoe", "👟": "running_shoe", "🥾": "hiking_boot", "🥿": "flat_shoe", "👠": "high_heeled_shoe", "👡": "woman_s_sandal", "🩰": "ballet_shoes", "👢": "woman_s_boot", "🪮": "hair_pick", "👑": "crown", "👒": "woman_s_hat", "🎩": "top_hat", "🎓": "graduation_cap", "🧢": "billed_cap", "🪖": "military_helmet", "⛑": "rescue_worker_s_helmet", "📿": "prayer_beads", "💄": "lipstick", "💍": "ring", "💎": "gem_stone", "🔇": "muted_speaker", "🔈": "speaker_low_volume", "🔉": "speaker_medium_volume", "🔊": "speaker_high_volume", "📢": "loudspeaker", "📣": "megaphone", "📯": "postal_horn", "🔔": "bell", "🔕": "bell_with_slash", "🎼": "musical_score", "🎵": "musical_note", "🎶": "musical_notes", "🎙": "studio_microphone", "🎚": "level_slider", "🎛": "control_knobs", "🎤": "microphone", "🎧": "headphone", "📻": "radio", "🎷": "saxophone", "🪗": "accordion", "🎸": "guitar", "🎹": "musical_keyboard", "🎺": "trumpet", "🎻": "violin", "🪕": "banjo", "🥁": "drum", "🪘": "long_drum", "🪇": "maracas", "🪈": "flute", "🪉": "harp", "📱": "mobile_phone", "📲": "mobile_phone_with_arrow", "☎": "telephone", "📞": "telephone_receiver", "📟": "pager", "📠": "fax_machine", "🔋": "battery", "🪫": "low_battery", "🔌": "electric_plug", "💻": "laptop", "🖥": "desktop_computer", "🖨": "printer", "⌨": "keyboard", "🖱": "computer_mouse", "🖲": "trackball", "💽": "computer_disk", "💾": "floppy_disk", "💿": "optical_disk", "📀": "dvd", "🧮": "abacus", "🎥": "movie_camera", "🎞": "film_frames", "📽": "film_projector", "🎬": "clapper_board", "📺": "television", "📷": "camera", "📸": "camera_with_flash", "📹": "video_camera", "📼": "videocassette", "🔍": "magnifying_glass_tilted_left", "🔎": "magnifying_glass_tilted_right", "🕯": "candle", "💡": "light_bulb", "🔦": "flashlight", "🏮": "red_paper_lantern", "🪔": "diya_lamp", "📔": "notebook_with_decorative_cover", "📕": "closed_book", "📖": "open_book", "📗": "green_book", "📘": "blue_book", "📙": "orange_book", "📚": "books", "📓": "notebook", "📒": "ledger", "📃": "page_with_curl", "📜": "scroll", "📄": "page_facing_up", "📰": "newspaper", "🗞": "rolled_up_newspaper", "📑": "bookmark_tabs", "🔖": "bookmark", "🏷": "label", "💰": "money_bag", "🪙": "coin", "💴": "yen_banknote", "💵": "dollar_banknote", "💶": "euro_banknote", "💷": "pound_banknote", "💸": "money_with_wings", "💳": "credit_card", "🧾": "receipt", "💹": "chart_increasing_with_yen", "✉": "envelope", "📧": "e_mail", "📨": "incoming_envelope", "📩": "envelope_with_arrow", "📤": "outbox_tray", "📥": "inbox_tray", "📦": "package", "📫": "closed_mailbox_with_raised_flag", "📪": "closed_mailbox_with_lowered_flag", "📬": "open_mailbox_with_raised_flag", "📭": "open_mailbox_with_lowered_flag", "📮": "postbox", "🗳": "ballot_box_with_ballot", "✏": "pencil", "✒": "black_nib", "🖋": "fountain_pen", "🖊": "pen", "🖌": "paintbrush", "🖍": "crayon", "📝": "memo", "💼": "briefcase", "📁": "file_folder", "📂": "open_file_folder", "🗂": "card_index_dividers", "📅": "date", "📆": "tear_off_calendar", "🗒": "spiral_notepad", "🗓": "spiral_calendar", "📇": "card_index", "📈": "chart_increasing", "📉": "chart_decreasing", "📊": "bar_chart", "📋": "clipboard", "📌": "pushpin", "📍": "round_pushpin", "📎": "paperclip", "🖇": "linked_paperclips", "📏": "straight_ruler", "📐": "triangular_ruler", "✂": "scissors", "🗃": "card_file_box", "🗄": "file_cabinet", "🗑": "wastebasket", "🔒": "locked", "🔓": "unlocked", "🔏": "locked_with_pen", "🔐": "locked_with_key", "🔑": "key", "🗝": "old_key", "🔨": "hammer", "🪓": "axe", "⛏": "pick", "⚒": "hammer_and_pick", "🛠": "hammer_and_wrench", "🗡": "dagger", "⚔": "crossed_swords", "💣": "bomb", "🪃": "boomerang", "🏹": "bow_and_arrow", "🛡": "shield", "🪚": "carpentry_saw", "🔧": "wrench", "🪛": "screwdriver", "🔩": "nut_and_bolt", "⚙": "gear", "🗜": "clamp", "⚖": "balance_scale", "🦯": "white_cane", "🔗": "link", "⛓️‍💥": "broken_chain", "⛓": "chains", "🪝": "hook", "🧰": "toolbox", "🧲": "magnet", "🪜": "ladder", "🪏": "shovel", "⚗": "alembic", "🧪": "test_tube", "🧫": "petri_dish", "🧬": "dna", "🔬": "microscope", "🔭": "telescope", "📡": "satellite_antenna", "💉": "syringe", "🩸": "drop_of_blood", "💊": "pill", "🩹": "adhesive_bandage", "🩼": "crutch", "🩺": "stethoscope", "🩻": "x_ray", "🚪": "door", "🛗": "elevator", "🪞": "mirror", "🪟": "window", "🛏": "bed", "🛋": "couch_and_lamp", "🪑": "chair", "🚽": "toilet", "🪠": "plunger", "🚿": "shower", "🛁": "bathtub", "🪤": "mouse_trap", "🪒": "razor", "🧴": "lotion_bottle", "🧷": "safety_pin", "🧹": "broom", "🧺": "basket", "🧻": "roll_of_paper", "🪣": "bucket", "🧼": "soap", "🫧": "bubbles", "🪥": "toothbrush", "🧽": "sponge", "🧯": "fire_extinguisher", "🛒": "shopping_cart", "🚬": "cigarette", "⚰": "coffin", "🪦": "headstone", "⚱": "funeral_urn", "🧿": "nazar_amulet", "🪬": "hamsa", "🗿": "moai", "🪧": "placard", "🪪": "identification_card", "🏧": "atm_sign", "🚮": "litter_in_bin_sign", "🚰": "potable_water", "♿": "wheelchair_symbol", "🚹": "men_s_room", "🚺": "women_s_room", "🚻": "restroom", "🚼": "baby_symbol", "🚾": "water_closet", "🛂": "passport_control", "🛃": "customs", "🛄": "baggage_claim", "🛅": "left_luggage", "⚠": "warning", "🚸": "children_crossing", "⛔": "no_entry", "🚫": "prohibited", "🚳": "no_bicycles", "🚭": "no_smoking", "🚯": "no_littering", "🚱": "non_potable_water", "🚷": "no_pedestrians", "📵": "no_mobile_phones", "🔞": "no_one_under_eighteen", "☢": "radioactive", "☣": "biohazard", "⬆": "up_arrow", "↗": "up_right_arrow", "➡": "right_arrow", "↘": "down_right_arrow", "⬇": "down_arrow", "↙": "down_left_arrow", "⬅": "left_arrow", "↖": "up_left_arrow", "↕": "up_down_arrow", "↩": "right_arrow_curving_left", "↪": "left_arrow_curving_right", "⤴": "right_arrow_curving_up", "⤵": "right_arrow_curving_down", "🔃": "clockwise_vertical_arrows", "🔄": "counterclockwise_arrows_button", "🔙": "back_arrow", "🔚": "end_arrow", "🔛": "on_arrow", "🔜": "soon_arrow", "🔝": "top_arrow", "🛐": "place_of_worship", "⚛": "atom_symbol", "🕉": "om", "✡": "star_of_david", "☸": "wheel_of_dharma", "☯": "yin_yang", "✝": "latin_cross", "☦": "orthodox_cross", "☪": "star_and_crescent", "☮": "peace_symbol", "🕎": "menorah", "🔯": "dotted_six_pointed_star", "🪯": "khanda", "♈": "aries", "♉": "taurus", "♊": "gemini", "♋": "cancer", "♌": "leo", "♍": "virgo", "♎": "libra", "♏": "scorpio", "♐": "sagittarius", "♑": "capricorn", "♒": "aquarius", "♓": "pisces", "⛎": "ophiuchus", "🔀": "shuffle_tracks_button", "🔁": "repeat_button", "🔂": "repeat_single_button", "▶": "play_button", "⏩": "fast_forward_button", "⏭": "next_track_button", "⏯": "play_or_pause_button", "◀": "reverse_button", "⏪": "fast_reverse_button", "⏮": "last_track_button", "🔼": "upwards_button", "⏫": "fast_up_button", "🔽": "downwards_button", "⏬": "fast_down_button", "⏸": "pause_button", "⏹": "stop_button", "⏺": "record_button", "⏏": "eject_button", "🎦": "cinema", "🔅": "dim_button", "🔆": "bright_button", "📶": "antenna_bars", "🛜": "wireless", "📳": "vibration_mode", "📴": "mobile_phone_off", "♀": "female_sign", "♂": "male_sign", "⚧": "transgender_symbol", "✖": "multiply", "➕": "plus", "➖": "minus", "➗": "divide", "🟰": "heavy_equals_sign", "♾": "infinity", "‼": "double_exclamation_mark", "⁉": "exclamation_question_mark", "❓": "red_question_mark", "❔": "white_question_mark", "❕": "white_exclamation_mark", "❗": "red_exclamation_mark", "〰": "wavy_dash", "💱": "currency_exchange", "💲": "heavy_dollar_sign", "⚕": "medical_symbol", "♻": "recycling_symbol", "⚜": "fleur_de_lis", "🔱": "trident_emblem", "📛": "name_badge", "🔰": "japanese_symbol_for_beginner", "⭕": "hollow_red_circle", "✅": "white_check_mark", "☑": "check_box_with_check", "✔": "check_mark", "❌": "cross_mark", "❎": "cross_mark_button", "➰": "curly_loop", "➿": "double_curly_loop", "〽": "part_alternation_mark", "✳": "eight_spoked_asterisk", "✴": "eight_pointed_star", "❇": "sparkle", "™": "trade_mark", "🫟": "splatter", "#️⃣": "hash", "*️⃣": "asterisk", "0️⃣": "zero", "1️⃣": "one", "2️⃣": "two", "3️⃣": "three", "4️⃣": "four", "5️⃣": "five", "6️⃣": "six", "7️⃣": "seven", "8️⃣": "eight", "9️⃣": "nine", "🔟": "ten", "🔠": "input_latin_uppercase", "🔡": "input_latin_lowercase", "🔢": "1234", "🔣": "input_symbols", "🔤": "input_latin_letters", "🅰": "a_button_blood_type", "🆎": "ab_button_blood_type", "🅱": "b_button_blood_type", "🆑": "cl_button", "🆒": "cool_button", "🆓": "free_button", ℹ: "information_source", "🆔": "id_button", "Ⓜ": "circled_m", "🆕": "new_button", "🆖": "ng_button", "🅾": "o_button_blood_type", "🆗": "ok_button", "🅿": "p_button", "🆘": "sos_button", "🆙": "up_button", "🆚": "vs_button", "🈁": "japanese_here_button", "🈂": "japanese_service_charge_button", "🈷": "japanese_monthly_amount_button", "🈶": "japanese_not_free_of_charge_button", "🈯": "japanese_reserved_button", "🉐": "japanese_bargain_button", "🈹": "japanese_discount_button", "🈚": "japanese_free_of_charge_button", "🈲": "japanese_prohibited_button", "🉑": "japanese_acceptable_button", "🈸": "japanese_application_button", "🈴": "japanese_passing_grade_button", "🈳": "japanese_vacancy_button", "㊗": "japanese_congratulations_button", "㊙": "japanese_secret_button", "🈺": "japanese_open_for_business_button", "🈵": "japanese_no_vacancy_button", "🔴": "red_circle", "🟠": "orange_circle", "🟡": "yellow_circle", "🟢": "green_circle", "🔵": "blue_circle", "🟣": "purple_circle", "🟤": "brown_circle", "⚫": "black_circle", "⚪": "white_circle", "🟥": "red_square", "🟧": "orange_square", "🟨": "yellow_square", "🟩": "green_square", "🟦": "blue_square", "🟪": "purple_square", "🟫": "brown_square", "⬛": "black_large_square", "⬜": "white_large_square", "◼": "black_medium_square", "◻": "white_medium_square", "◾": "black_medium_small_square", "◽": "white_medium_small_square", "▪": "black_small_square", "▫": "white_small_square", "🔶": "large_orange_diamond", "🔷": "large_blue_diamond", "🔸": "small_orange_diamond", "🔹": "small_blue_diamond", "🔺": "red_triangle_pointed_up", "🔻": "red_triangle_pointed_down", "💠": "diamond_with_a_dot", "🔘": "radio_button", "🔳": "white_square_button", "🔲": "black_square_button", "🏁": "chequered_flag", "🚩": "triangular_flag", "🎌": "crossed_flags", "🏴": "black_flag", "🏳": "white_flag", "🏳️‍🌈": "rainbow_flag", "🏳️‍⚧️": "transgender_flag", "🏴‍☠️": "pirate_flag", "🇦🇨": "ascension_island", "🇦🇩": "andorra", "🇦🇪": "united_arab_emirates", "🇦🇫": "afghanistan", "🇦🇬": "antigua_barbuda", "🇦🇮": "anguilla", "🇦🇱": "albania", "🇦🇲": "armenia", "🇦🇴": "angola", "🇦🇶": "antarctica", "🇦🇷": "argentina", "🇦🇸": "american_samoa", "🇦🇹": "austria", "🇦🇺": "australia", "🇦🇼": "aruba", "🇦🇽": "åland_islands", "🇦🇿": "azerbaijan", "🇧🇦": "bosnia_herzegovina", "🇧🇧": "barbados", "🇧🇩": "bangladesh", "🇧🇪": "belgium", "🇧🇫": "burkina_faso", "🇧🇬": "bulgaria", "🇧🇭": "bahrain", "🇧🇮": "burundi", "🇧🇯": "benin", "🇧🇱": "st_barthelemy", "🇧🇲": "bermuda", "🇧🇳": "brunei", "🇧🇴": "bolivia", "🇧🇶": "caribbean_netherlands", "🇧🇷": "brazil", "🇧🇸": "bahamas", "🇧🇹": "bhutan", "🇧🇻": "bouvet_island", "🇧🇼": "botswana", "🇧🇾": "belarus", "🇧🇿": "belize", "🇨🇦": "canada", "🇨🇨": "cocos_keeling_islands", "🇨🇩": "congo_kinshasa", "🇨🇫": "central_african_republic", "🇨🇬": "congo_brazzaville", "🇨🇭": "switzerland", "🇨🇮": "côte_d_ivoire", "🇨🇰": "cook_islands", "🇨🇱": "chile", "🇨🇲": "cameroon", "🇨🇳": "china", "🇨🇴": "colombia", "🇨🇵": "clipperton_island", "🇨🇷": "costa_rica", "🇨🇺": "cuba", "🇨🇻": "cape_verde", "🇨🇼": "curaçao", "🇨🇽": "christmas_island", "🇨🇾": "cyprus", "🇨🇿": "czechia", "🇩🇪": "germany", "🇩🇬": "diego_garcia", "🇩🇯": "djibouti", "🇩🇰": "denmark", "🇩🇲": "dominica", "🇩🇴": "dominican_republic", "🇩🇿": "algeria", "🇪🇦": "ceuta_melilla", "🇪🇨": "ecuador", "🇪🇪": "estonia", "🇪🇬": "egypt", "🇪🇭": "western_sahara", "🇪🇷": "eritrea", "🇪🇸": "spain", "🇪🇹": "ethiopia", "🇪🇺": "european_union", "🇫🇮": "finland", "🇫🇯": "fiji", "🇫🇰": "falkland_islands", "🇫🇲": "micronesia", "🇫🇴": "faroe_islands", "🇫🇷": "france", "🇬🇦": "gabon", "🇬🇧": "united_kingdom", "🇬🇩": "grenada", "🇬🇪": "georgia", "🇬🇫": "french_guiana", "🇬🇬": "guernsey", "🇬🇭": "ghana", "🇬🇮": "gibraltar", "🇬🇱": "greenland", "🇬🇲": "gambia", "🇬🇳": "guinea", "🇬🇵": "guadeloupe", "🇬🇶": "equatorial_guinea", "🇬🇷": "greece", "🇬🇸": "south_georgia_south_sandwich_islands", "🇬🇹": "guatemala", "🇬🇺": "guam", "🇬🇼": "guinea_bissau", "🇬🇾": "guyana", "🇭🇰": "hong_kong_sar_china", "🇭🇲": "heard_mcdonald_islands", "🇭🇳": "honduras", "🇭🇷": "croatia", "🇭🇹": "haiti", "🇭🇺": "hungary", "🇮🇨": "canary_islands", "🇮🇩": "indonesia", "🇮🇪": "ireland", "🇮🇱": "israel", "🇮🇲": "isle_of_man", "🇮🇳": "india", "🇮🇴": "british_indian_ocean_territory", "🇮🇶": "iraq", "🇮🇷": "iran", "🇮🇸": "iceland", "🇮🇹": "italy", "🇯🇪": "jersey", "🇯🇲": "jamaica", "🇯🇴": "jordan", "🇯🇵": "japan", "🇰🇪": "kenya", "🇰🇬": "kyrgyzstan", "🇰🇭": "cambodia", "🇰🇮": "kiribati", "🇰🇲": "comoros", "🇰🇳": "st_kitts_nevis", "🇰🇵": "north_korea", "🇰🇷": "south_korea", "🇰🇼": "kuwait", "🇰🇾": "cayman_islands", "🇰🇿": "kazakhstan", "🇱🇦": "laos", "🇱🇧": "lebanon", "🇱🇨": "st_lucia", "🇱🇮": "liechtenstein", "🇱🇰": "sri_lanka", "🇱🇷": "liberia", "🇱🇸": "lesotho", "🇱🇹": "lithuania", "🇱🇺": "luxembourg", "🇱🇻": "latvia", "🇱🇾": "libya", "🇲🇦": "morocco", "🇲🇨": "monaco", "🇲🇩": "moldova", "🇲🇪": "montenegro", "🇲🇫": "st_martin", "🇲🇬": "madagascar", "🇲🇭": "marshall_islands", "🇲🇰": "north_macedonia", "🇲🇱": "mali", "🇲🇲": "myanmar_burma", "🇲🇳": "mongolia", "🇲🇴": "macao_sar_china", "🇲🇵": "northern_mariana_islands", "🇲🇶": "martinique", "🇲🇷": "mauritania", "🇲🇸": "montserrat", "🇲🇹": "malta", "🇲🇺": "mauritius", "🇲🇻": "maldives", "🇲🇼": "malawi", "🇲🇽": "mexico", "🇲🇾": "malaysia", "🇲🇿": "mozambique", "🇳🇦": "namibia", "🇳🇨": "new_caledonia", "🇳🇪": "niger", "🇳🇫": "norfolk_island", "🇳🇬": "nigeria", "🇳🇮": "nicaragua", "🇳🇱": "netherlands", "🇳🇴": "norway", "🇳🇵": "nepal", "🇳🇷": "nauru", "🇳🇺": "niue", "🇳🇿": "new_zealand", "🇴🇲": "oman", "🇵🇦": "panama", "🇵🇪": "peru", "🇵🇫": "french_polynesia", "🇵🇬": "papua_new_guinea", "🇵🇭": "philippines", "🇵🇰": "pakistan", "🇵🇱": "poland", "🇵🇲": "st_pierre_miquelon", "🇵🇳": "pitcairn_islands", "🇵🇷": "puerto_rico", "🇵🇸": "palestinian_territories", "🇵🇹": "portugal", "🇵🇼": "palau", "🇵🇾": "paraguay", "🇶🇦": "qatar", "🇷🇪": "reunion", "🇷🇴": "romania", "🇷🇸": "serbia", "🇷🇺": "russia", "🇷🇼": "rwanda", "🇸🇦": "saudi_arabia", "🇸🇧": "solomon_islands", "🇸🇨": "seychelles", "🇸🇩": "sudan", "🇸🇪": "sweden", "🇸🇬": "singapore", "🇸🇭": "st_helena", "🇸🇮": "slovenia", "🇸🇯": "svalbard_jan_mayen", "🇸🇰": "slovakia", "🇸🇱": "sierra_leone", "🇸🇲": "san_marino", "🇸🇳": "senegal", "🇸🇴": "somalia", "🇸🇷": "suriname", "🇸🇸": "south_sudan", "🇸🇹": "sao_tome_principe", "🇸🇻": "el_salvador", "🇸🇽": "sint_maarten", "🇸🇾": "syria", "🇸🇿": "eswatini", "🇹🇦": "tristan_da_cunha", "🇹🇨": "turks_caicos_islands", "🇹🇩": "chad", "🇹🇫": "french_southern_territories", "🇹🇬": "togo", "🇹🇭": "thailand", "🇹🇯": "tajikistan", "🇹🇰": "tokelau", "🇹🇱": "timor_leste", "🇹🇲": "turkmenistan", "🇹🇳": "tunisia", "🇹🇴": "tonga", "🇹🇷": "türkiye", "🇹🇹": "trinidad_tobago", "🇹🇻": "tuvalu", "🇹🇼": "taiwan", "🇹🇿": "tanzania", "🇺🇦": "ukraine", "🇺🇬": "uganda", "🇺🇲": "us_outlying_islands", "🇺🇳": "united_nations", "🇺🇸": "united_states", "🇺🇾": "uruguay", "🇺🇿": "uzbekistan", "🇻🇦": "vatican_city", "🇻🇨": "st_vincent_grenadines", "🇻🇪": "venezuela", "🇻🇬": "british_virgin_islands", "🇻🇮": "us_virgin_islands", "🇻🇳": "vietnam", "🇻🇺": "vanuatu", "🇼🇫": "wallis_futuna", "🇼🇸": "samoa", "🇽🇰": "kosovo", "🇾🇪": "yemen", "🇾🇹": "mayotte", "🇿🇦": "south_africa", "🇿🇲": "zambia", "🇿🇼": "zimbabwe", "🏴󠁧󠁢󠁥󠁮󠁧󠁿": "england", "🏴󠁧󠁢󠁳󠁣󠁴󠁿": "scotland", "🏴󠁧󠁢󠁷󠁬󠁳󠁿": "wales", "☻": "slight_smile", "♡": "heart" };
		let emojiAliases = { st_barthelemy: ["st_barthélemy"], pinata: ["piñata"], reunion: ["réunion"], sao_tome_principe: ["são_tomé_príncipe"], x_ray: ["xray"], right_anger_bubble: ["anger_right"], ballot_box: ["ballot_box_with_ballot"], man_bouncing_ball: ["basketball_man"], person_bouncing_ball: ["person_with_ball", "basketball_player"], bellhop_bell: ["bellhop"], biohazard: ["biohazard_sign"], bow_and_arrow: ["archery"], spiral_calendar: ["calendar_spiral", "spiral_calendar_pad"], card_file_box: ["card_box"]， champagne: ["bottle_with_popping_cork"], cheese: ["cheese_wedge"], cityscape_at_dusk: ["city_sunset", "city_dusk"], couch_and_lamp: ["couch"], crayon: ["lower_left_crayon"], cricket_game: ["cricket_bat_and_ball", "cricket_bat_ball"], latin_cross: ["cross"], dagger: ["dagger_knife"], desktop_computer: ["desktop"], card_index_dividers: ["dividers"], dove: ["dove_of_peace"], footprints: ["feet"], fire: ["flame"], black_flag: ["flag_black", "waving_black_flag"], white_flag: ["flag_white", "waving_white_flag"]， framed_picture: ["frame_photo", "frame_with_picture"], hammer_and_pick: ["hammer_pick"], houses: ["homes", "house_buildings"], hotdog: ["hot_dog"], derelict_house: ["house_abandoned", "derelict_house_building"], desert_island: ["island"], old_key: ["key2"], person_lifting_weights: ["lifter", "weight_lifter"], military_medal: ["medal_military"], sports_medal: ["medal_sports", "medal"], sign_of_the_horns: ["metal"], fu: ["middle_finger", "reversed_hand_with_middle_finger_extended"], motorcycle: ["racing_motorcycle"]， mountain_snow: ["snow_capped_mountain"], spiral_notepad: ["notepad_spiral", "spiral_note_pad"], oil_drum: ["oil"], old_woman: ["grandma", "older_woman"], old_man: ["older_man", "grandpa"], paintbrush: ["lower_left_paintbrush"], paperclips: ["linked_paperclips"], pause_button: ["double_vertical_bar"], peace_symbol: ["peace"], fountain_pen: ["pen_fountain", "lower_left_fountain_pen"], ping_pong: ["table_tennis"], place_of_worship: ["worship_symbol"], poop: ["poo", "shit", "pile_of_poo", "hankey"], radioactive: ["radioactive_sign"], railway_track: ["railroad_track"], robot: ["robot_face"], skull: ["skeleton"], skull_and_crossbones: ["skull_crossbones"], speaking_head: ["speaking_head_in_silhouette"], man_detective: ["spy", "sleuth_or_spy", "male_detective"], thinking: ["thinking_face"], cloud_with_lightning_and_rain: ["thunder_cloud_rain", "thunder_cloud_and_rain",], tickets: ["admission_tickets"], next_track_button: ["track_next", "next_track"], unicorn: ["unicorn_face"], funeral_urn: ["urn"], sun_behind_large_cloud: ["white_sun_cloud", "white_sun_behind_cloud"], sun_behind_rain_cloud: ["white_sun_rain_cloud", "white_sun_behind_cloud_with_rain",], sun_behind_cloud: ["partly_sunny"], sun_behind_small_cloud: ["white_sun_small_cloud", "white_sun_with_small_cloud",], umbrella: ["umbrella2", "open_umbrella"], hammer_and_wrench: ["tools"], face_with_thermometer: ["thermometer_face"], timer_clock: ["timer"], slightly_smiling_face: ["slightly_smiling", "slight_smile"], upside_down_face: ["upside_down"], money_mouth_face: ["money_mouth"], nerd_face: ["nerd"], hugs: ["hugging", "hugging_face", "smiling_face_with_open_hands"], roll_eyes: ["face_with_rolling_eyes", "rolling_eyes"], slightly_frowning_face: ["slight_frown"], frowning: ["frowning_face", "frowning2", "white_frowning_face"], zipper_mouth_face: ["zipper_mouth"], face_with_head_bandage: ["head_bandage"], hand_with_fingers_splayed: ["raised_hand_with_fingers_splayed", "hand_splayed",], raised_hand: ["hand"], vulcan_salute: ["vulcan", "raised_hand_with_part_between_middle_and_ring_fingers",], police_officer: ["policeman", "cop"], man_walking: ["walking_man"], person_walking: ["walking"], man_bowing: ["bow", "bowing_man"], passenger_ship: ["cruise_ship"], motor_boat: ["motorboat", "boat"], flight_arrival: ["airplane_arriving"], flight_departure: ["airplane_departure"], small_airplane: ["airplane_small"], racing_car: ["race_car"], family_man_woman_boy_boy: ["family_man_woman_boys"], family_man_woman_girl_girl: ["family_man_woman_girls"], family_woman_woman_boy: ["family_women_boy"], family_woman_woman_girl: ["family_women_girl"], family_woman_woman_girl_boy: ["family_women_girl_boy"], family_woman_woman_boy_boy: ["family_women_boys"], family_woman_woman_girl_girl: ["family_women_girls"], family_man_man_boy: ["family_men_boy"], family_man_man_girl: ["family_men_girl"], family_man_man_girl_boy: ["family_men_girl_boy"], family_man_man_boy_boy: ["family_men_boys"], family_man_man_girl_girl: ["family_men_girls"], cloud_with_lightning: ["cloud_lightning"], tornado: ["cloud_tornado", "cloud_with_tornado"], cloud_with_rain: ["cloud_rain"], cloud_with_snow: ["cloud_snow"], studio_microphone: ["microphone2"], honeybee: ["bee"], lion: ["lion_face"], satellite: ["artificial_satellite", "satellite_orbital"], computer_mouse: ["mouse_three_button", "three_button_mouse"], wind_face: ["wind_blowing_face"], man_golfing: ["golfer", "golfing_man"], building_letruction: ["letruction_site"], family_man_woman_girl_boy: ["family"], ice_hockey: ["hockey"], play_or_pause_button: ["play_pause"], film_projector: ["projector"], shopping: ["shopping_bags"], open_book: ["book"], national_park: ["park"], world_map: ["map"], pen: ["pen_ballpoint", "lower_left_ballpoint_pen"], e_mail: ["e-mail", "email"], atom_symbol: ["atom"], mantelpiece_clock: ["clock"], camera_flash: ["camera_with_flash"], film_strip: ["film_frames"], balance_scale: ["scales"], person_surfing: ["surfer"], man_surfing: ["surfing_man"], kiss_woman_man: ["kiss", "couplekiss", "couplekiss_man_woman"], kiss_woman_woman: ["couplekiss_woman_woman", "female_couplekiss"], kiss_man_man: ["couplekiss_man_man", "male_couplekiss"], couple_with_heart_man_man: ["male_couple_with_heart"], couple_with_heart: ["couple_with_heart_woman_man"], couple_with_heart_woman_woman: ["female_couple_with_heart"], clamp: ["compression"], person_in_bed: ["sleeping_accommodation", "sleeping_bed"], om: ["om_symbol"], man_rowing_boat: ["rowing_boat", "rowboat", "rowing_man"], new_moon: ["moon"], fleur_de_lis: ["fleur-de-lis"], face_vomiting: ["puke"], smile: ["grinning_face_with_smiling_eyes"], frowning_with_open_mouth: ["frowning_face_with_open_mouth"], grinning_face: ["grinning"], grinning_face_with_big_eyes: ["smiley"], grinning_face_with_smiling_eyes: ["smile"], grin: ["beaming_face_with_smiling_eyes"], laughing: ["grinning_squinting_face", "satisfied"], sweat_smile: ["grinning_face_with_sweat"], rofl: ["rolling_on_the_floor_laughing"], joy: ["face_with_tears_of_joy"], wink: ["winking_face"], blush: ["smiling_face_with_smiling_eyes"], innocent: ["smiling_face_with_halo"], smiling_face_with_three_hearts: ["smiling_face_with_hearts"], heart_eyes: ["smiling_face_with_heart_eyes"], face_blowing_a_kiss: ["kissing_heart"], kissing_face: ["kissing"], kissing_face_with_closed_eyes: ["kissing_closed_eyes"], kissing_face_with_smiling_eyes: ["kissing_smiling_eyes"], face_savoring_food: ["yum"], face_with_tongue: ["stuck_out_tongue"], winking_face_with_tongue: ["stuck_out_tongue_winking_eye"], zany_face: ["crazy_face"], squinting_face_with_tongue: ["stuck_out_tongue_closed_eyes"], expressionless_face: ["expressionless"], face_without_mouth: ["no_mouth"], smirking_face: ["smirk"], unamused_face: ["unamused"], grimacing: ["grimacing_face"], relieved_face: ["relieved", "relaxed"], pensive_face: ["pensive"], sleepy_face: ["sleepy"], sleeping_face: ["sleeping"], face_with_medical_mask: ["mask"], face_with_crossed_out_eyes: ["dizzy_face"], confused: ["confused_face"], worried: ["worried_face"], open_mouth: ["face_with_open_mouth"], hushed_face: ["hushed"], astonished_face: ["astonished"], flushed_face: ["flushed"], frowning_face_with_open_mouth: ["frowning_with_open_mouth"], anguished_face: ["anguished"], fearful: ["fearful_face"], anxious_face_with_sweat: ["cold_sweat"], sad_but_relieved_face: ["disappointed_relieved"], cry: ["crying_face"], sob: ["loudly_crying_face"], scream: ["face_screaming_in_fear"], confounded_face: ["confounded"], persevering_face: ["persevere"], disappointed_face: ["disappointed"], downcast_face_with_sweat: ["sweat"], weary_face: ["weary"], face_with_steam_from_nose: ["triumph"], enraged_face: ["rage"], angry: ["angry_face"], face_with_symbols_on_mouth: ["face_with_symbols_over_mouth"], smiling_face_with_horns: ["smiling_imp"], angry_face_with_horns: ["imp"], ogre: ["japanese_ogre"], goblin: ["japanese_goblin"], alien_monster: ["space_invader"], grinning_cat: ["smiley_cat"], grinning_cat_with_smiling_eyes: ["smile_cat"], joy_cat: ["cat_with_tears_of_joy"], smiling_cat_with_heart_eyes: ["heart_eyes_cat"], cat_with_wry_smile: ["smirk_cat"], weary_cat: ["scream_cat"], crying_cat: ["crying_cat_face"], see_no_evil_monkey: ["see_no_evil"], hear_no_evil_monkey: ["hear_no_evil"], speak_no_evil_monkey: ["speak_no_evil"], heart_with_arrow: ["cupid"], heart_with_ribbon: ["gift_heart"], growing_heart: ["heartpulse"], beating_heart: ["heartbeat"], heart_exclamation: ["heavy_heart_exclamation", "heavy_heart_exclamation_mark_ornament",], heart: ["red_heart"], 100: ["hundred_points"], anger_symbol: ["anger"], collision: ["boom"], sweat_droplets: ["sweat_drops"], dashing_away: ["dash"], waving_hand: ["wave"], victory_hand: ["v"], backhand_index_pointing_left: ["point_left"], backhand_index_pointing_right: ["point_right"], backhand_index_pointing_up: ["point_up_2"], backhand_index_pointing_down: ["point_down"], index_pointing_up: ["point_up"], "+1": ["thumbs_up", "thumbsup"], "-1": ["thumbs_down", "thumbsdown"], raised_fist: ["fist"], oncoming_fist: ["facepunch", "punch"], left_facing_fist: ["fist_left"], right_facing_fist: ["fist_right"], clap: ["clapping_hands"], raising_hands: ["raised_hands"], folded_hands: ["pray"], nail_polish: ["nail_care"], flexed_biceps: ["muscle"], ear_with_hearing_aid: ["hear_with_hearing_aid"], mouth: ["lips"], person: ["adult"], person_blond_hair: ["person_with_blond_hair"], person_beard: ["bearded_person"], man_red_hair: ["man_red_haired"], man_curly_hair: ["man_curly_haired"], man_white_hair: ["man_white_haired"], woman_red_hair: ["woman_red_haired"], woman_curly_hair: ["woman_curly_haired"], woman_white_hair: ["woman_white_haired"], blonde_woman: ["woman_blond_hair"], blonde_man: ["man_blond_hair"], older_person: ["old_person", "older_adult"], man_frowning: ["frowning_man"], woman_frowning: ["frowning_woman"], man_pouting: ["pouting_man"], woman_pouting: ["pouting_woman"], person_pouting: ["person_with_pouting_face"], man_gesturing_no: ["no_good_man"], woman_gesturing_no: ["no_good_woman"], person_gesturing_no: ["no_good"], man_gesturing_ok: ["ok_man"], woman_gesturing_ok: ["ok_woman"], man_tipping_hand: ["tipping_hand_man"], woman_tipping_hand: ["tipping_hand_woman"], person_tipping_hand: ["information_desk_person"], man_raising_hand: ["raising_hand_man"], woman_raising_hand: ["raising_hand_woman"], person_raising_hand: ["raising_hand"], woman_bowing: ["bowing_woman"], woman_police_officer: ["policewoman"], woman_detective: ["female_detective"], guard: ["guardsman"], woman_guard: ["guardswoman"], person_with_skullcap: ["man_with_gua_pi_mao"], letruction_worker_man: ["man_letruction_worker"], letruction_worker_woman: ["woman_letruction_worker"], woman_wearing_turban: ["woman_with_turban"], man_wearing_turban: ["man_with_turban"], person_with_veil: ["bride_with_veil"], baby_angel: ["angel"], santa_claus: ["santa"], merperson: ["mermaid"], man_getting_massage: ["massage_man"], woman_getting_massage: ["massage_woman", "massage"], person_getting_haircut: ["haircut"], man_getting_haircut: ["haircut_man"], woman_getting_haircut: ["haircut_woman"], woman_walking: ["walking_woman"], man_with_white_cane: ["man_with_probing_cane"], woman_with_white_cane: ["woman_with_probing_cane"], woman_running: ["running_woman"], man_running: ["running_man", "runner"], woman_dancing: ["dancer"], people_with_bunny_ears: ["dancing_women", "dancers"], person_in_suit_levitating: ["business_suit_levitating", "man_in_business_suit_levitating", "levitate",], men_with_bunny_ears: ["dancing_men"], woman_golfing: ["golfing_woman"], woman_surfing: ["surfing_woman"], woman_rowing_boat: ["rowing_woman"], woman_swimming: ["swimming_woman"], man_swimming: ["swimming_man", "swimmer"], woman_bouncing_ball: ["basketball_woman"], woman_lifting_weights: ["weight_lifting_woman"], man_lifting_weights: ["weight_lifting_man"], man_biking: ["biking_man", "bicyclist"], woman_biking: ["biking_woman"], woman_mountain_biking: ["mountain_biking_woman"], man_mountain_biking: ["mountain_biking_man", "mountain_bicyclist"], person_taking_bath: ["bath"], women_holding_hands: ["two_women_holding_hands"], woman_and_man_holding_hands: ["couple"], men_holding_hands: ["two_men_holding_hands"], family: ["family_man_woman_boy"], dog: ["dog2"], cat: ["cat2"], tiger: ["tiger2"], horse: ["racehorse"], cow: ["cow2"], pig: ["pig2"], fox: ["fox_face"], ewe: ["sheep"], camel: ["dromedary_camel"], mouse: ["mouse2"], rabbit: ["rabbit2"], panda: ["panda_face"], front_facing_baby_chick: ["hatched_chick"], spouting_whale: ["whale2"], spiral_shell: ["shell"], sheaf_of_rice: ["ear_of_rice"], leaf_fluttering_in_wind: ["leaves"], red_apple: ["apple"], ear_of_corn: ["corn"], cheese_wedge: ["cheese"], french_fries: ["fries"], hot_dog: ["hotdog"], cooking: ["fried_egg"], pot_of_food: ["stew"], bento_box: ["bento"], cooked_rice: ["rice"], curry_rice: ["curry"], steaming_bowl: ["ramen"], roasted_sweet_potato: ["sweet_potato"], fish_cake_with_swirl: ["fish_cake"], soft_ice_cream: ["icecream"], birthday_cake: ["birthday"], shortcake: ["cake"], glass_of_milk: ["milk_glass"], hot_beverage: ["coffee"], teacup_without_handle: ["tea"], bottle_with_popping_cork: ["champagne"], cocktail_glass: ["cocktail"], beer_mug: ["beer"], clinking_beer_mugs: ["beers"], mate: ["maté"], ice: ["ice_cube"], shushing_face: ["sushing_face"], fork_and_knife_with_plate: ["fork_knife_plate", "plate_with_cutlery"], kitchen_knife: ["hocho", "knife"], globe_showing_europe_africa: ["earth_africa"], globe_showing_americas: ["earth_americas"], globe_showing_asia_australia: ["earth_asia"], snow_capped_mountain: ["mountain_snow"], beach_with_umbrella: ["beach_umbrella", "parasol_on_ground", "beach"], office_building: ["office"], post_office: ["european_post_office"], castle: ["european_castle"], sunset: ["city_sunrise"], hot_springs: ["hotsprings"], barber_pole: ["barber"], locomotive: ["steam_locomotive"], high_speed_train: ["bullettrain_side"], bullet_train: ["bullettrain_front"], train: ["train2"], automobile: ["red_car", "car"], sport_utility_vehicle: ["blue_car"], delivery_truck: ["truck"], bicycle: ["bike"], bus_stop: ["busstop"], fuel_pump: ["fuelpump"], police_car_light: ["rotating_light"], horizontal_traffic_light: ["traffic_light"], airplane_departure: ["flight_departure"], airplane_arrival: ["flight_arrival", "airplane_arriving"], hourglass_done: ["hourglass"], hourglass_not_done: ["hourglass_flowing_sand"], twelve_o_clock: ["clock12"], twelve_thirty: ["clock1230"], one_o_clock: ["clock1"], one_thirty: ["clock130"], two_o_clock: ["clock2"], two_thirty: ["clock230"], three_o_clock: ["clock3"], three_thirty: ["clock330"], four_o_clock: ["clock4"], four_thirty: ["clock430"], five_o_clock: ["clock5"], five_thirty: ["clock530"], six_o_clock: ["clock6"], six_thirty: ["clock630"], seven_o_clock: ["clock7"], seven_thirty: ["clock730"], eight_o_clock: ["clock8"], eight_thirty: ["clock830"], nine_o_clock: ["clock9"], nine_thirty: ["clock930"], ten_o_clock: ["clock10"], ten_thirty: ["clock1030"], eleven_o_clock: ["clock11"], eleven_thirty: ["clock1130"], new_moon_face: ["new_moon_with_face"], first_quarter_moon_face: ["first_quarter_moon_with_face"], last_quarter_moon_face: ["last_quarter_moon_with_face"], sun: ["sunny"], full_moon_face: ["full_moon_with_face"], ringed_planet: ["ringer_planet"], glowing_star: ["star2"], shooting_star: ["stars"], high_voltage: ["zap"], snowman: ["snowman_with_snow"], snowman_without_snow: ["snowman2"], ocean: ["water_wave"], party_popper: ["tada"], pine_decoration: ["bamboo"], japanese_dolls: ["dolls"], carp_streamer: ["flags"], moon_viewing_ceremony: ["rice_scene"], red_envelope: ["red_gift_envelope"], wrapped_gift: ["gift"], admission_tickets: ["tickets"], soccer_ball: ["soccer"], american_football: ["football"], in_hole: ["golf"], fishing_pole: ["fishing_pole_and_fish"], running_shirt: ["running_shirt_with_sash"], skis: ["ski"], bullseye: ["dart"], yoyo: ["yo_yo", "yo-yo"], water_pistol: ["gun"], pool_8_ball: ["8ball"], puzzle_piece: ["jigsaw"], spade_suit: ["spades"], heart_suit: ["hearts"], diamond_suit: ["diamonds"], club_suit: ["clubs"], joker: ["black_joker"], mahjong_red_dragon: ["mahjong"], artist_palette: ["art"], glasses: ["eyeglasses"], sunglasses: ["dark_sunglasses"], t_shirt: ["tshirt", "shirt"], woman_s_clothes: ["womans_clothes"], clutch_bag: ["pouch"], shopping_bags: ["shopping"], backpack: ["school_satchel"], man_s_shoe: ["mans_shoe"], running_shoe: ["athletic_shoe"], high_heeled_shoe: ["high_heel"], woman_s_sandal: ["sandal"], woman_s_boot: ["boot"], woman_s_hat: ["womans_hat"], top_hat: ["tophat"], graduation_cap: ["mortar_board"], rescue_worker_s_helmet: ["rescue_worker_helmet", "helmet_with_cross", "helmet_with_white_cross",], gem_stone: ["gem"], muted_speaker: ["mute"], speaker_low_volume: ["speaker"], speaker_medium_volume: ["sound"], speaker_high_volume: ["loud_sound"], megaphone: ["mega"], bell_with_slash: ["no_bell"], musical_notes: ["notes"], headphone: ["headphones"], mobile_phone: ["iphone"], mobile_phone_with_arrow: ["calling"], telephone: ["phone"], fax_machine: ["fax"], laptop: ["computer"], computer_disk: ["minidisc"], optical_disk: ["cd"], film_frames: ["film_strip"], clapper_board: ["clapper"], television: ["tv"], camera_with_flash: ["camera_flash"], videocassette: ["vhs"], magnifying_glass_tilted_left: ["mag"], magnifying_glass_tilted_right: ["mag_right"], light_bulb: ["bulb"], red_paper_lantern: ["izakaya_lantern"], rolled_up_newspaper: ["newspaper_roll", "newspaper2"], money_bag: ["moneybag"], yen_banknote: ["yen"], dollar_banknote: ["dollar"], euro_banknote: ["euro"], pound_banknote: ["pound"], chart_increasing_with_yen: ["chart"], closed_mailbox_with_raised_flag: ["mailbox"], closed_mailbox_with_lowered_flag: ["mailbox_closed"], open_mailbox_with_raised_flag: ["mailbox_with_mail"], open_mailbox_with_lowered_flag: ["mailbox_with_no_mail"], ballot_box_with_ballot: ["ballot_box"], pencil: ["pencil2"], date: ["calendar"], tear_off_calendar: ["calendar"], chart_increasing: ["chart_with_upwards_trend"], chart_decreasing: ["chart_with_downwards_trend"], linked_paperclips: ["paperclips"], locked: ["lock"], unlocked: ["unlock"], locked_with_pen: ["lock_with_ink_pen"], locked_with_key: ["closed_lock_with_key"], white_cane: ["probing_cane"], roll_of_paper: ["roll_of_toilet_paper"], cigarette: ["smoking"], moai: ["moyai"], atm_sign: ["atm"], litter_in_bin_sign: ["put_litter_in_its_place"], wheelchair_symbol: ["wheelchair"], men_s_room: ["mens"], women_s_room: ["womens"], water_closet: ["wc"], prohibited: ["no_entry_sign"], no_littering: ["do_not_litter"], non_potable_water: ["non-potable_water"], no_one_under_eighteen: ["underage"], up_arrow: ["arrow_up"], up_right_arrow: ["arrow_upper_right"], right_arrow: ["arrow_right"], down_right_arrow: ["arrow_lower_right"], down_arrow: ["arrow_down"], down_left_arrow: ["arrow_lower_left"], left_arrow: ["arrow_left"], up_left_arrow: ["arrow_upper_left"], up_down_arrow: ["arrow_up_down"], right_arrow_curving_left: ["leftwards_arrow_with_hook"], left_arrow_curving_right: ["arrow_right_hook"], right_arrow_curving_up: ["arrow_heading_up"], right_arrow_curving_down: ["arrow_heading_down"], clockwise_vertical_arrows: ["arrows_clockwise"], counterclockwise_arrows_button: ["arrows_counterclockwise"], back_arrow: ["back"], end_arrow: ["end"], on_arrow: ["on"], soon_arrow: ["soon"], top_arrow: ["top"], dotted_six_pointed_star: ["six_pointed_star"], scorpio: ["scorpius"], shuffle_tracks_button: ["twisted_rightwards_arrows"], repeat_button: ["repeat"], repeat_single_button: ["repeat_one"], play_button: ["arrow_forward"], fast_forward_button: ["fast_forward"], reverse_button: ["arrow_backward"], fast_reverse_button: ["rewind"], last_track_button: ["previous_track_button", "track_previous", "previous_track",], upwards_button: ["arrow_up_small"], fast_up_button: ["arrow_double_up"], downwards_button: ["arrow_down_small"], fast_down_button: ["arrow_double_down"], dim_button: ["low_brightness"], bright_button: ["high_brightness"], antenna_bars: ["signal_strength"], multiply: ["heavy_multiplication_x"], plus: ["heavy_plus_sign"], minus: ["heavy_minus_sign"], divide: ["heavy_division_sign"], double_exclamation_mark: ["bangbang"], exclamation_question_mark: ["interrobang"], red_question_mark: ["question"], white_question_mark: ["grey_question"], white_exclamation_mark: ["grey_exclamation"], red_exclamation_mark: ["exclamation"], recycling_symbol: ["recycle"], trident_emblem: ["trident"], japanese_symbol_for_beginner: ["beginner"], hollow_red_circle: ["o"], white_check_mark: ["check_mark_button"], check_box_with_check: ["ballot_box_with_check"], check_mark: ["heavy_check_mark"], cross_mark: ["x"], cross_mark_button: ["negative_squared_cross_mark"], double_curly_loop: ["loop"], eight_pointed_star: ["eight_pointed_black_star"], trade_mark: ["tm"], hash: ["keycap_hash", "keycap_#"], asterisk: ["keycap_asterisk", "keycap_*", "keycap_star"], zero: ["keycap_0"], one: ["keycap_1"], two: ["keycap_2"], three: ["keycap_3"], four: ["keycap_4"], five: ["keycap_5"], six: ["keycap_6"], seven: ["keycap_7"], eight: ["keycap_8"], nine: ["keycap_9"], ten: ["keycap_10", "keycap_ten"], input_latin_uppercase: ["capital_abcd"], input_latin_lowercase: ["abcd"], 1234: ["input_numbers"], input_symbols: ["symbols"], input_latin_letters: ["abc"], a_button_blood_type: ["a"], ab_button_blood_type: ["ab"], b_button_blood_type: ["b"], cl_button: ["cl"], cool_button: ["cool"], free_button: ["free"], information_source: ["information"], id_button: ["id"], circled_m: ["m"], new_button: ["new"], ng_button: ["ng"], o_button_blood_type: ["o2"], ok_button: ["ok"], p_button: ["parking"], sos_button: ["sos"], up_button: ["up"], vs_button: ["vs"], japanese_vacancy_button: ["u7a7a"], japanese_discount_button: ["u5272"], japanese_here_button: ["koko"], japanese_not_free_of_charge_button: ["sa", "u6709", "japanese_service_charge_button",], japanese_application_button: ["u7533"], japanese_bargain_button: ["ideograph_advantage"], japanese_prohibited_button: ["u7981"], japanese_acceptable_button: ["accept", "u6709"], japanese_congratulations_button: ["congratulations"], japanese_secret_button: ["secret"], japanese_open_for_business_button: ["u55b6"], japanese_monthly_amount_button: ["u6708"], japanese_passing_grade_button: ["u5408"], japanese_no_vacancy_button: ["u6e80"], japanese_free_of_charge_button: ["u7121"], japanese_reserved_button: ["u6307"], blue_circle: ["large_blue_circle"], red_triangle_pointed_up: ["small_red_triangle"], red_triangle_pointed_down: ["small_red_triangle_down"], diamond_with_a_dot: ["diamond_shape_with_a_dot_inside"], chequered_flag: ["checkered_flag"], triangular_flag: ["triangular_flag_on_post"], åland_islands: ["aland_islands"], cocos_keeling_islands: ["cocos_islands"], cote_d_ivoire: ["cote_divoire"], china: ["cn", "flag_cn"], curaçao: ["curacao"], czechia: ["czech_republic"], germany: ["de", "flag_de"], ceuta_melilla: ["ceuta_and_melilla"], spain: ["es", "flag_es"], european_union: ["eu"], france: ["fr", "flag_fr"], hong_kong_sar_china: ["hong_kong"], heard_mcdonald_islands: ["heard_and_mc_donald_islands"], italy: ["it", "flag_it"], japan: ["jp", "flag_jp"], south_korea: ["kr", "flag_kr"], north_macedonia: ["macedonia"], myanmar_burma: ["myanmar"], macao_sar_china: ["macau"], russia: ["ru", "flag_ru"], svalbard_jan_mayen: ["svalbard_and_jan_mayen"], eswatini: ["swaziland"], turkiye: ["tr"], united_states: ["us", "flag_us"], united_kingdom: ["uk", "gb", "flag_gb"], };
		let resolvedEmojiName = Object.keys(emojiAliases).find((key) =>
			emojiAliases[key].includes(emojiName)
		) || emojiName;
		return Object.keys(emojiReplacements).find(
			(key) => emojiReplacements[key] === resolvedEmojiName
		);
	}
})();
