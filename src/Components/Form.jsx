import React, { useState } from 'react'
import AddedServices from './AddedServices'
import { v4 as uuidv4 } from 'uuid'

const Form = () => {

  const [selectedResource,setSelectedResource] = useState('')
  const [data,setData] = useState([])
  const [isEstimated,setIsEstimated] = useState(false)
  const [cost,setCost] = useState(0)
  const [estimation,setEstimation] = useState([{
    resource:'',
    region:'',
    unit:0,
    perUnit:0,
    perService:0
  }])
  
  
  
  const estimationMap = estimation.map(
    (estimation,index)=>
       <section className='container' key={index}>
        
        <p><strong>Service:</strong> {estimation.resource}</p>
        <p><strong>Region:</strong> {estimation.region}</p>
        <p><strong>Unit:</strong> {estimation.unit}</p>
        <p><strong>Cost per Unit:</strong> ₹{estimation.perUnit}</p>
        <p><strong>Total Cost: ₹{estimation.perService}</strong></p>
        
      </section>
      

    
  )

  function removeService(id){
    const result =window.confirm("Do you want to remove the selected service");
    if(result){
    setData(
      (prev)=> 
        prev.filter(
          item=>
            item.id!==id
        )

    )
  }
    
  }



  const dataMap = data.map(
    (item,index)=>
      <AddedServices details={item} key={index} handleclick={()=>removeService(item.id)} />
  )
 
  const services = {
    compute:["ECS","EC2","lambda"],
    database:["RDS","DynamoDb"],
    storage:["S3","EBS"]
  }

  function addOnClick(e){
      e.preventDefault()
      const formData = new FormData(e.target.form)
      const resource = formData.get('service')
      const region = formData.get('region')
      const unit = formData.get('unit')
      if(!resource || !region || !unit){
        alert("please add every field before adding!!")
        return
      }
      const arr ={
        id:uuidv4(),
        resource,      
        region,
        unit
      }
      

      setData(
        prev => [...prev,arr]
      )
      e.target.form.reset()
  }

  function handlesubmit(formData) {
      const resource = formData.get('service')
      const region = formData.get('region')
      const unit = formData.get('unit')
      let payload = [...data]
      if (resource && region && unit) {
        payload.push({ id:uuidv4(),resource, region, unit })
      
      }
      if (payload.length === 0) {
        alert("Please add at least one service before estimating.");
        return;
      }
    
    setData(payload)
      fetch("http://localhost:8080/price_calculation", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(data => {
          setIsEstimated(true);
          setEstimation(data.array);
          setSelectedResource('');
          setCost(data.cost);
        });
    }
  return (
    <>
      <div className='main-class'>
        <form action={handlesubmit}>

          <label htmlFor="resource">Resource Type:</label>
          <select name="resource" id="resource" onChange={(e)=>{
              setSelectedResource(e.target.value)
          }}>
                  <option value="" >select resource type</option>
                  <option value="compute">compute</option>
                  <option value="database">database</option>
                  <option value="storage">storage</option>
          </select>
          {selectedResource &&  
            <>
              <label htmlFor="service">{selectedResource} service:</label>
              <select  name="service" id="service" >
                  <option value="">select service</option>
                  {
                    services[selectedResource].map(
                      (item)=>
                        <option key={item} value={item} >{item}</option>                      
                    )
                  }
              </select>

              <label htmlFor="unit">Unit</label>
              <input type="number" name='unit' id='unit' placeholder='enter the total unit' />

              <label htmlFor="region">Region</label>
              <select name="region" id="region" >
                      <option value="">select region</option>
                      <option value="us_west">us-west</option>
                      <option value="af_south">af-south</option>
                      <option value="me_central">me-central</option>
              </select>
              
             

            </>

            
          
          }
          <input type="button" onClick={addOnClick} name='addbutton' id='addbutton' value='Add More Service' />        
          <button>Estimate Cost</button> 
           
          {data.length > 0 && (
            <div className="selected-services-container">
              <h4 className="selected-services-title">Selected Services:</h4>
              <div className="selected-services-list">{dataMap}</div>
            </div>
          )}

           

                  
      </form>
      
      </div>
      
      
    {isEstimated && <div className='result'>
        <h3>Estimation Summary</h3>
        {estimationMap}
          <div className="price-highlight">
            Total Cost: ₹{cost}
          </div>
        </div>}
    
  
    
    </>
  )
}

export default Form