import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { motion } from "framer-motion";

export interface AmazingProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const Amazing = ({
  title = "Amazing!",
  description = "This component is absolutely amazing!",
  buttonText = "Click for Amazement",
  onButtonClick = () => console.log("Amazing clicked!"),
}: AmazingProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden border-2 border-primary shadow-lg bg-gradient-to-br from-background to-muted">
        <CardHeader className="bg-primary/10 pb-2">
          <CardTitle className="text-center text-2xl font-bold text-primary">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <motion.p
            className="text-center text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button
              onClick={onButtonClick}
              className="mt-2 font-semibold"
              size="lg"
            >
              {buttonText}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

Amazing.displayName = "Amazing";

export { Amazing };
export default Amazing;
