
import Child from "./ChildComponent";
import * as XLSX from 'xlsx';
import React, { useState } from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import "./styles.css";

const statusObject={
  "0":'blue', //proposed
  "1":"yellow", //pending
  "2":"green",//completed
  "3":"pink", //started
  "4":"red",
  "proposed":"blue",
  "pending":"yellow",
  "completed":"green",
  "started":"pink",
}

const options = {
  size: 250,
  minSize: 20,
  gutter: 0,
  provideProps: true,
  numCols: 4,
  fringeWidth: 80,
  yRadius: 100,
  xRadius: 100,
  cornerRadius: 50,
  showGuides: false,
  compact: true,
  gravitation: 5
};


export default function App(props) {
  const [datas, setData] = React.useState(null);
  const [groupData,setGroupData]=useState(null)
  const [projectData,setProjectData]=useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // console.log(file)
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook =XLSX .read(event.target.result, { type: 'binary' });
      console.log(workbook.SheetNames)
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      console.log('sheetData',sheetData)

      let newData={
        data:[]
      }
      sheetData.forEach((e)=>{
        const find=newData.data.find((f)=>f.group==e.GROUP)
        if(!find){
          newData.data.push({
            group:e.GROUP,
            groupData:[
              {
                program:e['PROGRAM'],
                project:e['PROJECT'],
                estimated_time:e['ESTIMATED TIME'],
                estimated_value:e['ESTIMATED VALUE'],
                estimated_date:e['ESTIMATED DATE'],
                actual_date:e['ACTUAL DATE'],
                actual_time:e['ACTUAL TIME'],
                actual_value:e['ACTUAL VALUE'],
                status:e['STATUS']

              }
            ]
          })
        }
        else{
          const newDataa=newData.data.map((t)=>{
            if(t.group==find.group){
              return {
                ...t,
                groupData:[
                  ...t.groupData,
                  {
                    program:e['PROGRAM'],
                project:e['PROJECT'],
                estimated_time:e['ESTIMATED TIME'],
                estimated_value:e['ESTIMATED VALUE'],
                estimated_date:e['ESTIMATED DATE'],
                actual_date:e['ACTUAL DATE'],
                actual_time:e['ACTUAL TIME'],
                actual_value:e['ACTUAL VALUE'],
                status:e['STATUS']
                  }
                ]
              }
            }
            return t
          })
          newData.data=newDataa

        }
        // console.log(Object.keys(e))
      })

      newData.data=newData.data.map((f)=>{
        const group=f.group
        const totalProjects=f.groupData.length
        const truePropsed=f.groupData.every((g)=>g.status=='proposed')
        const truePending=f.groupData.every((g)=>g.status=='pending')
        const trueCompleted=f.groupData.every((g)=>g.status=='completed')
        const trueStarted=f.groupData.every((g)=>g.status=='started')
        const groupStatus=truePropsed?0:truePending?1:trueCompleted?2:trueStarted?3:4
        const filterCompleted=f.groupData.filter((g)=>g.status=='completed')
        const totalCompleted=(filterCompleted.length/totalProjects)*100
        return {
          group,
          groupData:f.groupData,
          groupStatus,
          percentCompleted:`${totalCompleted.toFixed(2)}%`,
          totalProjects

        }
      })

      newData.data.forEach((e)=>{
        let newGroupData=[]
        e.groupData.forEach((f)=>{
          const findIfProgramInside=newGroupData.find((j)=>j.program==f.program)
          if(!findIfProgramInside){
            newGroupData.push({
              program:f.program,
              projects:[
                {
                  actual_date:f.actual_date,
                  actual_time:f.actual_time,
                  actual_value:f.actual_value,
                  estimated_date:f.estimated_date,
                  estimated_time:f.estimated_time,
                  estimated_value:f.estimated_value,
                  project:f.project,
                  status:f.status
                }
              ]
            })
          }
          else{
            newGroupData=newGroupData.map((h)=>{
              if(h.program==findIfProgramInside.program){
                return {
                  ...h,
                  projects:[
                    ...h.projects,
                    {
                      actual_date:f.actual_date,
                      actual_time:f.actual_time,
                      actual_value:f.actual_value,
                      estimated_date:f.estimated_date,
                      estimated_time:f.estimated_time,
                      estimated_value:f.estimated_value,
                      project:f.project,
                      status:f.status
                    }
                  ]
                }
              }
            })
          }
        })
        e.groupData=newGroupData
      })

      newData.data.forEach((e)=>{
        e.groupData.forEach((f)=>{
          const truePropsed=f.projects.every((g)=>g.status=='proposed')
        const truePending=f.projects.every((g)=>g.status=='pending')
        const trueCompleted=f.projects.every((g)=>g.status=='completed')
        const trueStarted=f.projects.every((g)=>g.status=='started')
        const programStatus=truePropsed?0:truePending?1:trueCompleted?2:trueStarted?3:4
        f.programStatus=programStatus
        })
      })


      newData.total_projects=sheetData.length
      console.log('new Data',newData)
      setData(newData);
      setGroupData(null)
      setProjectData(null)
    };
    if(file){
      reader.readAsBinaryString(file);
    }

  };





  return (
    <>
    <div style={{display:"flex",marginTop:"3rem",justifyContent:"center",alignItems:"center",gap:"2rem"}} className=" flex  mt-16 justify-center items-center gap-8">
      <div style={{position:"relative"}} className="relative">
      <label htmlFor="excel" style={{backgroundColor:"#1d4ed8",padding:'0.5rem',borderRadius:"0.2rem"}} className="  bg-blue-500 p-2 rounded-xl box-border">Choose Excel File</label>
      <input style={{visibility:"hidden",position:"absolute"}} className="invisible absolute" accept=".xlsx" id="excel" type="file" onChange={handleFileUpload} />
      </div>
      {(groupData || projectData) && <div>
        <button 
         style={{backgroundColor:"#1d4ed8",padding:'0.5rem',borderRadius:"0.2rem",color:'white'}}
        onClick={()=>{
          if(projectData){
            setProjectData(null)
          }
          else if(groupData){
            setGroupData(null)
          }
        }}
        className=" bg-blue-500 p-2 rounded-xl box-border">Previous</button>
      </div>}
    </div>

    <div style={{display:"flex",gap:"2rem"}} className="flex gap-8">
    {datas && !groupData && <BubbleUI
        options={options}
        className={"myBubbleUI"}
      >
              {datas.data?.map((data, i) => {


          return (
            <div
            className="child p-4"
            style={{minWidth:`${((data.totalProjects/datas.total_projects)*100).toFixed(2)}%`,minHeight:`${((data.totalProjects/datas.total_projects)*100).toFixed(2)}%`,borderColor:statusObject[data.groupStatus],padding:"2rem"}}
              // className="child"
              key={i}
            >
                <div
                style={{display:'flex',flexDirection:'column',alignItems:'center'}}
                  className="flex flex-col items-center"
                  onClick={() => {
                    setGroupData({
                      group:data.group,
                      groupData:data.groupData

                  }
                  )
                  }}
                >

                  <p className="text-xl" style={{wordBreak:"break-word",fontSize:"1.2rem"}}>{data.group}</p>
                  <p style={{wordBreak:"break-word"}}>{((data.totalProjects/datas.total_projects)*100).toFixed(2)}%</p>
                  <p style={{wordBreak:"break-word"}}>{data.totalProjects} Projects</p>
                  
                  {/* {data.program && groupData && <p style={{wordBreak:"break-word"}}>{data.program}</p>}
                  {data.project && !groupData && <p style={{wordBreak:"break-word"}}>{data.project}</p>} */}
                </div>
              </div>
          );
        })}
      </BubbleUI>}
      {groupData && !projectData && <BubbleUI
        options={options}
        className={"myBubbleUI"}
      >
              {groupData.groupData?.map((data, i) => {


          return (
            <Child
              className="child"
              key={i}
            >
              <div
              style={{borderColor:statusObject[data.programStatus],height:"50%",width:"50%",display:'flex',flexDirection:'column',alignItems:'center',padding:"1rem"}}
                  className="child p-4 flex flex-col items-center"
                  onClick={() => {
                    // const program_name=data.program
                    //     const filterData=[]
                    //     datas.data.forEach((e)=>{
                    //         if(e.group==groupData.group){
                    //             e.groupData.forEach((f)=>{
                    //                 if(f.program==program_name){
                    //                     filterData.push(f)
                    //                 }
                    //             })
                    //         }
                            
                    //     })
                        // console.log('filter',filterData)
                        setProjectData(data.projects)
                  }}
                >
                  <p style={{wordBreak:"break-word"}}>{data.program}</p>
                  <p style={{wordBreak:"break-word"}}>{data.projects.length} projects</p>
                </div>
              </Child>
          );
        })}
      </BubbleUI>}
      {projectData && <BubbleUI
        options={options}
        className={"myBubbleUI"}
      >
              {projectData?.map((data, i) => {


          return (
            <Child
              className="child"
              key={i}
            >
              <div
              style={{borderColor:statusObject[data.status],height:"100%",width:"100%",display:'flex',flexDirection:'column',alignItems:'center',gap:'0.1rem',fontSize:'0.8rem'}}
                  className="child p-4 text-xs gap-2 flex flex-col items-center"
                  onClick={() => {
                  }}
                >
                  <p className="text-xl" style={{wordBreak:"break-word",fontSize:"1.2rem"}}>{data.project}</p>
                  <p style={{wordBreak:"break-word"}}>Actual Time: {data.actual_time}</p>
                  <p style={{wordBreak:"break-word"}}>Actual Value: {data.actual_value}</p>
                  <p style={{wordBreak:"break-word"}}>Estimated Time: {data.estimated_time}</p>
                  <p style={{wordBreak:"break-word"}}>Estimated Value: {data.estimated_value}</p>



                </div>
              </Child>
          );
        })}
      </BubbleUI>}
      {datas && <div style={{display:'flex',color:"white",flexDirection:"column",justifyContent:'center',gap:'1rem'}} className="flex text-white flex-col justify-center gap-4">
        <p style={{fontSize:"2rem"}} className="text-3xl">Total {datas.total_projects} Projects </p>
        <div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}} className="flex gap-2 items-center">
            <div style={{width:"1rem",height:"1rem",backgroundColor:"#1d4ed8",borderRadius:"50%"}} className="w-[1rem] h-[1rem] bg-blue-700 rounded-full"></div>
            <p>Proposed</p>
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}} className="flex gap-2 items-center">
            <div style={{width:"1rem",height:"1rem",backgroundColor:"#fde047",borderRadius:"50%"}} className="w-[1rem] h-[1rem] bg-yellow-300 rounded-full"></div>
            <p>Pending</p>
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}} className="flex gap-2 items-center">
            <div style={{width:"1rem",height:"1rem",backgroundColor:"#16a34a",borderRadius:"50%"}} className="w-[1rem] h-[1rem] bg-green-600 rounded-full"></div>
            <p>Completed</p>
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}} className="flex gap-2 items-center">
            <div style={{width:"1rem",height:"1rem",backgroundColor:"#ec4899",borderRadius:"50%"}} className="w-[1rem] h-[1rem] bg-pink-500 rounded-full"></div>
            <p>Started</p>
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}} className="flex gap-2 items-center">
            <div style={{width:"1rem",height:"1rem",backgroundColor:"#ef4444",borderRadius:"50%"}} className="w-[1rem] h-[1rem] bg-red-500 rounded-full"></div>
            <p>None</p>
          </div>
        </div>
      </div>}
    </div>
    </>
  );
}
