export class BloodType {
  private static readonly VALID_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  public readonly type: string;
  public readonly abo: string;
  public readonly rh: string;

  constructor(typeString: string) {
    if (!typeString || typeof typeString !== 'string') {
      throw new Error('Nhóm máu không hợp lệ (hỗ trợ: A+, A-, B+, B-, AB+, AB-, O+, O-)');
    }
    const normalized = typeString.trim().toUpperCase();
    if (!BloodType.VALID_TYPES.includes(normalized)) {
      throw new Error('Nhóm máu không hợp lệ (hỗ trợ: A+, A-, B+, B-, AB+, AB-, O+, O-)');
    }
    this.type = normalized;
    this.abo = normalized.slice(0, -1);
    this.rh = normalized.slice(-1);
    Object.freeze(this);
  }

  public isUniversalDonor(): boolean {
    return this.type === 'O-';
  }

  public isUniversalRecipient(): boolean {
    return this.type === 'AB+';
  }

  public equals(other: BloodType): boolean {
    if (!(other instanceof BloodType)) return false;
    return this.type === other.type;
  }
}
