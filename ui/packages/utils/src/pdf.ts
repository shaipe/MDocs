// import html2Pdf from 'html2pdf.js';
// import { PDFDocument } from 'pdf-lib';

export class PdfMerger {
	elements: Array<HTMLElement>;
	pdfUrls: Array<string>;

	constructor() {
		this.elements = [];
		this.pdfUrls = [];
	}

// 	addElement(element: HTMLElement) {
// 		this.elements.push(element);
// 		return this;
// 	}

// 	addUrl(url: string) {
// 		this.pdfUrls.push(url);
// 		return this;
// 	}

// 	merge() {
// 		const { elements, pdfUrls } = this;

// 		// Check if running in a browser environment
// 		if (typeof window === 'undefined') {
// 			throw new Error('html2pdf.js can only be used in a browser environment');
// 		}

// 		// 创建一个空的PDF文档
// 		return new Promise(async (resolve, reject) => {
// 			let mergedPdfDoc: any = await PDFDocument.create();
// 			// Step 1: 将HTML节点转换为PDF
// 			for (let i = 0; i < elements.length; i++) {
// 				const blob = await html2Blob(elements[i]);
// 				const pdfDoc = await PDFDocument.load(await blob.arrayBuffer());
// 				if (mergedPdfDoc === null) {
// 					mergedPdfDoc = pdfDoc;
// 				} else {
// 					mergedPdfDoc = await PDFDocument.create();
// 					const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
// 					copiedPages.forEach((page: any) => mergedPdfDoc.addPage(page));
// 				}
// 			}

// 			// Step 2: 加载远程PDF文件
// 			for (let i = 0; i < pdfUrls.length; i++) {
// 				const externalPdfBytes = await fetch(pdfUrls[i]).then(res => res.arrayBuffer());
// 				const pdfDoc = await PDFDocument.load(externalPdfBytes);
// 				const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
// 				copiedPages.forEach((page: any) => mergedPdfDoc.addPage(page));
// 			}

// 			const mergedPdfBytes = await mergedPdfDoc.save();

// 			// Step 4: 创建用于在线预览的Blob URL
// 			const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

// 			resolve(mergedPdfBlob);
// 		});
// 	}
}

export const blobToBase64 = (blob: Blob) => {
	return new Promise((resolve, _) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
};

// // 将元素转化为canvas元素
// // 通过 放大 提高清晰度
// // width为内容宽度
// export async function toCanvas(element, width) {
//   // canvas元素
//   const canvas = await html2canvas(element, {
//    // allowTaint: true, // 允许渲染跨域图片
//     scale: window.devicePixelRatio * 3  // 增加清晰度
//   });
//   // 获取canavs转化后的宽度
//   const canvasWidth = canvas.width;
//   // 获取canvas转化后的高度
//   const canvasHeight = canvas.height;
//   // 高度转化为PDF的高度
//   const height = (width / canvasWidth) * canvasHeight;
//   // 转化成图片Data
//   const canvasData = canvas.toDataURL(''image/jpeg'', 1.0);
//   //console.log(canvasData)
//   return { width, height, data: canvasData };
// }

// const html2Blob = async (element: HTMLElement) => {
// 	// Step 1: 将HTML节点转换为PDF
// 	const opt = {
// 		margin: 1,
// 		filename: 'html-to-pdf.pdf',
// 		image: { type: 'jpeg', quality: 0.98 },
// 		html2canvas: { scale: 2 },
// 		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
// 	};

// 	// 使用 `html2pdf.js` 生成 PDF
// 	const blob: Blob = await html2Pdf().from(element).set(opt).outputPdf('blob');

// 	return blob;
// };

