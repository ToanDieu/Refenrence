export const urlRegex = /^(http(s)?:\/\/)?(www\.)?([\w\d-]+(\.|:){1,})+\w{2,}\/?(\/[^ ]+)?$/;

export const timeRegex = /^([0-9]+[h])?([0-9]+[m])?([0-9]+[s])?$/;

// export const emailPattern = /^[\w/.+-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/; Vu Anhs

export const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const phonePatternWithDomainCode = /^\+49\d{8,13}$/;
export const phonePatternStandard = /^0\d{8,13}$/;
export const phonePatternWithVnDomain = /^\+84\d{8,13}$/;
