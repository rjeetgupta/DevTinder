/**
 * Connection request statuses. `INTERESTED`/`ACCEPTED` are intentionally
 * spelled "intrested"/"accepeted" to match the pre-existing typos baked
 * into the frontend's contract (see devtinder-next `types/request.ts`).
 * Fixing the spelling here would silently break every request the
 * frontend sends.
 */
export const CONNECTION_STATUS = {
    INTERESTED: "intrested",
    IGNORED: "ignored",
    ACCEPTED: "accepeted",
    REJECTED: "rejected",
} as const;

export type ConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];
