import {Tabs} from "expo-router";
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "@/tailwind.config"
import {useColorScheme} from "nativewind";

export default function TabLayout() {
  const nativeWindConfig = resolveConfig(tailwindConfig);
  const {colorScheme} = useColorScheme();

  return (
      <Tabs>

        <Tabs.Screen 
        name="index" 
        options={{
          title: "Home", 
          headerShown: false ,
          tabBarStyle: {
            backgroundColor: colorScheme === "dark" ?  nativeWindConfig.theme.colors.zinc[950] : nativeWindConfig.theme.colors.zinc[100],
          },
          
        }}/>

        <Tabs.Screen 
        name="settings" 
        options={{
          title: "Settings", headerShown: false
        }}/>

      </Tabs>
      );
}
