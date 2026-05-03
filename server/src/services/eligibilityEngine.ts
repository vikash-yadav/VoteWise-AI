export class EligibilityEngine {
  /**
   * Evaluates if a user is eligible to vote in India based on standard rules.
   * @param age User's age in years
   * @param isCitizen Whether the user is an Indian citizen
   * @param isResident Whether the user is an ordinary resident of the polling area
   * @returns Eligibility status and missing requirements if any
   */
  public evaluateEligibility(age: number, isCitizen: boolean, isResident: boolean) {
    const reasons: string[] = [];

    if (typeof age !== 'number' || age < 18) reasons.push("Must be at least 18 years old on the qualifying date.");
    if (!isCitizen) reasons.push("Must be an Indian citizen.");
    if (!isResident) reasons.push("Must be an ordinary resident of the polling area.");

    return {
      isEligible: reasons.length === 0,
      missingRequirements: reasons,
      nextStep: reasons.length === 0 ? "registration" : "ineligible"
    };
  }
}
