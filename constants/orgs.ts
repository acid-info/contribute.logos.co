// organizations whose public repos we fetch contributions from
// members of these orgs are excluded from results
export const ORGS = ['acid-info', 'codex-storage', 'keycard-tech', 'logos-co', 'waku-org'] as const
export const ORGS_PARAM = ORGS.join(',')
// organizations whose members we exclude from results by default
export const ONLY_EXCLUDE_ORGS = ['status-im', 'vacp2p'] as const
export const ONLY_EXCLUDE_ORGS_PARAM = ONLY_EXCLUDE_ORGS.join(',')
