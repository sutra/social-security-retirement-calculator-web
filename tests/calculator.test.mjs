import assert from "node:assert/strict";
import {
  computeRetirementPlan,
  getMinimumContributionByRegion,
  getNationalMinimumContributionMonthsByRetirementDate,
  getRetirementAgeByProfile,
  getStatutoryRetirementAgeByPolicy
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

{
  const age = getStatutoryRetirementAgeByPolicy("male", d("1965-01-15"));
  assert.equal(age.totalAgeMonths, 721);
  assert.equal(age.policyDelayMonths, 1);
}

{
  const age = getStatutoryRetirementAgeByPolicy("female-worker", d("1975-03-10"));
  assert.equal(age.totalAgeMonths, 602);
  assert.equal(age.policyDelayMonths, 2);
}

{
  const months = getNationalMinimumContributionMonthsByRetirementDate(d("2029-12-01"));
  assert.equal(months, 180);
}

{
  const months = getNationalMinimumContributionMonthsByRetirementDate(d("2033-01-01"));
  assert.equal(months, 204);
}

{
  const months = getNationalMinimumContributionMonthsByRetirementDate(d("2045-01-01"));
  assert.equal(months, 240);
}

console.log("All calculator tests passed.");
