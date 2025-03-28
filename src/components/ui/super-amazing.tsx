import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { motion } from "framer-motion";

export interface SuperAmazingProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  accentColor?: string;
}

const SuperAmazing = ({
  title = "Super Amazing!",
  description = "This component is absolutely super amazing!",
  buttonText = "Experience Super Amazement",
  onButtonClick = () => console.log("Super Amazing clicked!"),
  accentColor = "primary",
}: SuperAmazingProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="w-full max-w-md mx-auto"
    >
      <Card
        className={`overflow-hidden border-2 border-${accentColor} shadow-xl bg-gradient-to-br from-background to-muted`}
      >
        <CardHeader className={`bg-${accentColor}/10 pb-2`}>
          <CardTitle
            className={`text-center text-2xl font-bold text-${accentColor}`}
          >
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
            className="w-full flex justify-center"
          >
            <Button
              onClick={onButtonClick}
              className={`mt-2 font-semibold bg-${accentColor} hover:bg-${accentColor}/90`}
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

SuperAmazing.displayName = "SuperAmazing";

export { SuperAmazing };
export default SuperAmazing;
