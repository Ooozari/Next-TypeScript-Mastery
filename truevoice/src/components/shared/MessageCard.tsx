import { Trash2 } from "lucide-react";
import { Imessage } from "@/models/User";
import { Heading, Paragraph } from "@/components/ui/typography";

interface MessageCardProps {
    message: Imessage;
    onDelete?: (id: string) => void;
}

export default function MessageCard({ message, onDelete }: MessageCardProps) {
    return (
        <div
            key={message._id as string}
            className="bg-white/10 backdrop-blur-md border border-teal-300/50 rounded-xl p-6 relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
        >
            {/* Delete Button */}
            {onDelete &&
                <Trash2
                    onClick={() => onDelete(message._id as string)}
                    className="absolute top-2 right-2 h-5 w-5 text-red-400 cursor-pointer hover:text-red-500"
                />
            }


            {/* Content */}
             <Paragraph size="large" className="text-start text-gray-800 font-medium italic leading-relaxed">
                 "{message.content}"
             </Paragraph>
            

            {/* Date */}
             <Paragraph size="sm" className="flex justify-start mt-3 text-gray-400">{new Date(message.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}</Paragraph>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent pointer-events-none"></div>
        </div>
    );
}
