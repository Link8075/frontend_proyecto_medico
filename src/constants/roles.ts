export const ROLES = {
    ADMIN: 'admin',
    MEDICO: 'medico',
    PACIENTE: 'paciente'
} as const;

export type RoleKeys = keyof typeof ROLES;
export type RoleValues = typeof ROLES[RoleKeys];