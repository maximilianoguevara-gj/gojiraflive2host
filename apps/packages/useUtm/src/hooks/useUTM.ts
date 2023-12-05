import { UtmRoles } from '../interfaces'

interface UtmHookReturn {
  isAllowedToJoinCall: boolean;
  isTotemDevice: boolean;
}

export const useUtm = (utmMedium: string): UtmHookReturn => {
  const isAllowedToJoinCall: boolean = utmMedium === UtmRoles.INTERNAL || utmMedium === UtmRoles.TESTING
  const isTotemDevice: boolean = utmMedium === UtmRoles.TOTEM
  
  return { isAllowedToJoinCall, isTotemDevice }
}