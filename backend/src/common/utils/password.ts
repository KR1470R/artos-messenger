import { promisify } from 'node:util';
import * as crypto from 'crypto';

const pbkdf2 = promisify(crypto.pbkdf2);
const scrypt = promisify(crypto.scrypt);

class Password {
  private static iterations = 50000;
  private static keyLength = 32;
  private static string = 'abcdefghijklmnopqrstuvwxyz';
  private static numeric = '0123456789';
  private static punctuation = '!@#$%^*()_+~|[]:;?,.-=';

  private static generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  static async toHash(password: string) {
    try {
      const salt = this.generateSalt();
      const derivedKey = await pbkdf2(
        password,
        salt,
        this.iterations,
        this.keyLength,
        'sha256',
      );
      return `${derivedKey.toString('hex')}.${salt}`;
    } catch (err) {
      throw new Error(`Failed to generate hash: ${err.toString()}`);
    }
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    try {
      const [hashedPassword, salt] = storedPassword.split('.');
      const derivedKey = (
        await pbkdf2(
          suppliedPassword,
          salt,
          this.iterations,
          this.keyLength,
          'sha256',
        )
      ).toString('hex');
      return (
        hashedPassword.length === derivedKey.length &&
        crypto.timingSafeEqual(
          Buffer.from(hashedPassword),
          Buffer.from(derivedKey),
        )
      );
    } catch (err) {
      throw new Error(`Failed to compare passwords: ${err.toString()}`);
    }
  }

  static async toAESHash(password: string, secret: string) {
    try {
      const iv = crypto.randomBytes(16);
      const salt = this.generateSalt();
      const cipher = crypto.createCipheriv(
        'aes-256-ctr',
        (await scrypt(secret, salt, 32)) as crypto.CipherKey,
        iv,
      );
      const encrypted = Buffer.concat([
        cipher.update(password),
        cipher.final(),
      ]);
      return `${iv.toString('hex')}:${encrypted.toString('hex')}:${salt}`;
    } catch (err) {
      throw new Error(`Failed to generate AES hash: ${err.toString()}`);
    }
  }

  static async decryptAESHash(hash: string, secret: string) {
    try {
      const [ivPart, contentPart, salt] = hash.split(':');
      if (!ivPart || !contentPart || !salt)
        throw new Error('Invalid hash provided.');
      const iv = Buffer.from(ivPart, 'hex');
      const content = Buffer.from(contentPart, 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-ctr',
        (await scrypt(secret, salt, 32)) as crypto.CipherKey,
        iv,
      );
      const decrypted = Buffer.concat([
        decipher.update(content),
        decipher.final(),
      ]);

      // check if the provided password encrypted with the same secret
      return new TextDecoder('utf-8', { fatal: true }).decode(decrypted);
    } catch (err) {
      throw new Error(`Failed to decrypt AES hash: ${err.toString()}`);
    }
  }

  static generate(len = 20) {
    try {
      let password = '';

      while (password.length < len) {
        const entity1 = Math.ceil(
          this.string.length * Math.random() * Math.random(),
        );
        const entity2 = Math.ceil(
          this.numeric.length * Math.random() * Math.random(),
        );
        const entity3 = Math.ceil(
          this.punctuation.length * Math.random() * Math.random(),
        );
        let hold = this.string.charAt(entity1);
        hold = password.length % 2 === 0 ? hold.toUpperCase() : hold;
        password +=
          hold +
          this.numeric.charAt(entity2) +
          this.punctuation.charAt(entity3);
      }

      return password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')
        .substring(0, len);
    } catch (err) {
      throw new Error(`Failed to generate password: ${err.toString()}`);
    }
  }
}

export default Password;
