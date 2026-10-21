import assert from "node:assert/strict";
import {
  computeRetirementPlan,
  getMinimumContributionByRegion,
  getRetirementAgeByProfile
} from "../calculator.js";

function d(value) {
  return new Date(`${value}T00:00:00`);
}

{
  const plan = computeRetirementPlan({
    birthDate: d("1986-10-19"),
    retirementAgeYears: 60,
    retirementAgeMonths: 0,
    contributedMonths: 150,
    minimumContributionMonths: 180,
    currentDate: d("2026-10-19")
  });

  assert.equal(plan.monthsUntilAge, 240);
  assert.equal(plan.monthsToMinContribution, 30);
  assert.equal(plan.monthsUntilEligible, 240);
  assert.equal(plan.needsDelayedRetirementForContribution, false);
}

{
  const plan = computeRetirementPlan({
    birthDate: d("1960-01-01"),
    retirementAgeYears: 60,
    retirementAgeMonths: 0,
    contributedMonths: 100,
    minimumContributionMonths: 180,
    currentDate: d("2026-10-19")
  });

  assert.equal(plan.monthsUntilAge, 0);
  assert.equal(plan.monthsToMinContribution, 80);
  assert.equal(plan.monthsUntilEligible, 80);
  assert.equal(plan.needsDelayedRetirementForContribution, true);
}

{
  const age = getRetirementAgeByProfile("male", 18);
  assert.equal(age.years, 61);
  assert.equal(age.months, 6);
}

{
  const age = getRetirementAgeByProfile("female-cadre", 8);
  assert.equal(age.years, 55);
  assert.equal(age.months, 8);
}

{
  const months = getMinimumContributionByRegion("national-default", 0);
  assert.equal(months, 180);
}

{
  const months = getMinimumContributionByRegion("shanghai", 12);
  assert.equal(months, 192);
}

{
  const months = getMinimumContributionByRegion("beijing", -24);
  assert.equal(months, 156);
}

console.log("All calculator tests passed.");
