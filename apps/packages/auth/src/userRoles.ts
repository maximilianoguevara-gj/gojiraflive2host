const Roles = ['BUYER', 'SELLER', 'MODERATOR', 'COHOST'] as const;
export type Role = typeof Roles[number];
