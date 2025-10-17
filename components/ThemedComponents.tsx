import {useColorScheme} from "nativewind";
import {createContext, useContext} from "react";
import {Text, TextInput, TextInputProps, TextProps, TouchableOpacity, TouchableOpacityProps, View, ViewProps} from "react-native";


interface inheritProps {
  allInherit?: string; 
  textInherit?: string;
  inputInherit?: string;
  buttonInherit?: string;
}

const ThemeContext = createContext<inheritProps>({allInherit: "", textInherit: "", inputInherit: "", buttonInherit: ""});


export function ThemedView({className = "", reset, children, ...props}: inheritProps & ViewProps & {reset?: boolean}) {
  //this does nothing for now, but on the case where I have default native-wind styles, this is gonna be useful
  //styles defined outside this scope (className props) should have useColorScheme() statement in their own scopes

  const ctx = useContext(ThemeContext);

  for (const i of Object.keys(ctx) as (keyof inheritProps)[]) {
    if (reset) {
      ctx[i] = "";
    }
    else {
      ctx[i] = props[i] || ctx[i];
    }

  }
  
  const {colorScheme} = useColorScheme();
  return (
    <View {...props} className={`${className}`}>
      <ThemeContext.Provider value={ctx}>
        {children}
      </ThemeContext.Provider>
    </View>
  )

}

export function ThemedText({className = "", children, ...props}: TextProps) {
  const ctx = useContext(ThemeContext);

  const {colorScheme} = useColorScheme();

  const defaultStyle = `pt-3 pb-2 text-black dark:text-white`;
  console.log(`default-- ${defaultStyle} all-- ${ctx.allInherit} text-- ${ctx.textInherit} class-- ${className}`);

  return (
    <Text {...props} className={`${defaultStyle} ${ctx.allInherit} ${ctx.textInherit} ${className}`}>
      {children}
    </Text>

  )

}

export function ThemedInput({className = "", children, ...props}: TextInputProps) {
  const ctx = useContext(ThemeContext);

  const {colorScheme} = useColorScheme();

  const defaultStyle = ` border-[1px] border-zinc-100 dark:border-zinc-500 text-black dark:text-white rounded-sm box-border py-2 px-1`;
  return (
    <TextInput {...props} className={`${defaultStyle} ${ctx.allInherit} ${ctx.inputInherit} ${className}`} />
  );
}
export function ThemedButton({className = "", children, ...props}: inheritProps & TouchableOpacityProps) {
  const ctx = useContext(ThemeContext);

  props.textInherit = "!text-white dark:!text-black"
  for (const i of Object.keys(ctx) as (keyof inheritProps)[]) {
    ctx[i] = props[i] || ctx[i];
  }

  const {colorScheme} = useColorScheme();

  const defaultStyle = `bg-black dark:bg-white rounded-md flex flex-col justify-center items-center p-1`;
  return (
    <TouchableOpacity {...props} className={`${defaultStyle} ${className}`}>
      <ThemeContext.Provider value={ctx}>
          {children}
      </ThemeContext.Provider>
    </TouchableOpacity>
  );
}
