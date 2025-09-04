'use client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";
import { X } from "lucide-react";
import axios, {AxiosError} from "axios";
import { Imessage } from "@/models/User";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";




type MessageCard = {
    message: Imessage,
    onMessageDelete: (messageId: string) => void
}

export default function MessageCard({ message, onMessageDelete }: MessageCard) {

    const handleDeleteConfirm = async () => {
        try {
            const res = await axios.delete(`/api/delete-message/${message._id}`)
            toast.loading('Deleting...');
            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Error deleting message");
        } finally {
            toast.success('Message deleted!');
        }
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
            </Card>
        </>
    )
}

