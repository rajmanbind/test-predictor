import { IOption } from "@/types/GlobalTypes"

export const PGCourseSubTypeList: IOption[] = [
  { id: "DM/MCh", text: "DM / MCh" },
  { id: "DNB", text: "DNB" },
  { id: "DNB-Diploma", text: "DNB-Diploma" },
  { id: "MD/MS/Diploma", text: "MD / MS / Diploma" },
  { id: "MD/MSAyurveda", text: "MD / MS Ayurveda" },
  { id: "MDHomeopathy", text: "MMD Homeopathy" },
  { id: "MDS", text: "MDS" },
]

export const states = [
  { id: 0, text: "All" },
  { id: 1, text: "Andaman and Nicobar Islands" },
  { id: 2, text: "Andhra Pradesh" },
  { id: 3, text: "Arunachal Pradesh" },
  { id: 4, text: "Assam" },
  { id: 5, text: "Bihar" },
  { id: 6, text: "Chandigarh" },
  { id: 7, text: "Chhattisgarh" },
  { id: 8, text: "Dadra and Nagar Haveli" },
  { id: 9, text: "Daman and Diu" },
  { id: 37, text: "Delhi" },
  { id: 10, text: "Goa" },
  { id: 11, text: "Gujarat" },
  { id: 12, text: "Haryana" },
  { id: 13, text: "Himachal Pradesh" },
  { id: 14, text: "Jammu and Kashmir" },
  { id: 15, text: "Jharkhand" },
  { id: 16, text: "Karnataka" },
  { id: 17, text: "Kerala" },
  { id: 18, text: "Ladakh" },
  { id: 19, text: "Lakshadweep" },
  { id: 20, text: "Madhya Pradesh" },
  { id: 21, text: "Maharashtra" },
  { id: 22, text: "Manipur" },
  { id: 23, text: "Meghalaya" },
  { id: 24, text: "Mizoram" },
  { id: 25, text: "Nagaland" },
  { id: 26, text: "Odisha" },
  { id: 27, text: "Pondicherry" },
  { id: 28, text: "Punjab" },
  { id: 29, text: "Rajasthan" },
  { id: 30, text: "Sikkim" },
  { id: 31, text: "Tamil Nadu" },
  { id: 32, text: "Telangana" },
  { id: 33, text: "Tripura" },
  { id: 34, text: "Uttar Pradesh" },
  { id: 35, text: "Uttarakhand" },
  { id: 36, text: "West Bengal" },
   
  
]

export const closingRanksStates = [
  { id: 37, text: "Central" },
  ...states?.slice(1),
]

export const courses = [
  { id: 0, text: "MD" },
  { id: 1, text: "MS" },
  { id: 2, text: "MDS" },
  { id: 3, text: "MBBS" },
  { id: 4, text: "BDS" },
]

export const courseType = [
  { id: "ug", text: "UG" },
  { id: "pg", text: "PG" },
]

export const categories = [
  { id: 0, text: "General" },
  { id: 1, text: "General-EWS" },
  { id: 2, text: "EWS" },
  { id: 3, text: "EWS-PwD" },
  { id: 4, text: "OBC" },
  { id: 5, text: "OBC-PwD" },
  { id: 6, text: "Open" },
  { id: 7, text: "Open-PwD" },
  { id: 8, text: "SC" },
  { id: 9, text: "SC-PwD" },
  { id: 10, text: "ST" },
  { id: 11, text: "ST-PwD" },
]

export const instituteTypes = [
  { id: 0, text: "DEEMED MC" },
  { id: 1, text: "PRIVATE MC" },
  { id: 2, text: "PRIVATE UNIVERSITY MC" },
]

export function years(): IOption[] {
  const yearsArr: IOption[] = []

  for (let i = 0; i < 28; i++) {
    yearsArr.push({
      id: String(2023 + i),
      text: String(2023 + i),
    })
  }

  return yearsArr
}

export function configYearOptions(): IOption[] {
  const yearsArr: IOption[] = []

  for (let i = 0; i < 27; i++) {
    yearsArr.push({
      id: `${String(2023 + i)} - ${String(2024 + i)}`,
      text: `${String(2023 + i)} - ${String(2024 + i)}`,
    })
  }

  return yearsArr
}

