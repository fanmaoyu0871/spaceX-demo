import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    LauchList: undefined,
    LauchDetail: {id:string, title?:string}
};


export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;