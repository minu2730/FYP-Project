import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const passwordToggle = () => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? (
    <FaEyeSlash onClick={() => setVisible(!visible)} />
  ) : (
    <FaEye onClick={() => setVisible(!visible)} />
  );
  const InputType = visible ? "text" : "password";
  return [InputType, Icon];
};

export default passwordToggle;
