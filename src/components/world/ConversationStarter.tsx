
'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Hand } from "lucide-react";
import React, { useState } from "react";
import { suggestConversationStarter } from '@/ai/flows/suggest-conversation-starter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ConversationStarterProps {
    nearbyPlayerEmail: string;
    onKnock: () => void;
}

export default function ConversationStarter({ nearbyPlayerEmail, onKnock }: ConversationStarterProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await suggestConversationStarter({
                userContext: 'A software engineer who loves hiking and trying new coffee shops.',
                otherUserContext: 'A graphic designer who is into photography and vintage films.',
            });

            toast({
                title: "Icebreaker Suggestion ✨",
                description: result.conversationStarter,
                duration: 9000,
            });
        } catch (error) {
            console.error('AI Error:', error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Could not generate a suggestion. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-secondary/50 border-dashed h-[188px]">
            <CardHeader>
                <CardTitle className="text-lg">You're near {nearbyPlayerEmail}!</CardTitle>
                <CardDescription>Break the ice, or just say hello.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                 <Button onClick={onKnock} variant="outline">
                    <Hand className="mr-2 h-4 w-4" />
                    Knock
                </Button>
                <Button onClick={handleGenerate} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? (
                        <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Suggest Icebreaker
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
