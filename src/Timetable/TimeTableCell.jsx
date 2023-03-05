import { TableCell } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { timeTableState } from "../store/store";
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmModal from "../ConfirmModal/ConfirmModal";

export default function TimeTableCell({day, timeNum, Edit}){
    const [timeTableData, setTimeTableData] = useRecoilState(timeTableState)
    const [hover, setHover] = useState(false)
    const [open, setOpen] = useState(false)

    const timeData = useMemo(()=>timeTableData[day].find((time)=>{return time.start <= timeNum && timeNum < time.end}),[day,timeNum,timeTableData])
   
    const handleClose = useCallback(()=>setOpen(false),[])
    const handleConfirm = useCallback(()=>setOpen(true), [])

    const handleDelete = useCallback(()=>{
        setTimeTableData((prevtimeData)=>{
            const newdayData = prevtimeData[day].filter((data)=> data.id !== timeData.id)
            return {
                ...prevtimeData, [day] : newdayData
            }
        })
        setOpen(false)
    },[day, setTimeTableData, timeData?.id])

    const handleEdit = useCallback(()=>{return Edit(day,timeData.id)},[Edit, day, timeData?.id])
    return(
        <>
        {
            // const result = condition1 ? value1 : (condition2 ? value2 : value3);
            //condition1이 참이면 value1을 반환하고, 그렇지 않으면 condition2를 체크하여 condition2가 참이면 value2를 반환하고, 그렇지 않으면 value3를 반환
            timeData?.start === timeNum ? <TableCell style={{backgroundColor:timeData.color, position:"relative"}} align="center" rowSpan={timeData.end - timeData.start} onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
                {timeData.name}
                {hover ? (
                    <div style={{position:"absolute", top:5, right:5}}>
                        <EditIcon style={{cursor:"pointer"}} onClick={handleEdit}></EditIcon>
                        <DeleteIcon style={{cursor:"pointer"}} onClick={handleConfirm}></DeleteIcon>
                    </div>
                ) : null}
                </TableCell>
            : timeData?.start < timeNum && timeNum < timeData?.end ? null : <TableCell></TableCell>
        }
        <ConfirmModal open={open} handleClose={handleClose} handleDelete={handleDelete}></ConfirmModal>
        </>
    )
}