import {useColorScheme} from "nativewind";
import {createContext, useContext} from "react";
import {Text, TextProps, View, ViewProps} from "react-native";


interface ThemedViewProps extends ViewProps{
  inherited?: string;
}

const ThemeContext = createContext<string>('');


export function ThemedView({className, inherited, children, ...props}: ThemedViewProps) {
  //this does nothing for now, but on the case where I have default native-wind styles, this is gonna be useful
  //styles defined outside this scope (className props) should have useColorScheme() statement in their own scopes
  const {colorScheme} = useColorScheme();

  return (
    <View {...props} className={`${className} ${inherited}`}>
      <ThemeContext.Provider value={inherited || ""}>
        {children}
      </ThemeContext.Provider>
    </View>
  )

}

export function ThemedText({className, children, ...props}: TextProps) {
  const inherited = useContext(ThemeContext);

  const {colorScheme} = useColorScheme();

  return (
    <Text {...props} className={`${className} ${inherited}`}>
      {children}
    </Text>

  )

}
