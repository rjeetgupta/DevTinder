export const CONNECTION_STATUS = {
    INTERESTED: "interested",
    IGNORED: "ignored",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
} as const;

export type ConnectionStatus =
    (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];
