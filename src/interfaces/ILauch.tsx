import {CalendarDate} from "react-native-paper-dates/lib/typescript/Date/Calendar";

export interface IListItem {
    id:string,
    name?:string,
    launch_date_unix?:number,
    launch_success?:boolean,
    details?:string,
    image_url?:string|undefined,
    article_url?:string|undefined,
    video_url?:string|undefined,
}


export interface IIndexSearchBarProp {
    searchAction:(params:ICommitActionPrams)=>void,
    filterBtnAction:()=>void
}


export interface ICommitActionPrams{
    startDate?:CalendarDate,
    endDate?:CalendarDate,
    radioValue?:String,
    searchKey?:string,
    sortType?:string
}

export interface ILauchFilterModalProp {
    visiable:boolean
    commitAction:(params:ICommitActionPrams)=>void
    dismiss:()=>void
}