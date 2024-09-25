export type LambdaDefaultReturn = { 
    statusCode: number
    [key: string]: any
}

// == API Request Bodies ==

export type AddEmailBody = {
    email: string;
    current: boolean;
}

export type ManualRunBody = {
    email?: string;
}

export type VerifyEmailBody = {
    email: string;
}