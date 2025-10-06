import {TextInput, TextInputProps} from "react-native";
import { useColorScheme } from "nativewind";


export default function Input({className, children, ...props}: TextInputProps) {
  const {colorScheme} = useColorScheme();
  const defaultStyle = `border-2 border-1 border-black dark:border-white`;
  return (
    <TextInput {...props} className={`${defaultStyle} ${className}`} />
  );
}
