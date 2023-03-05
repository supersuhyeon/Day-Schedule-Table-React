import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material'
import { useRecoilValue } from 'recoil'
import { timeTableState } from '../store/store'
import TimeTableRow from './TimeTableRow'
import { styled } from '@mui/material/styles'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useCallback, useRef, useState } from 'react'
import InputModal from '../InputModal/InputModal'
import html2canvas from 'html2canvas'
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const hourData = Array.from({length:11}, (i,j)=>{return j+9})
//[9,10,11,12,13,14,15,16,17,18,19]

const MyTable = styled(Table)({
    "& tr,td,th" : {
        border: "1px solid rgba(224,224,224,1)",
        fontFamily : "Montserrat"
    }
})

function TimeTable(){
const screenRef = useRef(null)
const timeTableData = useRecoilValue(timeTableState) //전체 값만 가져옴
const [showModal, setShowModal] = useState(false)
const [editInfo, setEditInfo] = useState({})
const handleClose = useCallback(()=>{
    setShowModal(false)
    setEditInfo({})
},[])

const Edit = useCallback((day,id)=>{
  const {start, end, name, color} = timeTableData[day].find((planInfo) => {return planInfo.id === id})
  setEditInfo({
    dayData:day,
    startTimeData:start,
    endTimeData:end,
    planNameData:name,
    planColorData:color,
    idNum:id
  })  
  setShowModal(true)
}, [timeTableData])

const handleCaptureClick = ()=>{
    html2canvas(screenRef.current).then((canvas) => {
        const imgData = canvas.toDataURL();
        const downloadLink = document.createElement("a");
        downloadLink.href = imgData;
        downloadLink.download = "screen-capture.png";
        downloadLink.click();
    })
}

    return(
        <>
        <TableContainer sx={{width: "80%", minWidth:"650px", marginLeft:"auto", marginRight:"auto",marginTop:"auto"}} ref={screenRef}>
            <Typography fontFamily='Montserrat' variant='h2' fontWeight={10} component="div" align='center' marginBottom={4}>
                Work schedule
            </Typography>
            <Button sx={{float:"right" , fontFamily:'Montserrat', color:"black"}} endIcon={<FileDownloadIcon></FileDownloadIcon>} onClick={handleCaptureClick}>download</Button>
            <Button variant='contain' sx={{float:"right" , fontFamily:'Montserrat'}} endIcon={<AddBoxIcon></AddBoxIcon>} onClick={()=>{return setShowModal(true)}}>add new event</Button>
            <MyTable>
            {/* <Table> */}
                <TableHead>
                    <TableRow>
                        <TableCell align='center' width={100}>Time</TableCell>
                        <TableCell align='center' width={200}>Mon</TableCell>
                        <TableCell align='center' width={200}>Tue</TableCell>
                        <TableCell align='center' width={200}>Wed</TableCell>
                        <TableCell align='center' width={200}>Thu</TableCell>
                        <TableCell align='center' width={200}>Fri</TableCell>
                        <TableCell align='center' width={200}>Sat</TableCell>
                        <TableCell align='center' width={200}>Sun</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hourData.map((time, index)=>{return <TableRow key={index}>
                        <TableCell align="center">{`${time}:00 - ${time+1}:00`}</TableCell>
                        <TimeTableRow timeNum={time} Edit={Edit}></TimeTableRow>
                    </TableRow>})}
                </TableBody>
            {/* </Table> */}
            </MyTable>
        </TableContainer>
        <InputModal showModal={showModal} handleClose={handleClose} {...editInfo}></InputModal>
        </>
    )
}

export default TimeTable