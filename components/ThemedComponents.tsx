import {useColorScheme} from "nativewind";
import {createContext, useContext} from "react";
import {Text, TextInput, TextInputProps, TextProps, View, ViewProps} from "react-native";


interface ThemedViewProps extends ViewProps{
  inherited?: string; }

const ThemeContext = createContext<string>('');


export function ThemedView({className, inherited, children, ...props}: ThemedViewProps) {
  //this does nothing for now, but on the case where I have default native-wind styles, this is gonna be useful
  //styles defined outside this scope (className props) should have useColorScheme() statement in their own scopes
  //

  inherited = inherited || useContext(ThemeContext);
  
  const {colorScheme} = useColorScheme();
  return (
    <View {...props} className={`${className || ""}`}>
      <ThemeContext.Provider value={inherited || ""}>
        {children}
      </ThemeContext.Provider>
    </View>
  )

}

export function ThemedText({className, children, ...props}: TextProps) {
  const inherited = useContext(ThemeContext);

  const {colorScheme} = useColorScheme();

  const defaultStyle = `pt-3 pb-2 text-black dark: text-white`;

  return (
    <Text {...props} className={`${defaultStyle} ${inherited} ${className}`}>
      {children}
    </Text>

  )

}

export function ThemedInput({className, children, ...props}: TextInputProps) {
  const inherited = useContext(ThemeContext);

  const {colorScheme} = useColorScheme();

  const defaultStyle = ` border-[1px] border-zinc-100 dark:border-zinc-500 rounded-sm box-border py-2 px-1`;
  return (
    <TextInput {...props} className={`${defaultStyle} ${inherited} ${className}`} />
  );
}
