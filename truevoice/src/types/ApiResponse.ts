import { Imessage } from "@/models/User";



// Standarizing API RESPONSE
export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Imessage>,
}