export const quotas = [
  {
    id: 169,
    text: "AIIMS - Foreign Nationals",
  },
  {
    id: 149,
    text: "AIIMS - Open",
  },
  {
    id: 148,
    text: "All India Quota",
  },
  {
    id: 150,
    text: "AMU - Internal",
  },
  {
    id: 151,
    text: "AMU - NRI",
  },
  {
    id: 152,
    text: "AMU - Open",
  },
  {
    id: 153,
    text: "BHU - Open",
  },
  {
    id: 154,
    text: "CW of Armed Forces Personnel",
  },
  {
    id: 160,
    text: "Deemed - Jain Minority",
  },
  {
    id: 165,
    text: "Deemed - Muslim Minority",
  },
  {
    id: 168,
    text: "Deemed - NRI",
  },
  {
    id: 166,
    text: "Deemed - Paid Seats (PS)",
  },
  {
    id: 214,
    text: "Delhi Univ - Delhi CW",
  },
  {
    id: 155,
    text: "Delhi Univ - DU Quota (State)",
  },
  {
    id: 156,
    text: "ESI - Insured Persons",
  },
  {
    id: 215,
    text: "IP Univ - Delhi CW",
  },
  {
    id: 157,
    text: "IP Univ - IP Quota (State)",
  },
  {
    id: 159,
    text: "Jamia - Internal",
  },
  {
    id: 161,
    text: "Jamia - Muslim",
  },
  {
    id: 167,
    text: "Jamia - Muslim Women",
  },
  {
    id: 164,
    text: "Jamia - Open",
  },
  {
    id: 163,
    text: "JIPMER - NRI",
  },
  {
    id: 162,
    text: "JIPMER - Open",
  },
  {
    id: 158,
    text: "JIPMER - Pondicherry Domicile",
  },
]


export const paymentType = {
  SINGLE_COLLEGE_CLOSING_RANK: "SINGLE_COLLEGE_CLOSING_RANK",
  STATE_CLOSING_RANK: "STATE_CLOSING_RANK",
  ALL_INDIA_CLOSING_RANK: "ALL_INDIA_CLOSING_RANK",

  PREMIUM_PLAN: "PREMIUM_PLAN",
  COLLEGE_CUT_OFF: "COLLEGE_CUT_OFF",
  RANK_COLLEGE_PREDICTOR: "RANK_COLLEGE_PREDICTOR",
}

export const priceType = {
  COLLEGE_CUT_OFF_UG: "College Cutoff - UG",
  COLLEGE_CUT_OFF_MDS: "College Cutoff - MDS",
  COLLEGE_CUT_OFF_PG: "College Cutoff - PG",
  COLLEGE_CUT_OFF_SS: "College Cutoff - SS",
  COLLEGE_CUT_OFF_DNB: "College Cutoff - DNB",
  COLLEGE_CUT_OFF_INICET: "College Cutoff - INICET",
  COLLEGE_CUT_OFF_AIAPGET: "College Cutoff - AIAPGET",
  ALL_INDIA_COLLEGE_CUT_OFF_UG: "All India College Cutoff - UG",
  ALL_INDIA_COLLEGE_CUT_OFF_MDS: "All India College Cutoff - MDS",
  ALL_INDIA_COLLEGE_CUT_OFF_PG: "All India College Cutoff - PG",
  ALL_INDIA_COLLEGE_CUT_OFF_SS: "All India College Cutoff - SS",
  ALL_INDIA_COLLEGE_CUT_OFF_DNB: "All India College Cutoff - DNB",
  ALL_INDIA_COLLEGE_CUT_OFF_INICET: "All India College Cutoff - INICET",
  ALL_INDIA_COLLEGE_CUT_OFF_AIAPGET: "All India College Cutoff - AIAPGET",
  RANK_COLLEGE_PREDICTOR: "College Predictor",
  SINGLE_COLLEGE_CLOSING_RANK_UG: "Single College Closing Rank - UG",
  SINGLE_COLLEGE_CLOSING_RANK_PG: "Single College Closing Rank - PG",
  SINGLE_COLLEGE_CLOSING_RANK_MDS: "Single College Closing Rank - MDS",
  SINGLE_COLLEGE_CLOSING_RANK_SS: "Single College Closing Rank - SS",
  SINGLE_COLLEGE_CLOSING_RANK_DNB: "Single College Closing Rank - DNB",
  SINGLE_COLLEGE_CLOSING_RANK_INICET: "Single College Closing Rank - PG",
  SINGLE_COLLEGE_CLOSING_RANK_AIAPGET: "Single College Closing Rank - AIAPGET",
  STATE_CLOSING_RANK_UG: "State Closing Rank - UG",
  STATE_CLOSING_RANK_PG: "State Closing Rank - PG",
  STATE_CLOSING_RANK_MDS: "State Closing Rank - MDS",
  STATE_CLOSING_RANK_SS: "State Closing Rank - SS",
  STATE_CLOSING_RANK_DNB: "State Closing Rank - DNB",
  STATE_CLOSING_RANK_INICET: "State Closing Rank - INICET",
  STATE_CLOSING_RANK_AIAPGET: "State Closing Rank - AIAPGET",
  ALL_INDIA_CLOSING_RANK_UG: "All India Closing Rank - UG",
  ALL_INDIA_CLOSING_RANK_PG: "All India Closing Rank - PG",
  ALL_INDIA_CLOSING_RANK_MDS: "All India Closing Rank - MDS",
  ALL_INDIA_CLOSING_RANK_SS: "All India Closing Rank - SS",
  ALL_INDIA_CLOSING_RANK_DNB: "All India Closing Rank - DNB",
  ALL_INDIA_CLOSING_RANK_INICET: "All India Closing Rank - INICET",
  ALL_INDIA_CLOSING_RANK_AIAPGET: "All India Closing Rank - AIAPGET",
  ALL_INDIA_CLOSING_RANK: "All India Closing Rank",
  PREMIUM_PLAN: "Plans",
}

