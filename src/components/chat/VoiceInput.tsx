import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setHasPermission(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      if (event.error === "not-allowed") {
        setHasPermission(false);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive",
        });
      }
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      // Only send final results
      if (event.results[0].isFinal) {
        setIsProcessing(true);
        onTranscript(transcript);
        setTimeout(() => {
          setIsProcessing(false);
          setIsListening(false);
        }, 500);
      }
    };

    // Check for permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch(() => {
        setHasPermission(false);
      });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast, onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (hasPermission === false) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`text-muted-foreground ${className}`}
        onClick={() => {
          toast({
            title: "Microphone access required",
            description:
              "Please allow microphone access in your browser settings.",
            variant: "destructive",
          });
        }}
      >
        <MicOff className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${isListening ? "text-primary" : "text-muted-foreground"} ${className}`}
      onClick={toggleListening}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isListening ? (
        <Mic className="h-5 w-5 animate-pulse" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceInput;

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
