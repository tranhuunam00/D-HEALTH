import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Băm mật khẩu an toàn sử dụng bcryptjs với Salt Rounds = 10
 * @param password Mật khẩu thô (plaintext)
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Mật khẩu không được để trống.');
  }
  if (password.length < 8) {
    throw new Error('Mật khẩu phải chứa ít nhất 8 ký tự.');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Kiểm tra mật khẩu thô với mã băm đã lưu
 * @param password Mật khẩu thô
 * @param hash Chuỗi mã băm trong CSDL
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
}
