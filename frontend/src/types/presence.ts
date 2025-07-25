export interface PresencePrompt{
    sessionId: string,
    promptTime: string,
    startTime: number
}


export interface PresenceResponse{
    sessionId: string,
    promptTime: string,
    responseTime: number | null,
    status: 'responded' | 'missed'
}

export interface SessionStatus{
    total: number,
    responded: number,
    missed: number,
    responseRate: number
}