//src/utils/validator.test.js
import { validateName } from './validator';

// A "describe" block creates a test suite for a specific feature.
describe('validateName utility', () => {

  // Test Case 1: The "Happy Path" - valid names
  describe('when given a valid name', () => {
    it('should return true for a simple valid name', () => {
      const result = validateName('ValidName');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return true for a name with allowed numbers', () => {
      const result = validateName('ValidName123');
      expect(result.isValid).toBe(true);
    });

    it('should return true for a name at the minimum length', () => {
        const result = validateName('abcde');
        expect(result.isValid).toBe(true);
    });


    it('should return true for a name at the maximum length', () => {   
        const result = validateName('validNameIsGood123');
        expect(result.isValid).toBe(true);
    });

  });

  // Test Case 2: Invalid Length
  describe('when given a name with invalid length', () => {
    it('should return false for a name shorter than 5 characters', () => {
      const result = validateName('four');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('between 5 and 20 characters');
    });

    it('should return false for a name longer than 20 characters', () => {
      const result = validateName('thisNameIsWayTooLong123');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('between 5 and 20 characters');
    });
  });

  // Test Case 3: Invalid Characters
  describe('when given a name with special characters', () => {
    it.each(['name-invalid', 'name_invalid', 'name.invalid', 'name*invalid', 'name#invalid', 'name/invalid'])
    ('should return false for a name containing "%s"', (invalidName) => {
      const result = validateName(invalidName);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Cannot contain special characters');
    });
     it('should return false for a name containing spaces', () => {
        const result = validateName('invalid name');
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Cannot contain special characters (_,.*#/-) or spaces.');
    });
  });
  
  // Test Case 4: Invalid Number Usage
  describe('when given a name with invalid number usage', () => {
    it('should return false for a name containing only numbers', () => {
      const result = validateName('1234567');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Cannot consist of only numbers');
    });

    it('should return false for a name with more than 3 numbers', () => {
      const result = validateName('InvalidName1234');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Cannot contain more than 3 numbers');
    });
  });
});