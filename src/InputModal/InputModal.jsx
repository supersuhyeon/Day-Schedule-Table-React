import { Stack,Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField } from "@mui/material";
import { useCallback, useEffect } from "react";
import {Controller, useForm} from 'react-hook-form'
import { useRecoilState } from "recoil";
import { timeTableState } from "../store/store";
import {v4 as uuidv1} from "uuid"

// length가 12인 어레이 null로 다 채움 [{value:9, label:9}]
const timeOptions = new Array(12).fill(null).map((e,i)=>({value:i+9, label:i+9}))

const checkOverLap = (A,B)=> B.start < A.start ? B.end > A.start : B.start < A.end //중복체크

export default function InputModal({showModal,handleClose,dayData = 'mon',startTimeData=9,endTimeData=10,planNameData='',planColorData='#d32f2f', idNum}){
    const {formState:{errors}, control, getValues, handleSubmit, reset} = useForm()
    const [timeTableData, setTimeTableData] = useRecoilState(timeTableState)

    // 모달오픈시 입력필드 초기화역활
    useEffect(()=>{
        if(showModal){
            reset({
                planName : planNameData,
                day: dayData,
                startTime: startTimeData,
                endTime: endTimeData,
                planColor: planColorData

            })
        }
    },[showModal, reset, dayData,startTimeData,endTimeData,planNameData,planColorData ])

    // 사용자 입력 내용 전달 및 업데이트
    const Submit = useCallback(({planName, day, startTime, endTime, planColor})=>{
    let valid = true
    for(let index=0; index < timeTableData[day].length; index++){
        if(checkOverLap(timeTableData[day][index], {start:startTime, end:endTime})){
            valid=false
            break;
        }
    }
        if(!valid){
            alert("That time is already booked")
            return
        }

        const data = {
            start : startTime,
            end : endTime,
            name: planName,
            color : planColor,
            id : uuidv1() //submit 시 id가 생성됨 그냥 input버튼누를땐 없음.
        }

        setTimeTableData((prevtimeData)=>{
            return {...prevtimeData, [day] : [...prevtimeData[day], data] }
        })

        handleClose()

    },[timeTableData, setTimeTableData, handleClose])

    //사용자가 수정을 한 후 input버튼을 눌렀을때 handlesubmit되는 과정
    const Edit = useCallback(({planName, day, startTime, endTime, planColor})=>{
        let valid = true
        for(let index=0; index < timeTableData[day].length; index++){
            if(checkOverLap(timeTableData[day][index], {start:startTime, end:endTime})&& timeTableData[day][index]["id"]!==idNum){
                valid=false
                break;
            }
        }
            if(!valid){
                alert("That time is already booked")
                return
            }

            const filteredDayData = [...timeTableData[dayData].filter(data => data.id !== idNum)] //수정할 그 요일의 모든 데이터들, 그중 수정할꺼 제외한 데이터들만 모음
            const newTimeTableData = { //위에 새롭게 만든 필터데이터 업뎃
                ...timeTableData, [dayData]: filteredDayData //  새로운 데이터집합 만들기, 기존 데이터에서 수정할 그 요일의 모든데이터를 필터데이로 덮어씌워줌 수정할 데이터는 없는상태
            }
            const newDayData = [...newTimeTableData[day], { //새로운 데이터집합의 그 요일에 수정된 데이터 추가해줌. 
                start:startTime,
                end:endTime,
                id:idNum,
                name:planName,
                color:planColor
            }]

            setTimeTableData({ //새로운 전체 데이터 집합에 수정된 요일 추가해줌.
                ...newTimeTableData,
                [day]:newDayData
            })

            handleClose()
    },[dayData,handleClose,idNum,setTimeTableData,timeTableData])

    return(
        // 모달창
        <Dialog open={showModal} onClose={handleClose}>
            {/* 사용자가 입력한 인풋의 데이터가 객체로 형태로 출력됨 */}
            <form onSubmit={handleSubmit(idNum? Edit : Submit)}> 
            <DialogTitle style={{fontFamily:'Montserrat'}}>Add New Event</DialogTitle>
            {/* 모달창 안에있는 컨테이너 */}
            <DialogContent style={{width:"400px"}}>
                {/* text input 받는부분 */}
                <Controller control={control} name="planName" rules={{required:true}} render={({field})=>{ return(
                    <TextField {...field} error={!!errors.planName} style={{marginTop:"30px", width:"350px"}} label="Event Name" autoComplete="off"></TextField>
                )}}></Controller>
                {/* text input 에러메세지 받는부분 */}
                {errors.planName?.type === 'required' && (
                    <p style={{color: "#d32f2f", fontFamily:'Montserrat'}}>please enter an event</p>
                )}

                {/* //요일 받는부분, render해서 받은 필드를 넣어줌 */}
                <FormControl style={{marginTop:"30px" }}> 
                    <FormLabel style={{fontFamily:'Montserrat'}}>Day</FormLabel>
                    <Controller control={control} name="day" rules={{required:true}} render={({field})=>{return (
                        <RadioGroup {...field} style={{display:"block" }}>
                            <FormControlLabel value="mon" control={<Radio></Radio>}label="Mon"></FormControlLabel>
                            <FormControlLabel value="tue" control={<Radio></Radio>}label="Tue"></FormControlLabel>
                            <FormControlLabel value="wed" control={<Radio></Radio>}label="Wed"></FormControlLabel>
                            <FormControlLabel value="thu" control={<Radio></Radio>}label="Thu"></FormControlLabel>
                            <FormControlLabel value="fri" control={<Radio></Radio>}label="Fri"></FormControlLabel>
                            <FormControlLabel value="sat" control={<Radio></Radio>}label="Sat"></FormControlLabel>
                            <FormControlLabel value="sun" control={<Radio></Radio>}label="Sun"></FormControlLabel>
                        </RadioGroup>
                    )}}></Controller>
                </FormControl>

               {/* 시간입력 */}
             <Stack spacing={3} style={{marginTop:"10px", width: "350px"}}>
                <Controller control={control} name="startTime" rules={{required:true}} render={({field})=>{return(
                    <TextField {...field} select error={!!errors.startTime || !!(errors.endTime?.type==='validate')} style={{marginTop:'30px', width:"350px"}} label="Starts" placeholder="select starting time">
                        {timeOptions.map((option)=>{return (<MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>)})}
                    </TextField>
                )}}></Controller>
                {errors.startTime?.type === "required" && (
                    <p style={{color:"#d32f2f",fontFamily:'Montserrat'}}>select start time</p>
                )}

                <Controller control={control} name="endTime" rules={{required:true, validate:(value)=> getValues('startTime') < value}} render={({field})=>{return(
                    <TextField {...field} select error={!!errors.endTime} style={{marginTop:'30px', width:"350px"}} label="Ends" placeholder="select ending time">
                        {timeOptions.map((option)=>{return (<MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>)})}
                    </TextField>
                )}}></Controller>
                {errors.endTime?.type === "required" && (
                    <p style={{color:"#d32f2f" ,fontFamily:'Montserrat'}}>select end time</p>
                )}

                {errors.endTime?.type === "validate" && (
                    <p style={{color:"#d32f2f",fontFamily:'Montserrat'}}>please check start time and end time again</p>
                )}
             </Stack>
                {/* 색 입력받기 */}
                <div style={{marginTop:"30px"}}>
                    <label htmlFor="planColor">color : </label>
                    <Controller control={control} name="planColor" render={({field})=>{return(
                        <input {...field} style={{marginLeft:"30px"}} id="planColor" type="color"></input>
                    )}}></Controller>
                </div>

            </DialogContent>

            {/* button영역 */}
            <DialogActions>
                <Button style={{fontFamily:'Montserrat'}} onClick={handleClose}>Cancel</Button>
                <Button style={{fontFamily:'Montserrat'}} type="submit">Add</Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}