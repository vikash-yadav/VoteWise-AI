import { EligibilityEngine } from '../../services/eligibilityEngine';

describe('EligibilityEngine Unit Tests', () => {
  let engine: EligibilityEngine;

  beforeEach(() => {
    engine = new EligibilityEngine();
  });

  describe('evaluateEligibility()', () => {
    it('should return eligible for a valid 18+ year old citizen and resident', () => {
      // Arrange
      const age = 18;
      const isCitizen = true;
      const isResident = true;

      // Act
      const result = engine.evaluateEligibility(age, isCitizen, isResident);

      // Assert
      expect(result.isEligible).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
      expect(result.nextStep).toBe('registration');
    });

    it('should return eligible for someone much older', () => {
      const result = engine.evaluateEligibility(45, true, true);
      expect(result.isEligible).toBe(true);
    });

    it('should fail if user is under 18', () => {
      const result = engine.evaluateEligibility(17, true, true);
      expect(result.isEligible).toBe(false);
      expect(result.missingRequirements).toContain('Must be at least 18 years old on the qualifying date.');
      expect(result.nextStep).toBe('ineligible');
    });

    it('should fail if user is not a citizen', () => {
      const result = engine.evaluateEligibility(25, false, true);
      expect(result.isEligible).toBe(false);
      expect(result.missingRequirements).toContain('Must be an Indian citizen.');
    });

    it('should fail if user is not a resident', () => {
      const result = engine.evaluateEligibility(25, true, false);
      expect(result.isEligible).toBe(false);
      expect(result.missingRequirements).toContain('Must be an ordinary resident of the polling area.');
    });

    it('should return multiple missing requirements if all conditions fail', () => {
      const result = engine.evaluateEligibility(16, false, false);
      expect(result.isEligible).toBe(false);
      expect(result.missingRequirements).toHaveLength(3);
    });

    it('should handle invalid or undefined inputs gracefully', () => {
      // @ts-ignore - testing runtime boundaries
      const result = engine.evaluateEligibility(undefined, null, undefined);
      expect(result.isEligible).toBe(false);
      expect(result.missingRequirements).toHaveLength(3); // All fail
    });
  });
});
