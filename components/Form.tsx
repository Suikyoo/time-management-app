import { Keyboard, Pressable, TouchableOpacity, Switch, TextInputProps, ColorValue, ScrollView } from "react-native"
import { ThemedButton, ThemedInput, ThemedText, ThemedView } from "./ThemedComponents"
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router"
import { colors } from "@/lib/color/color";
import { useState } from "react";
import { ColorProperties, rgbaColor } from "react-native-reanimated/lib/typescript/Colors";


//this component is used as the most-external wrapper for a form modal route. 
//It allows for the user to exit the route when clicking on the screen beyond the form

export default function Form({children}: {children: React.ReactNode}) {
  return (
    <Pressable className="w-full h-full" onPressOut={() => {Keyboard.isVisible() ? Keyboard.dismiss() : router.back()}}>
      <ThemedView reset className="bg-zinc-100 dark:bg-zinc-900 m-auto flex flex-col justify-start w-3/4 h-50 py-5 px-7 box-border">
        <Pressable onPressOut={e => e.stopPropagation()}>
          {children}
        </Pressable>
      </ThemedView>
    </Pressable>
  )
}

export interface Status {
  name: string;
  color: ColorValue;
}

interface HeaderProps {
  children: React.ReactNode;
}

interface FooterProps {
  submitFunc: (status: Status, setStatus: React.Dispatch<React.SetStateAction<Status>>) => Promise<void>;
}

interface FieldProps<T> {
  fieldName: string;
  fieldValue: T
  onFieldSet: (value: T) => void;
}

interface TextFieldProps extends TextInputProps, FieldProps<string> {}

interface TimeFieldProps extends FieldProps<Date>{
  disabled: boolean;

}

interface SwitchFieldProps extends FieldProps<boolean> {}

interface ColorFieldProps extends FieldProps<ColorValue> { disabled: boolean }

Form.Header = ({children}: HeaderProps) => (
  <ThemedText>{children}</ThemedText>
)

Form.Footer = ({submitFunc}: FooterProps) => {
  const [status, setStatus] = useState<Status>({name: "", color: "black"});
  return (
    <ThemedView>
      <ThemedText style={{color: status.color}}>{status.name}</ThemedText>
      <ThemedButton onPressOut={async() => await submitFunc(status, setStatus)} className="rounded-md mb-2">
        <ThemedText className="!text-white dark:!text-black text-center">Submit</ThemedText>
      </ThemedButton>
      <ThemedButton onPressOut={() => router.back()} className="rounded-md !bg-transparent" >
        <ThemedText className="!text-dark dark:!text-white text-center">Go Back</ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}

Form.TextField = ({fieldName, fieldValue, onFieldSet,...rest}: TextFieldProps) => (
  
  <ThemedView>
    <ThemedText>{fieldName}</ThemedText>
    <ThemedInput value={fieldValue} onChangeText={onFieldSet} {...rest} />
  </ThemedView>
)

Form.TimeField = ({fieldName, fieldValue, onFieldSet, disabled,...rest}: TimeFieldProps) => (
  <ThemedView>
    <ThemedText>{fieldName}</ThemedText>
    <DateTimePicker 
      mode="time" 
      value={fieldValue} 
      onChange={(event, date) => date && onFieldSet(date)} 
      disabled={disabled} 
      display="compact"
      timeZoneName="Etc/Greenwich"
    />
  </ThemedView>
)

Form.SwitchField = ({fieldName, fieldValue, onFieldSet,...rest}: SwitchFieldProps) => (
  <ThemedView>
    <ThemedText style={{opacity: fieldValue ? 1. : 0.5}}>{fieldName}</ThemedText>
    <Switch  value={fieldValue} onValueChange={onFieldSet} {...rest} className="-translate-x-3 scale-90" />
  </ThemedView>
)

Form.ColorField = ({fieldName, fieldValue, onFieldSet, disabled, ...rest}: ColorFieldProps) => (
  <ThemedView>
    <ThemedText>{fieldName}</ThemedText>
    <ThemedView className="h-10">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-red-200 rounded-full">
        <ThemedView className="flex flex-row">
          {
            colors.map((c, index) => (
              <TouchableOpacity 
                disabled={disabled}
                onPressOut={() => onFieldSet(c)}
                key={index.toString()}
              >
                <ThemedView className="w-6 h-6 m-2 rounded-full" style={[{backgroundColor: c, outlineColor: "white", outlineOffset: 2}, fieldValue === c ? {outlineWidth: 2} : {}]}>
                </ThemedView>
              </TouchableOpacity>
            ))
          }
        </ThemedView>
      </ScrollView>
    </ThemedView>
  </ThemedView>

)
