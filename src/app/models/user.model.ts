export interface User {
    username: string;
    password: string;
    isAdmin: boolean;
    isSupervisor?: boolean;
}