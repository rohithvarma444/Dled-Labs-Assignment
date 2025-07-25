export interface FocusLossEvent{
    sessionId: string | null,
    timeStamp: number | null,
    durationSeconds: number,
}

export interface SessionReport{
    sessionId: string,
    focusLossHistory: FocusLossEvent[],
    totalSwitches: number,
    totalTimeAway: number,
    trustscore: number
}

