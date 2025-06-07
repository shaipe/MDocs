import { encrypt, decrypt } from 'crypto-js/aes';
import { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import md5 from 'crypto-js/md5';
import UTF8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

export interface EncryptionParams {
	key: string;
	iv: string;
}

export class AesEncryption {
	private key: any;
	private iv: any;

	constructor(opt: Partial<EncryptionParams> = {}) {
		const { key, iv } = opt;
		if (key) {
			this.key = parse(key) || '';
		}
		if (iv) {
			this.iv = parse(iv) || '';
		}
	}

	get getOptions() {
		return {
			mode: ECB,
			padding: pkcs7,
			iv: this.iv,
		};
	}

	encryptByAES(cipherText: string) {
		return encrypt(cipherText, this.key, this.getOptions).toString();
	}

	decryptByAES(cipherText: string) {
		return decrypt(cipherText, this.key, this.getOptions).toString(UTF8);
	}
}

export function encryptByBase64(cipherText: string) {
	if (!cipherText) return cipherText;
	return UTF8.parse(cipherText).toString(Base64);
}

export function decodeByBase64(cipherText: string) {
	if (!cipherText) return cipherText;
	return Base64.parse(cipherText).toString(UTF8);
}

export function encryptByMd5(password: string) {
	return md5(password).toString();
}

export const isBase64String = (str: string) => {
	if (!str || typeof str !== 'string') {
		return false;
	}

	const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
	return base64Regex.test(str);
};

// url base64 encode
export const urlEncodeBase64 = (path: string) => {
	return encryptByBase64(path).replace(/\//g, '_');
};

// url base64 decode
export const urlDecodeBase64 = (encodePath: string) => {
    if (!isBase64String(encodePath)) {
        return encodePath;
    }
	return decodeByBase64(encodePath.replace(/_/g, '/'));
};
