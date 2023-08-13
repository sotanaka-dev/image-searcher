import { motion } from "framer-motion";

const PageTransition = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
