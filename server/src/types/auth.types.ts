export interface JwtPayload {
    _id: string;
    email: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
