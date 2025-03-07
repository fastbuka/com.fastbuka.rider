// react-native-progress.d.ts
declare module 'react-native-progress/Bar' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    interface ProgressBarProps {
      progress?: number;
      indeterminate?: boolean;
      width?: number;
      height?: number;
      color?: string;
      unfilledColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
      animated?: boolean;
      indeterminateAnimationDuration?: number;
      useNativeDriver?: boolean;
      style?: StyleProp<ViewStyle>;
      // (Add any other props needed from the library)
    }
  
    export default class ProgressBar extends Component<ProgressBarProps> {}
  }
  