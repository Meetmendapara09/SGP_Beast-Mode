
'use client';

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as Tone from 'tone';

export default function AudioControl() {
    const [audioState, setAudioState] = useState<'suspended' | 'running' | 'closed' | 'interrupted'>('suspended');

    // Reflect the actual state of the audio context
    const handleStateChange = () => {
        if (Tone.getContext()) {
            setAudioState(Tone.getContext().state);
        }
    };
        const startAudio = async () => {
            if (!Tone.getContext()) {
                console.error("Audio context is not available.");
                return;
            }

        if (Tone.getContext().state !== 'running') {
            try {
                // This will be caught by the Phaser scene
                window.dispatchEvent(new Event('start-audio'));
                // We don't set state directly, we let the useEffect poll for the actual context state
            } catch (e) {
                console.error("Could not dispatch start-audio event", e);
            }
        }
    };
    
    return (
        <div className="mt-4">
            <Button
                onClick={startAudio}
                variant="outline"
                className="w-full"
                disabled={audioState === 'running'}
            >
                {audioState === 'running' ? (
                    <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Spatial Audio Enabled
                    </>
                ) : (
                    <>
                        <VolumeX className="mr-2 h-4 w-4" />
                        Enable Spatial Audio
                    </>
                )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
                Enable spatial audio to hear others based on their proximity. For the best experience, use headphones.
            </p>
        </div>
    );
}
