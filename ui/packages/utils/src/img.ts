/// 替换图片的域名
export const replaceImageDomain = (htmlCode: string, imageDomain: string, is_plus = true) => {
	// 使用正则表达式匹配图片地址并替换
	var modifiedHtml = htmlCode.replace(/<img[^>]*\bsrc="([^"]*)"[^>]*>/g, function (match, imgUrl) {
		// 添加云存储前缀
		var cloudImageUrl = imgUrl;
		if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
			// 去掉图片地址上的图片域名
			if (!is_plus) {
				cloudImageUrl = imgUrl.replace(imageDomain, '');
			}
		} else {
			if (is_plus) {
				cloudImageUrl = imageDomain + imgUrl;
			}
		}
		// onerror="' + loadImage(cloudImageUrl, () => {}, 2) + '"
		// 返回替换后的 img 标签
		return '<img src="' + cloudImageUrl + '" alt="' + imgUrl + '" />\n';
	});

	return modifiedHtml;
};

// 对url进行合并处理，解决合并时的 `/`问题
export const mergeUrl = (domain: string, relPath: string): string => {
	if (typeof relPath !== 'string' || relPath === '') return relPath;
	// 如果已经包含了请求协议直接返回
	if (relPath.startsWith('http://') || relPath.startsWith('https://')) {
		return relPath;
	}

	if (!domain || domain === '') return relPath;

	// 根据域名进行处理
	if (domain.endsWith('/')) {
		return domain + (relPath.startsWith('/') ? relPath.substring(1) : relPath);
	}
	return domain + (relPath.startsWith('/') ? relPath : `/${relPath}`);
};

// 对图片地址进行兼容处理，解决缺失'/'问题
export const repairImageUrl = (url: string): string => {
	let thisUrl = url;

	// 如果已经包含有'/'则直接返回
	if (url && !/^\//.test(url)) {
		thisUrl = `/${thisUrl}`;
	}

	return thisUrl;
};

// 验证视频地址是否有效
export const validateVideoUrl = async (url: string, timeout = 5000): Promise<boolean> => {
	// 1. 先做 HEAD 请求，验证链接有效性和 Content-Type
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
		});
		clearTimeout(timer);

		// 检查 HTTP 状态码
		if (!response.ok) {
			console.warn(`Request failed with status: ${response.status}`);
			return false;
		}

		// 检查 Content-Type
		const contentType = response.headers.get('Content-Type') || '';
		if (!contentType.startsWith('video/')) {
			console.warn(`Invalid Content-Type: ${contentType}`);
			return false;
		}
	} catch (error) {
		clearTimeout(timer);
		console.error('HEAD request error:', error);
		return false;
	}

	// 2. 创建 video 元素进一步验证能否播放
	return new Promise<boolean>(resolve => {
		const video = document.createElement('video');
		video.src = url;
		video.preload = 'metadata'; // 只预加载元数据

		// 成功加载 metadata，说明是可播放的视频
		video.addEventListener('loadedmetadata', () => {
			resolve(true);
		});

		// 加载错误，比如格式不支持或地址错误
		video.addEventListener('error', () => {
			resolve(false);
		});

		video.load();
	});
};
