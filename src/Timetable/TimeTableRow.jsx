import TimeTableCell from "./TimeTableCell";

export default function TimeTableRow({...props}){
    return(
        <>
        <TimeTableCell day="mon" {...props} ></TimeTableCell>
        <TimeTableCell day="tue" {...props}></TimeTableCell>
        <TimeTableCell day="wed" {...props}></TimeTableCell>
        <TimeTableCell day="thu" {...props}></TimeTableCell>
        <TimeTableCell day="fri" {...props}></TimeTableCell>
        <TimeTableCell day="sat" {...props}></TimeTableCell>
        <TimeTableCell day="sun" {...props}></TimeTableCell>
        </>
    )
}